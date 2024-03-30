import { z } from 'zod';

export const EnvValidationSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test', 'staging'], {
    invalid_type_error:
      "NODE_ENV env variable must be one of 'development', 'production', 'test', 'staging'",
    required_error: 'NODE_ENV env variable is required',
  }),
  PORT: z
    .string({ required_error: 'PORT env variable is required' })
    .transform((port) => parseInt(port)),
  DB_HOST: z.string({ required_error: 'DB_HOST env variable is required' }),
  DB_PORT: z
    .string({ required_error: 'DB_PORT env variable is required' })
    .transform((port) => parseInt(port)),
  DB_USERNAME: z.string({
    required_error: 'DB_USERNAME env variable is required',
  }),
  DB_PASSWORD: z.string({
    required_error: 'DB_PASSWORD env variable is required',
  }),
  DB_NAME: z.string({ required_error: 'DB_NAME env variable is required' }),
  JWT_SECRET: z.string({
    required_error: 'JWT_SECRET env variable is required',
  }),
  ACCESS_TOKEN_EXPIRY_TIME: z.string({
    required_error: 'ACCESS_TOKEN_EXPIRY_TIME env variable is required',
  }),
  REFRESH_TOKEN_EXPIRY_TIME: z.string({
    required_error: 'ACCESS_TOKEN_EXPIRY_TIME env variable is required',
  }), // todo: add validation for access token expiry time should be shorter that refresh token expiry time,
});
