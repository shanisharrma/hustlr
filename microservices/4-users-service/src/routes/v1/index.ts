import express, { Router } from 'express';
import { verifyGatewayRequest } from '@shanisharrma/hustlr-shared';
import { buyerRoutes } from '@users/routes/v1/buyer';
import { sellerRoutes } from '@users/routes/v1/seller';

const router: Router = express.Router();

export function v1Routes(): Router {
  router.use('/v1/buyer', verifyGatewayRequest, buyerRoutes());
  router.use('/v1/seller', verifyGatewayRequest, sellerRoutes());
  return router;
}
