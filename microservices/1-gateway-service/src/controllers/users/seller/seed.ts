import { sellerService } from '@gateway/services/api';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class SeedSellerController {
  public async seed(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await sellerService.seedSellers(req.params.count);
    res.status(StatusCodes.CREATED).json({ message: response.data.message });
  }
}
