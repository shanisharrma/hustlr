import { serverConfig } from '@gateway/config';
import { IAuthPayload, NotAuthorizedError } from '@shanisharrma/hustlr-shared';
import { NextFunction, Request, Response } from 'express';
import JWT from 'jsonwebtoken';

class AuthMiddleware {
  public verifyUser(req: Request, _res: Response, next: NextFunction): void {
    if (!req.session || !req.session.jwt) {
      throw new NotAuthorizedError(
        'Token is not available. Please login again',
        'GatewayService verifyUser() method error:'
      );
    }

    try {
      const payload: IAuthPayload = JWT.verify(req.session.jwt, serverConfig.JWT_TOKEN as string) as IAuthPayload;
      req.currentUser = payload;
    } catch {
      throw new NotAuthorizedError(
        'Token is not available. Please login again',
        'GatewayService verifyUser() method invalid session error:'
      );
    }
    next();
  }

  public isAuthenticated(req: Request, _res: Response, next: NextFunction): void {
    if (!req.currentUser) {
      throw new NotAuthorizedError(
        'Athentication required to access this route',
        'GatewayService isAuthenticated() method error:'
      );
    }
    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
