import express, { Express } from 'express';
import { databaseConnection, serverConfig } from '@order/config';
import { start } from '@order/server';

const initialize = (): void => {
  serverConfig.cloudinaryConfig();
  databaseConnection();
  const app: Express = express();
  start(app);
};

initialize();
