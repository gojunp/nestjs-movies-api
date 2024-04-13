/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { QueryFailedError } from 'typeorm';
import { ExceptionOrigin } from '../constants/exception.origin.enum';
import {
  MovieApiException,
  MovieApiInternalException,
} from './custom.exception';
import { IExceptionInfo } from './exception-info.interface';
import { POSTGRES_ERROR_MAP } from './postgres.exception.mapper';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  /**
   * Handles TypeORM exceptions.
   * Remaps TypeORM exceptions to project-specific exceptions.
   */
  private typeOrmExceptionHandler(exception: any): IExceptionInfo {
    this.logger.error(`TypeORM exception occurred:`);
    this.logger.error(exception.toString());

    // Get custom exception based on Mongo exception code, or use Internal exception by default
    const handler =
      POSTGRES_ERROR_MAP.get(exception.code) ??
      ((): MovieApiException =>
        new MovieApiInternalException(
          'Something went wrong, please try again',
        ));

    return this.MovieApiErrorHandler(handler());
  }

  /**
   * Handles MovieApiError exceptions.
   */
  private MovieApiErrorHandler(exception: MovieApiException): IExceptionInfo {
    this.logger.error(`Custom exception occurred:`);
    this.logger.error(
      `${exception.exceptionInfo.code} ${exception.exceptionName} - ${exception.exceptionInfo.detail}`,
    );
    return {
      origin: ExceptionOrigin.MOVIEAPI,
      status: +exception.exceptionInfo.status,
      code: exception.exceptionInfo.code,
      exception: exception.exceptionName,
      detail: exception.exceptionInfo.detail,
    };
  }

  /**
   * Logs exception details.
   */
  private logExceptionDetails(exception: Error): void {
    this.logger.error('An exception occurred:');

    // Log exception name
    this.logger.error(exception.toString());

    // Log stack if available
    exception.stack && this.logger.error(exception.stack);

    // Log exception object
    this.logger.error(JSON.stringify(exception));
  }

  /**
   * Handles HTTP exceptions.
   */
  private httpExceptionHandler(exception: HttpException): IExceptionInfo {
    this.logger.error(
      `HTTP Exception (Code ${exception.getStatus()}) | Message: ${
        exception.getResponse()['message']
      }`,
    );

    return {
      origin: ExceptionOrigin.Http,
      status: exception.getStatus(),
      code: 'HTTP-0000',
      exception:
        exception.getResponse()['error'] || 'Internal Server Exception',
      detail: exception.getResponse()['message'] || 'Something went wrong',
    };
  }

  /**
   * Custom exception filter for the entire application.
   */
  catch(
    exception: Error,
    host: ArgumentsHost,
  ): Response<unknown, Record<string, unknown>> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // In cases when error is not handled, return Internal Server Exception as a default
    let data: IExceptionInfo = {
      origin: ExceptionOrigin.UNKNOWN,
      status: 500,
      code: '000',
      exception: 'Internal Server Exception',
      detail: 'Something went wrong',
    };

    // Handle Project-specific exceptions
    if (exception instanceof MovieApiException) {
      data = this.MovieApiErrorHandler(exception);
    }

    // Handle HTTP exceptions
    else if (exception instanceof HttpException) {
      data = this.httpExceptionHandler(exception);
    }

    // Handle TypeORM exceptions
    else if (exception instanceof QueryFailedError) {
      data = this.typeOrmExceptionHandler(exception);
    }

    // Log other exceptions
    else {
      this.logExceptionDetails(exception);
    }

    response.status(data.status).json(data);

    return response;
  }
}
