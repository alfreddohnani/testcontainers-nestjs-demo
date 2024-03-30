export abstract class BaseResponseDto {
  /** Http status code for response */
  status: number | undefined;

  /** Http error message */
  error: string | undefined;
}
