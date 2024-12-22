import { Request, Response } from 'express';
import * as auth from '@auth/services/auth-service';
import * as helper from '@shanisharrma/hustlr-shared';
import { authMock, authMockRequest, authMockResponse, authUserPayload } from '@auth/controllers/tests/mocks/auth.mock';
import { currentUser, resendEmail } from '@auth/controllers/current-user';
import { Sequelize } from 'sequelize';
import { serverConfig } from '@auth/config';

jest.mock('@auth/services/auth-service');
jest.mock('@shanisharrma/hustlr-shared');
jest.mock('@auth/queues/auth-producer');
jest.mock('@elastic/elasticsearch');

const USERNAME = 'Manny';
const PASSWORD = 'manny1';

let mockConnection: Sequelize;

describe('CurrentUser', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    mockConnection = new Sequelize(`${serverConfig.MYSQL_DB!}`, {
      dialect: 'mysql',
      logging: false,
      dialectOptions: {
        multipleStatements: true
      }
    });
    await mockConnection.sync({ force: true });
  });
  afterEach(async () => {
    jest.resetAllMocks();
    await mockConnection.close();
  });

  describe('currentUser method', () => {
    it('should return authenticated user', async () => {
      const req: Request = authMockRequest(
        {},
        { username: USERNAME, password: PASSWORD },
        authUserPayload
      ) as unknown as Request;
      const res: Response = authMockResponse();
      jest.spyOn(auth, 'getAuthUserById').mockResolvedValue(authMock);
      await currentUser(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Authenticated user',
        user: authMock
      });
    });

    it('should return empty user', async () => {
      const req: Request = authMockRequest(
        {},
        { username: USERNAME, password: PASSWORD },
        authUserPayload
      ) as unknown as Request;
      const res: Response = authMockResponse();
      jest.spyOn(auth, 'getAuthUserById').mockResolvedValue({} as never);
      await currentUser(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Authenticated user',
        user: null
      });
    });
  });

  describe('resendEmail method', () => {
    it('should call badRequestError for invalid email', async () => {
      const req: Request = authMockRequest(
        {},
        { username: USERNAME, password: PASSWORD },
        authUserPayload
      ) as unknown as Request;
      const res: Response = authMockResponse();

      jest.spyOn(auth, 'getAuthUserByEmail').mockResolvedValue({} as never);
      await resendEmail(req, res).catch(() => {
        expect(helper.BadRequestError).toHaveBeenCalledWith(
          'Email is invalid.',
          'CurrentUser sendEmail() method error'
        );
      });
    });

    it('should call updateVerifyEmailField method', async () => {
      const req: Request = authMockRequest(
        {},
        { username: USERNAME, password: PASSWORD },
        authUserPayload
      ) as unknown as Request;
      const res: Response = authMockResponse();

      jest.spyOn(auth, 'getAuthUserByEmail').mockResolvedValue(authMock);
      await resendEmail(req, res);
      expect(auth.updateVerifyEmailField).toHaveBeenCalled();
    });

    it('should return authenticated user', async () => {
      const req: Request = authMockRequest(
        {},
        { username: USERNAME, password: PASSWORD },
        authUserPayload
      ) as unknown as Request;
      const res: Response = authMockResponse();

      jest.spyOn(auth, 'getAuthUserByEmail').mockResolvedValue(authMock);
      jest.spyOn(auth, 'getAuthUserById').mockResolvedValue(authMock);

      await resendEmail(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email verification link sent.',
        user: authMock
      });
    });
  });
});
