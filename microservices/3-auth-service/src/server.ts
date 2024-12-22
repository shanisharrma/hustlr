import http from 'http';

import { Logger } from 'winston';
import { serverConfig } from '@auth/config';
import { CustomError, IAuthPayload, IErrorResponse, winstonLogger } from '@shanisharrma/hustlr-shared';
import { Application, NextFunction, Request, Response, urlencoded, json } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import JWT from 'jsonwebtoken';
import compression from 'compression';
import { checkConnection } from '@auth/elasticsearch';
import { appRoutes } from '@auth/routes';
import { Channel } from 'amqplib';
import { createConnection } from '@auth/queues/connection';

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'authenticationServer', 'debug');

export let authChannel: Channel;

export function start(app: Application): void {
  securityMiddleware(app);
  standardMiddleware(app);
  routesMiddleware(app);
  startQueues();
  startElasticSearch();
  authErrorHandler(app);
  startServer(app);
}

function securityMiddleware(app: Application): void {
  app.set('trust proxy', 1);
  app.use(hpp());
  app.use(helmet());
  app.use(
    cors({
      origin: serverConfig.API_GATEWAY_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    })
  );
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      const payload = JWT.verify(token, serverConfig.JWT_TOKEN!) as IAuthPayload;
      req.currentUser = payload;
    }
    next();
  });
}

function standardMiddleware(app: Application): void {
  app.use(compression());
  app.use(json({ limit: '200mb' }));
  app.use(urlencoded({ extended: true, limit: '200mb' }));
}

function routesMiddleware(app: Application): void {
  appRoutes(app);
}

async function startQueues(): Promise<void> {
  authChannel = (await createConnection()) as Channel;
}

function startElasticSearch(): void {
  checkConnection();
}

function authErrorHandler(app: Application): void {
  // check for our custom error
  app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
    logger.log(`AuthService ${error.comingFrom}:`, error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json(error.serializeErrors());
    }
    next();
  });
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    logger.info(`Authentication Server started with process id ${process.pid}`);
    httpServer.listen(serverConfig.SERVER_PORT, () => {
      logger.info(`Authentication Server is running on port ${serverConfig.SERVER_PORT}`);
    });
  } catch (error) {
    logger.log('AuthService startService() method error:', error);
  }
}
