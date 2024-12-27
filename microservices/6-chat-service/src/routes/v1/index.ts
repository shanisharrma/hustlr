import express, { Router } from 'express';
import { verifyGatewayRequest } from '@shanisharrma/hustlr-shared';
import { messageRoutes } from '@chat/routes/v1/message';

const router: Router = express.Router();

export function v1Routes(): Router {
  router.use('/v1/chat', verifyGatewayRequest, messageRoutes());
  return router;
}
