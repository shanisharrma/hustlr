import { Request, Response } from 'express';
import {
  authMock,
  authMockRequest,
  authMockResponse,
  authUserPayload
} from '@gateway/controllers/auth/tests/mocks/auth.mock';
import { socketIO } from '@gateway/server';
import { authService } from '@gateway/services/api/auth-service';
import { AxiosResponse } from 'axios';
import { CurrentUserController } from '../current-user';
import { GatewayCache } from '@gateway/redis/gateway-cache';

jest.mock('@gateway/services/api/auth-service');
jest.mock('@shanisharrma/hustlr-shared');
jest.mock('@gateway/redis/gateway-cache');
jest.mock('@elastic/elasticsearch');
jest.mock('@gateway/server', () => ({
  socketIO: {
    emit: jest.fn()
  }
}));

const USERNAME = 'Manny';
const PASSWORD = 'manny1';

describe('CurrentUser', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
  });
  afterEach(async () => {
    jest.resetAllMocks();
  });

  describe('currentUser method', () => {
    it('should return authenticated user', async () => {
      const req: Request = authMockRequest(
        {},
        { username: USERNAME, password: PASSWORD },
        authUserPayload
      ) as unknown as Request;
      const res: Response = authMockResponse();
      jest
        .spyOn(authService, 'getCurrentUser')
        .mockResolvedValue({ data: { message: 'Current User data', user: authMock } } as unknown as AxiosResponse);

      await CurrentUserController.prototype.currentUser(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Current User data',
        user: authMock
      });
    });
  });

  describe('resendEmail method', () => {
    it('should return current response', async () => {
      const req: Request = authMockRequest(
        {},
        { username: USERNAME, password: PASSWORD },
        authUserPayload
      ) as unknown as Request;
      const res: Response = authMockResponse();
      jest.spyOn(authService, 'resendEmail').mockResolvedValue({
        data: { message: 'Resend email sent successfull', user: authMock }
      } as unknown as AxiosResponse);

      await CurrentUserController.prototype.resendEmail(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Resend email sent successfull',
        user: authMock
      });
    });
  });

  describe('getLoggedInUsers method', () => {
    it('should return current response', async () => {
      const req: Request = authMockRequest(
        {},
        { username: USERNAME, password: PASSWORD },
        authUserPayload
      ) as unknown as Request;
      const res: Response = authMockResponse();
      jest.spyOn(GatewayCache.prototype, 'getLoggedInUserFromCache').mockResolvedValue(['Manny', 'Donny']);
      jest.spyOn(socketIO, 'emit');

      await CurrentUserController.prototype.getLoggedInUsers(req, res);
      expect(socketIO.emit).toHaveBeenCalledWith('online', ['Manny', 'Donny']);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User is online'
      });
    });
  });

  describe('removedLoggedInUsers method', () => {
    it('should return current response', async () => {
      const req: Request = authMockRequest({}, { username: USERNAME, password: PASSWORD }, authUserPayload, {
        username: 'Manny'
      }) as unknown as Request;
      const res: Response = authMockResponse();
      jest.spyOn(GatewayCache.prototype, 'removeLoggedInUserFromCache').mockResolvedValue(['Manny']);
      jest.spyOn(socketIO, 'emit');

      await CurrentUserController.prototype.removeLoggedInUsers(req, res);
      expect(socketIO.emit).toHaveBeenCalledWith('online', ['Manny']);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User is offline'
      });
    });
  });
});
