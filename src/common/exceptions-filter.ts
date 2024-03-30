import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { Response } from 'express';
import { BaseResponseDto } from './utils/dto/base-response.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType() === 'http') {
      // do something that is only important in the context of regular HTTP requests (REST)
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      if (exception instanceof HttpException) {
        const httpException = exception;
        const status =
          httpException.getStatus() ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const errorResponse = httpException.getResponse() as Record<
          string,
          any
        >;

        this.logger.error(httpException.stack);

        response.status(status).json({
          error:
            errorResponse?.message ??
            errorResponse?.error ??
            'Internal Server Error',
          status,
        } satisfies BaseResponseDto);
      } else {
        this.logger.error(exception);
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: 'An unexpected error has occured',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        } satisfies BaseResponseDto);
      }
    } else if (host.getType() === 'rpc') {
      // do something that is only important in the context of Microservice requests
    }
    // else if (host.getType<GqlContextType>() === 'graphql') {
    //   // do something that is only important in the context of GraphQL requests

    //   if (exception instanceof HttpException) {
    //     const httpException = exception;
    //     //   const gqlHost = GqlArgumentsHost.create(host);
    //     const status =
    //       httpException.getStatus() ?? HttpStatus.INTERNAL_SERVER_ERROR;
    //     const errorResponse = httpException.getResponse() as Record<
    //       string,
    //       any
    //     >;

    //     this.logger.error(httpException.stack);

    //     return new ApolloError(
    //       errorResponse?.message ?? errorResponse?.error,
    //       status.toString(),
    //       {
    //         exception: {
    //           error:
    //             errorResponse?.message ??
    //             errorResponse?.error ??
    //             'Internal Server Error',
    //           status,
    //           errorCode: errorResponse?.errorCode,
    //         } satisfies BaseResponseDto,
    //       },
    //     );
    //   } else {
    //     this.logger.error(exception);
    //     return new ApolloError(
    //       'An unexpected error has occured',
    //       HttpStatus.INTERNAL_SERVER_ERROR.toString(),
    //       {
    //         exception: {
    //           error: 'An unexpected error has occured',
    //           status: HttpStatus.INTERNAL_SERVER_ERROR,
    //         } satisfies BaseResponseDto,
    //       },
    //     );
    //   }
    // }
  }
}
