import express, { Express } from 'express';
import { databaseConnection, serverConfig } from '@users/config';
import { start } from '@users/server';

const initialize = (): void => {
  serverConfig.cloudinaryConfig();
  databaseConnection();
  const app: Express = express();
  start(app);
};

initialize();
