import axios, { AxiosResponse } from 'axios';
import { AxiosService } from '@gateway/services/axios';
import { serverConfig } from '@gateway/config';
import { IReviewDocument } from '@shanisharrma/hustlr-shared';

export let axiosReviewInstance: ReturnType<typeof axios.create>;

class ReviewService {
  constructor() {
    const axiosService: AxiosService = new AxiosService(`${serverConfig.REVIEW_BASE_URL}/api/v1/review`, 'review');
    axiosReviewInstance = axiosService.axios;
  }

  async getReviewByGigId(gigId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosReviewInstance.get(`/gig/${gigId}`);
    return response;
  }

  async getReviewBySellerId(sellerId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosReviewInstance.get(`/seller/${sellerId}`);
    return response;
  }

  async addReview(body: IReviewDocument): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosReviewInstance.post('/', body);
    return response;
  }
}

export const reviewService: ReviewService = new ReviewService();
