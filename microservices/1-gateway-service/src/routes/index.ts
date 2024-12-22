import { Application } from 'express';
import { healthRoutes } from '@gateway/routes/health';
import { v1Routes } from '@gateway/routes/v1';

const BASE_PATH = '/api/gateway';

export const appRoutes = (app: Application): void => {
  app.use('', healthRoutes.routes());
  app.use(BASE_PATH, v1Routes());
};
