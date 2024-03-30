import { NestFactory } from '@nestjs/core';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { urlencoded } from 'express';
import * as winston from 'winston';
import * as morgan from 'morgan';

import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IS_DEV } from './common/constants';
import { flattenValidationErrors } from './common/utils';

async function bootstrap() {
  // create instance of winston logger
  const winstonLogger = winston.createLogger({
    level: IS_DEV ? 'debug' : 'http',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.ms(),
      nestWinstonModuleUtilities.format.nestLike('thewatcher-api', {
        colors: true,
        prettyPrint: true,
      }),
    ),

    transports: [new winston.transports.Console()],
  });
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: winstonLogger,
    }),
  });

  const morganMiddleware = morgan(
    ':remote-addr :method :url :status :res[content-length] - :response-time ms',
    {
      stream: {
        // Configure Morgan to use our custom logger with the http severity
        write: (message: string) => winstonLogger.http(message.trim()),
      },
    },
  );

  app.use(morganMiddleware);

  const configService = app.get(ConfigService);

  if (IS_DEV) {
    const config = new DocumentBuilder()
      .setTitle('Testcontainer Demo API DOCS')
      .setDescription('Testcontainer Demo API DOCS')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      jsonDocumentUrl: 'api/json-spec',
      yamlDocumentUrl: 'api/yaml-spec',
      customSiteTitle: 'Testcontainer Demo API DOCS',
    });
  }

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[] = []) => {
        const messages = flattenValidationErrors(errors);
        throw new BadRequestException(messages);
      },
      skipMissingProperties: true,
    }),
  );

  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET'),
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000,
        secure: configService.get<string>('NODE_ENV') === 'production',
        httpOnly: true,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(urlencoded({ extended: true }));

  const PORT = configService.get<number>('PORT') || 3334;

  await app.listen(PORT);
}
bootstrap();
