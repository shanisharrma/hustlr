import { Request, Response } from 'express';
import {
  authUserPayload,
  buyerMockDocument,
  buyerMockRequest,
  buyerMockResponse
} from '@users/controllers/buyer/tests/mocks/buyer.mock';
import * as buyer from '@users/services/buyer-service';
import { getByCurrentEmail, getByCurrentUsername, getByUsername } from '@users/controllers/buyer/get';

jest.mock('@users/services/buyer-service');
jest.mock('@shanisharrma/hustlr-shared');
jest.mock('@elastic/elasticsearch');

describe('Buyer controller', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getByCurrentEmail Method', () => {
    it('should return buyer profile data', async () => {
      const req: Request = buyerMockRequest({}, authUserPayload) as unknown as Request;
      const res: Response = buyerMockResponse();
      jest.spyOn(buyer, 'getBuyerByEmail').mockResolvedValue(buyerMockDocument);

      await getByCurrentEmail(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Buyer profile', buyer: buyerMockDocument });
    });
  });

  describe('getByCurrentUsername Method', () => {
    it('should return buyer profile data', async () => {
      const req: Request = buyerMockRequest({}, authUserPayload) as unknown as Request;
      const res: Response = buyerMockResponse();
      jest.spyOn(buyer, 'getBuyerByUsername').mockResolvedValue(buyerMockDocument);

      await getByCurrentUsername(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Buyer profile', buyer: buyerMockDocument });
    });
  });

  describe('getByUsername Method', () => {
    it('should return buyer profile data', async () => {
      const req: Request = buyerMockRequest({}, authUserPayload, { username: 'Manny' }) as unknown as Request;
      const res: Response = buyerMockResponse();
      jest.spyOn(buyer, 'getBuyerByUsername').mockResolvedValue(buyerMockDocument);

      await getByUsername(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Buyer profile', buyer: buyerMockDocument });
    });
  });
});
