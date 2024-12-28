import { Application } from 'express';
import { healthRoutes } from '@review/routes/health';
import { v1Routes } from '@review/routes/v1';

const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  app.use('/api', v1Routes());
};

export { appRoutes };
