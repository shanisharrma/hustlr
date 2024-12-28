import express, { Express } from 'express';
import { databaseConnection } from '@review/config';
import { start } from '@review/server';

const initialize = (): void => {
  databaseConnection();
  const app: Express = express();
  start(app);
};

initialize();
