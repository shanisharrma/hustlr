import express, { Router } from 'express';
import { verifyGatewayRequest } from '@shanisharrma/hustlr-shared';
import { gigRoutes } from '@gig/routes/v1/gig';

const router: Router = express.Router();

export function v1Routes(): Router {
  router.use('/v1/gig', verifyGatewayRequest, gigRoutes());
  return router;
}
