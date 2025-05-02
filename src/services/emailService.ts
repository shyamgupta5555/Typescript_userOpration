import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendResetEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  let html = `
  <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Password Reset</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 10px;">
      <h2 style="color: #333;">Reset Your Password</h2>
      <p style="font-size: 16px; color: #555;">
        Hi,<br /><br />
        We received a request to reset your password. Click the button below to set a new password:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="http://localhost:${process.env.PORT}/reset/${token}" target="_blank"
          style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
      </div>
      <p style="font-size: 14px; color: #999;">Thanks,<br />The Team</p>
    </div>
  </body>
</html>

  `;
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: 'Password Reset',
    html:html
  });
};

export default sendResetEmail;