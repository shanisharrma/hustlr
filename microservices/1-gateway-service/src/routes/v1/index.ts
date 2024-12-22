import express, { Router } from 'express';
import { authRoutes } from '@gateway/routes/v1/auth';
import { currentUserRoutes } from '@gateway/routes/v1/current-user';
import { authMiddleware } from '@gateway/middlewares/auth-middleware';

const router: Router = express.Router();

export function v1Routes(): Router {
  router.use('/v1/auth', authRoutes.routes());
  router.use('/v1/auth', authMiddleware.verifyUser, currentUserRoutes.routes());
  return router;
}
