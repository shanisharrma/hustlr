import { Application } from 'express';
import { healthRoutes } from '@gig/routes/health';
import { v1Routes } from '@gig/routes/v1';

const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  app.use('/api', v1Routes());
};

export { appRoutes };
