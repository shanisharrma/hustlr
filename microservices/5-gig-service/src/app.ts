import express, { Express } from 'express';
import { databaseConnection, serverConfig } from '@gig/config';
import { start } from '@gig/server';
import { redisConnect } from '@gig/redis/redis-connection';

const initialize = (): void => {
  serverConfig.cloudinaryConfig();
  databaseConnection();
  const app: Express = express();
  start(app);
  redisConnect();
};

initialize();
