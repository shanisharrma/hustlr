import { Application } from 'express';
import { healthRoutes } from '@gateway/routes/health.routes';

export const appRoutes = (app: Application): void => {
  app.use('', healthRoutes.routes());
};
