import { Request, Response } from 'express';
import * as helper from '@shanisharrma/hustlr-shared';
import * as orderService from '@order/services/order-service';
import {
  authUserPayload,
  orderDocument,
  orderMockRequest,
  orderMockResponse
} from '@order/controllers/order/tests/mocks/order.mocks';
import { intent, order } from '@order/controllers/order/create';
import { orderSchema } from '@order/schemas/order';

jest.mock('@order/services/order-service');
jest.mock('@shanisharrma/hustlr-shared');
jest.mock('@order/schemas/order');
jest.mock('@elastic/elasticsearch');

const mockPaymentIntentCreate = jest.fn();
const mockCustomersSearch = jest.fn();
jest.mock('stripe', () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({
      paymentIntents: {
        create: (...args: any) => mockPaymentIntentCreate(...args) as unknown
      },
      customers: {
        search: (...args: any) => mockCustomersSearch(...args) as unknown
      }
    }))
  };
});

describe('Order Controller', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('intent method', () => {
    it('should create a new intent and return correct resposne', async () => {
      const req: Request = orderMockRequest({}, orderDocument, authUserPayload) as unknown as Request;
      const res: Response = orderMockResponse();
      mockCustomersSearch.mockResolvedValueOnce({ data: [{ id: '112321' }] });
      mockPaymentIntentCreate.mockResolvedValueOnce({ client_secret: '32432sdfa', id: '23423dlsjfl' });
      await intent(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Order intenet created successfully.',
        clientSecret: '32432sdfa',
        paymentIntentId: '23423dlsjfl'
      });
    });
  });

  describe('order method', () => {
    it('should throw an error for invalid schema data', async () => {
      const req: Request = orderMockRequest({}, orderDocument, authUserPayload) as unknown as Request;
      const res: Response = orderMockResponse();
      jest.spyOn(orderSchema, 'validate').mockImplementation((): any =>
        Promise.resolve({
          error: {
            name: 'ValidationError',
            isJoi: true,
            details: [{ message: 'This is an error message' }]
          }
        })
      );

      order(req, res).catch(() => {
        expect(helper.BadRequestError).toHaveBeenCalledWith('This is an error message', 'Create order() method error');
      });
    });

    it('should return correct json resposne', async () => {
      const req: Request = orderMockRequest({}, orderDocument, authUserPayload) as unknown as Request;
      const res: Response = orderMockResponse();

      const serviceFee: number = req.body.price < 50 ? (5.5 / 100) * req.body.price + 2 : (5.5 / 100) * req.body.price;
      let orderData: helper.IOrderDocument = req.body;
      orderData = { ...orderData, serviceFee };

      jest.spyOn(orderSchema, 'validate').mockImplementation((): any => Promise.resolve({ error: {} }));
      jest.spyOn(orderService, 'createOrder').mockResolvedValue(orderData);

      await order(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Order created successfully', order: orderData });
    });
  });
});
