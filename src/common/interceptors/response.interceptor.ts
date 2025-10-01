import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../dto/response.dto';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: unknown) => {
        if (data instanceof ApiResponse) {
          return new ApiResponse(data.result, data?.message ?? '성공', data?.status ?? 200);
        }
        if (
          typeof data === 'object' &&
          data !== null &&
          ('data' in data || 'result' in data || 'message' in data || 'status' in data)
        ) {
          let responseData: any = null;
          if ('data' in data) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            responseData = (data as { data: any }).data;
          } else if ('result' in data) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            responseData = (data as { result: any }).result;
          }
          const message = 'message' in data ? (data as { message?: string }).message : '성공';
          const status = 'status' in data ? (data as { status?: number }).status : 200;
          return new ApiResponse(responseData, message, status);
        }
        return new ApiResponse(data, '성공', 200);
      }),
    );
  }
}
