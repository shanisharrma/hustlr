import express, { Router } from 'express';
import { verifyGatewayRequest } from '@shanisharrma/hustlr-shared';
import { authRoutes } from '@auth/routes/v1/auth';
import { currentUserRoutes } from '@auth/routes/v1/current-user';
import { searchRoutes } from '@auth/routes/v1/search';
import { seedRoutes } from '@auth/routes/v1/seed';

const router: Router = express.Router();

export function v1Routes(): Router {
  router.use('/v1/auth', searchRoutes());
  router.use('/v1/auth', seedRoutes());

  router.use('/v1/auth', verifyGatewayRequest, authRoutes());
  router.use('/v1/auth', verifyGatewayRequest, currentUserRoutes());
  return router;
}
