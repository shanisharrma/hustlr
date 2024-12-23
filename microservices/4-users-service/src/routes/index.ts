import { Application } from 'express';
import { healthRoutes } from '@users/routes/health';
import { v1Routes } from '@users/routes/v1';

const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  app.use('/api', v1Routes());
};

export { appRoutes };
