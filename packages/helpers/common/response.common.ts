import { Response } from 'express';
import { statusCodeConst } from '../constants/statusCode.constant';

function sendSuccess(
  response: Response,
  statusCode: number,
  data?: unknown,
  message?: string,
) {
  response.status(statusCode).send({
    error: false,
    statusCode,
    message:
      message ??
      statusCodeConst.find((item) => item.code === statusCode)?.status,
    data: data ?? [],
  });
}
function sendFailed(
  response: Response,
  statusCode: number,
  message?: string,
  data?: unknown,
) {
  response.status(statusCode).send({
    error: true,
    statusCode,
    message:
      message ??
      statusCodeConst.find((item) => item.code === statusCode)?.status,
    data: data,
  });
}

const apiResponse = {
  sendSuccess,
  sendFailed,
};

export default apiResponse;
