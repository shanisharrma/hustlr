import http from 'http';

import { Logger } from 'winston';
import { serverConfig } from '@review/config';
import { CustomError, IAuthPayload, IErrorResponse, winstonLogger } from '@shanisharrma/hustlr-shared';
import { Application, NextFunction, Request, Response, urlencoded, json } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import JWT from 'jsonwebtoken';
import compression from 'compression';
import { checkConnection } from '@review/elasticsearch';
import { appRoutes } from '@review/routes';
import { Channel } from 'amqplib';
import { createConnection } from '@review/queues/connection';

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'reviewServer', 'debug');
let reviewChannel: Channel;

const start = (app: Application): void => {
  securityMiddleware(app);
  standardMiddleware(app);
  routesMiddleware(app);
  startQueues();
  startElasticSearch();
  reviewErrorHandler(app);
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
  reviewChannel = (await createConnection()) as Channel;
};

const startElasticSearch = (): void => {
  checkConnection();
};

const reviewErrorHandler = (app: Application): void => {
  // check for our custom error
  app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
    logger.log(`ReviewService ${error.comingFrom}:`, error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json(error.serializeErrors());
    }
    next();
  });
};

const startServer = async (app: Application): Promise<void> => {
  try {
    const httpServer: http.Server = new http.Server(app);
    logger.info(`Review Server started with process id ${process.pid}`);
    httpServer.listen(serverConfig.SERVER_PORT, () => {
      logger.info(`Review Server is running on port ${serverConfig.SERVER_PORT}`);
    });
  } catch (error) {
    logger.log('ReviewService startService() method error:', error);
  }
};

export { start, reviewChannel };
