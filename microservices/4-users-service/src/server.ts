import http from 'http';

import { Logger } from 'winston';
import { serverConfig } from '@users/config';
import { CustomError, IAuthPayload, IErrorResponse, winstonLogger } from '@shanisharrma/hustlr-shared';
import { Application, NextFunction, Request, Response, urlencoded, json } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import JWT from 'jsonwebtoken';
import compression from 'compression';
import { checkConnection } from '@users/elasticsearch';
import { appRoutes } from '@users/routes';
import { createConnection } from '@users/queues/connection';
import { Channel } from 'amqplib';
import {
  consumeBuyerDirectMessage,
  consumeReviewFanoutMessages,
  consumeSeedGigDirectMessages,
  consumeSellerDirectMessage
} from '@users/queues/user-consumer';

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'usersServer', 'debug');

const start = (app: Application): void => {
  securityMiddleware(app);
  standardMiddleware(app);
  routesMiddleware(app);
  startQueues();
  startElasticSearch();
  usersErrorHandler(app);
  startServer(app);
};

const securityMiddleware = (app: Application): void => {
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
};

const standardMiddleware = (app: Application): void => {
  app.use(compression());
  app.use(json({ limit: '200mb' }));
  app.use(urlencoded({ extended: true, limit: '200mb' }));
};

const routesMiddleware = (app: Application): void => {
  appRoutes(app);
};

const startQueues = async (): Promise<void> => {
  const usersChannel: Channel = (await createConnection()) as Channel;
  await consumeBuyerDirectMessage(usersChannel);
  await consumeSellerDirectMessage(usersChannel);
  await consumeReviewFanoutMessages(usersChannel);
  await consumeSeedGigDirectMessages(usersChannel);
};

const startElasticSearch = (): void => {
  checkConnection();
};

const usersErrorHandler = (app: Application): void => {
  // check for our custom error
  app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
    logger.log(`UsersService ${error.comingFrom}:`, error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json(error.serializeErrors());
    }
    next();
  });
};

const startServer = (app: Application): void => {
  try {
    const httpServer: http.Server = new http.Server(app);
    logger.info(`Users Server started with process id ${process.pid}`);
    httpServer.listen(serverConfig.SERVER_PORT, () => {
      logger.info(`Users Server is running on port ${serverConfig.SERVER_PORT}`);
    });
  } catch (error) {
    logger.log('UsersService startService() method error:', error);
  }
};

export { start };
