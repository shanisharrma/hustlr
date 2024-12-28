import express, { Router } from 'express';
import { verifyGatewayRequest } from '@shanisharrma/hustlr-shared';
import { orderRoutes } from '@order/routes/v1/order';
import { notificationRoutes } from '@order/routes/v1/notification';

const router: Router = express.Router();

export function v1Routes(): Router {
  router.use('/v1/order', verifyGatewayRequest, orderRoutes());
  router.use('/v1/order/notification', verifyGatewayRequest, notificationRoutes());
  return router;
}
