import { currentUser, refreshToken, resendEmail } from '@auth/controllers';
import express, { Router } from 'express';

const router: Router = express.Router();

export function currentUserRoutes(): Router {
  router.get('/refresh-token/:username', refreshToken);
  router.get('/current-user', currentUser);
  router.post('/resend-email', resendEmail);
  return router;
}
