import express, { Express } from 'express';
import { APIGatewayServer } from '@gateway/server';

class Application {
  public async initialize(): Promise<void> {
    const app: Express = express();
    const server: APIGatewayServer = new APIGatewayServer(app);
    server.start();
  }
}

const application: Application = new Application();
application.initialize();
