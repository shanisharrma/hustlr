import http from 'http';

import { CustomError, IErrorResponse, winstonLogger } from '@shanisharrma/hustlr-shared';
import cookieSession from 'cookie-session';
import { Application, urlencoded, json, Request, Response, NextFunction } from 'express';
import hpp from 'hpp';
import { Logger } from 'winston';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { StatusCodes } from 'http-status-codes';
import { serverConfig } from '@gateway/config';
import { elasticSearch } from '@gateway/elasticsearch';
import { appRoutes } from '@gateway/routes';

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'APIGatewayServer', 'debug');

export class APIGatewayServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.startElasticSearch();
    this.errorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.set('trust proxy', 1);
    app.use(
      cookieSession({
        name: 'hustlr-session',
        keys: [`${serverConfig.SECRET_KEY_ONE}`, `${serverConfig.SECRET_KEY_TWO}`],
        maxAge: 24 * 7 * 3600000,
        secure: serverConfig.NODE_ENV === 'production'
        // sameSite: 'none' // updated in production
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: serverConfig.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    );
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '200mb' }));
    app.use(urlencoded({ extended: true, limit: '200mb' }));
  }

  private routesMiddleware(app: Application): void {
    appRoutes(app);
  }

  private startElasticSearch(): void {
    elasticSearch.checkConnection();
  }

  private errorHandler(app: Application): void {
    // Check for not registered routes
    app.use('*', (req: Request, res: Response, next: NextFunction) => {
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      logger.log('error', `${fullUrl} endpoint does not exist.`, '');
      res.status(StatusCodes.NOT_FOUND).json({ message: 'The endpoint called does not exist.' });
      next();
    });

    // check for our custom error
    app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
      logger.log('error', `GatewayService ${error.comingFrom}:`, error);
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(error.serializeErrors());
      }
      next();
    });
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      this.startHttpServer(httpServer);
    } catch (error) {
      logger.log('error', 'GatewayService startServer() error method:', error);
    }
  }

  private async startHttpServer(httpServer: http.Server): Promise<void> {
    try {
      logger.info(`API Gateway Server has started with process id ${process.pid}`);
      httpServer.listen(serverConfig.SERVER_PORT, () => {
        logger.info(`API Gateway Server is running on port ${serverConfig.SERVER_PORT}`);
      });
    } catch (error) {
      logger.log('error', 'GatewayService startHttpServer() error method:', error);
    }
  }
}
