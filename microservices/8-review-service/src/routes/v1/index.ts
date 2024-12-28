import express, { Router } from 'express';
import { verifyGatewayRequest } from '@shanisharrma/hustlr-shared';
import { reviewRoutes } from '@review/routes/v1/review';

const router: Router = express.Router();

export function v1Routes(): Router {
  router.use('/v1/review', verifyGatewayRequest, reviewRoutes());
  return router;
}
