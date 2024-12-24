/* eslint-disable @typescript-eslint/no-explicit-any */
import { gigCreateSchema } from '@gig/schemas/gig-schema';
import { authUserPayload, gigMockRequest, gigMockResponse, sellerGig } from '@gig/controllers/tests/mocks/gig.mock';
import { gigCreate } from '@gig/controllers/create';
import { BadRequestError } from '@shanisharrma/hustlr-shared';
import { Request, Response } from 'express';
import * as helper from '@shanisharrma/hustlr-shared';
import * as gigService from '@gig/services/gig-service';

jest.mock('@gig/services/gig-service');
jest.mock('@shanisharrma/hustlr-shared');
jest.mock('@gig/schemas/gig-schema');
jest.mock('@gig/elasticsearch');
jest.mock('@elastic/elasticsearch');

describe('Gig Controller', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('gigCreate method', () => {
    it('should throw an error for invalid schema data', () => {
      const req: Request = gigMockRequest({}, sellerGig, authUserPayload) as unknown as Request;
      const res: Response = gigMockResponse();
      jest.spyOn(gigCreateSchema, 'validate').mockImplementation((): any =>
        Promise.resolve({
          error: {
            name: 'ValidatoinError',
            isJoi: true,
            details: [{ message: 'This is an error message' }]
          }
        })
      );

      gigCreate(req, res).catch(() => {
        expect(BadRequestError).toHaveBeenCalledWith('This is an error message', 'Create gig() method error');
      });
    });

    it('should throw file upload error', () => {
      const req: Request = gigMockRequest({}, sellerGig, authUserPayload) as unknown as Request;
      const res: Response = gigMockResponse();
      jest.spyOn(gigCreateSchema, 'validate').mockImplementation((): any =>
        Promise.resolve({
          error: {}
        })
      );
      jest.spyOn(helper, 'uploads').mockImplementation((): any => Promise.resolve({ public_id: '' }));

      gigCreate(req, res).catch(() => {
        expect(BadRequestError).toHaveBeenCalledWith('File upload error. Try again...', 'Create gig() method error');
      });
    });

    it('should create a new gig and return the correct resposne', async () => {
      const req: Request = gigMockRequest({}, sellerGig, authUserPayload) as unknown as Request;
      const res: Response = gigMockResponse();
      jest.spyOn(gigCreateSchema, 'validate').mockImplementation((): any => Promise.resolve({ error: {} }));
      jest.spyOn(helper, 'uploads').mockImplementation((): any => Promise.resolve({ public_id: '12345' }));
      jest.spyOn(gigService, 'createGig').mockResolvedValue(sellerGig);

      await gigCreate(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Gig created successfully.',
        gig: sellerGig
      });
    });
  });
});
