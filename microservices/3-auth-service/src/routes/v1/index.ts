import express, { Router } from 'express';
import { authRoutes } from '@auth/routes/v1/auth';
import { currentUserRoutes } from '@auth/routes/v1/current-user';
import { verifyGatewayRequest } from '@shanisharrma/hustlr-shared';

const router: Router = express.Router();

export function v1Routes(): Router {
  router.use('/v1/auth', verifyGatewayRequest, authRoutes());
  router.use('/v1/auth', verifyGatewayRequest, currentUserRoutes());
  return router;
}
