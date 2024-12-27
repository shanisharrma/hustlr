import express, { Express } from 'express';
import { databaseConnection, serverConfig } from '@chat/config';
import { start } from '@chat/server';

const initialize = (): void => {
  serverConfig.cloudinaryConfig();
  databaseConnection();
  const app: Express = express();
  start(app);
};

initialize();
