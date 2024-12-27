import express, { Express } from 'express';
import { APIGatewayServer } from '@gateway/server';
import { redisConnection } from '@gateway/redis/redis-connection';

class Application {
  public async initialize(): Promise<void> {
    const app: Express = express();
    const server: APIGatewayServer = new APIGatewayServer(app);
    server.start();
    redisConnection.connect();
  }
}

const application: Application = new Application();
application.initialize();
