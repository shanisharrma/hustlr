import { Request, Response } from 'express';
import * as reviewService from '@review/services/review-service';
import { authUserPayload, reviewDocument, reviewMockRequest, reviewMockResponse } from './mocks/review.mock';
import { review } from '../create';

jest.mock('@review/services/review-service');
jest.mock('@shanisharrma/hustlr-shared');
jest.mock('@review/queues/connection');
jest.mock('@elastic/elasticsearch');

describe('review controller', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create review method', () => {
    it('should create and return correct response', async () => {
      const req: Request = reviewMockRequest({}, reviewDocument, authUserPayload) as unknown as Request;
      const res: Response = reviewMockResponse();

      jest.spyOn(reviewService, 'addReview').mockResolvedValue(reviewDocument);

      await review(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Review Created Successfully', review: reviewDocument });
    });
  });
});
