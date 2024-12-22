import express, { Express } from 'express';
import { start } from '@auth/server';
import { databaseConnection, serverConfig } from '@auth/config';

const initialize = (): void => {
  serverConfig.cloudinaryConfig();
  const app: Express = express();
  databaseConnection();
  start(app);
};

initialize();
