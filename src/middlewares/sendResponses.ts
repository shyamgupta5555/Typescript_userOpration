import { Response } from 'express';

export async function sendResponse(
  res: Response,
  status: boolean,
  statusCode: number,
  message: string,
  data?: any,
): Promise<Response> {
  if (status === true) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(statusCode).json({
      success: status,
      statusCode: statusCode,
      message: message,
      data: data,
    });
  } else {
    res.setHeader('Content-Type', 'application/json');
    return res.status(statusCode).json({
      success: status,
      statusCode: statusCode,
      message: message,
      data: data || []
    });
  }
}
