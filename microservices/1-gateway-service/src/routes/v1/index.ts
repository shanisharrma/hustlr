import express, { Router } from 'express';
import { authRoutes } from '@gateway/routes/v1/auth';
import { currentUserRoutes } from '@gateway/routes/v1/current-user';
import { authMiddleware } from '@gateway/middlewares/auth-middleware';
import { searchRoutes } from '@gateway/routes/v1/search';
import { buyerRoutes } from '@gateway/routes/v1/buyer';
import { sellerRoutes } from '@gateway/routes/v1/seller';
import { gigRoutes } from '@gateway/routes/v1/gig';
import { chatRoutes } from '@gateway/routes/v1/chat';
import { orderRoutes } from './order';

const router: Router = express.Router();

export function v1Routes(): Router {
  router.use('/v1/auth', authRoutes.routes());
  router.use('/v1/auth', searchRoutes.routes());

  router.use('/v1/auth', authMiddleware.verifyUser, currentUserRoutes.routes());
  router.use('/v1/buyer', authMiddleware.verifyUser, buyerRoutes.routes());
  router.use('/v1/seller', authMiddleware.verifyUser, sellerRoutes.routes());
  router.use('/v1/gig', authMiddleware.verifyUser, gigRoutes.routes());
  router.use('/v1/chat', authMiddleware.verifyUser, chatRoutes.routes());
  router.use('/v1/order', authMiddleware.verifyUser, orderRoutes.routes());
  return router;
}
