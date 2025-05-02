import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User";
import sendResetEmail from "../services/emailService";
import logger from "../common/utils/logger";
import { sendResponse } from "../middlewares/sendResponses";
import { HttpStatusCodes } from "../common/enum";
import "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, email, password } = req.body;
    const findUserName = await User.findOne({ username: username });
    if (findUserName) {
      logger.error("Username already exists");
      return sendResponse(
        res,
        false,
        HttpStatusCodes.BAD_REQUEST,
        "Username already exists"
      );
    }
    const findEmail = await User.findOne({ email: email });
    if (findEmail) {
      logger.error("Email already exists");
      return sendResponse(
        res,
        false,
        HttpStatusCodes.BAD_REQUEST,
        "Email already exists"
      );
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    logger.info("User registered Successfully");
    return sendResponse(
      res,
      true,
      HttpStatusCodes.CREATED,
      "User Registration Successfully",
      user
    );
  } catch (error) {
    logger.error("Registration Failed: " + error.message);
    return sendResponse(
      res,
      false,
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
      logger.error("Invalid credentials");
      return sendResponse(
        res,
        false,
        HttpStatusCodes.BAD_REQUEST,
        "Invalid credentials"
      );
    }
    let passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch === false) {
      logger.error("Invalid credentials");
      return sendResponse(
        res,
        false,
        HttpStatusCodes.BAD_REQUEST,
        "Invalid credentials"
      );
    }
    req.session["userId"] = user._id.toString();
    logger.info("User logged in successfully");
    return sendResponse(res, true, HttpStatusCodes.OK, "Login successful");
  } catch (error) {
    logger.error("Login Failed: " + error.message);
    return sendResponse(
      res,
      false,
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    console.log("Session ID: ", req.session.userId);
    let userId = req.session?.userId;
    if (!userId) {
      logger.error("User not logged in");
      return sendResponse(
        res,
        false,
        HttpStatusCodes.BAD_REQUEST,
        "User not logged in"
      );
    }
    req.session.destroy((err) => {
      if (err) {
        logger.error("Logout Failed: " + err.message);
        return sendResponse(
          res,
          false,
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
          "Logout failed"
        );
      }

      res.clearCookie("connect.sid", { path: "/" });
      logger.info("User logged out successfully"+ userId);
      return sendResponse(res, true, HttpStatusCodes.OK, "Logout successful");
    });
  } catch (error) {
    logger.error("LogOut Failed: " + error.message);
    return sendResponse(
      res,
      false,
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

export const resetPasswordRequest = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      logger.error("User not found");
      return sendResponse(
        res,
        false,
        HttpStatusCodes.BAD_REQUEST,
        "User not found"
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExp = new Date(Date.now() + 3600000);
    await user.save();

   try{

    // add valid Credentials for email service i added for testing purpose 
     await sendResetEmail(email, token)
    }catch(error){
      logger.error("Email sending failed: " + error.message);
    }
    logger.info("Password reset email sent to " + email + " with token: " + token);
    return sendResponse(res, true, HttpStatusCodes.OK, "Reset email sent");
  } catch (error) {
    logger.error("Resend Password Failed: " + error.message);
    return sendResponse(
      res,
      false,
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExp: { $gt: new Date() },
    });

    if (!user) {
      logger.error("Invalid or expired token");
      return sendResponse(
        res,
        false,
        HttpStatusCodes.BAD_REQUEST,
        "Invalid or expired token"
      );
    }
    user.password = await bcrypt.hash(password, 12);
    user.resetToken = undefined;
    user.resetTokenExp = undefined;
    await user.save();
    logger.info("Password reset successfully");
    return sendResponse(
      res,
      true,
      HttpStatusCodes.OK,
      "Password reset successful"
    );
  } catch (error) {
    logger.error(" Password reset Failed: " + error.message);
    return sendResponse(
      res,
      false,
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};
