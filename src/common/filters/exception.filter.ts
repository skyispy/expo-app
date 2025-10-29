import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../dto/response.dto';

@Catch()
export class ApiResponseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiResponseExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = 500;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }
    this.logger.error(`Exception caught: ${message}`, exception);

    response.status(status).json(new ApiResponse<null>(null, message, status));
  }
}
