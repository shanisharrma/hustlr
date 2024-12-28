import { Application } from 'express';
import { healthRoutes } from '@order/routes/health';
import { v1Routes } from '@order/routes/v1';

const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  app.use('/api', v1Routes());
};

export { appRoutes };
