import { sellerService } from '@gateway/services/api';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class GetSellerController {
  public async sellerById(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await sellerService.getSellerById(req.params.sellerId);
    res.status(StatusCodes.OK).json({ message: response.data.message, seller: response.data.seller });
  }

  public async sellerByUsername(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await sellerService.getSellerByUsername(req.params.username);
    res.status(StatusCodes.OK).json({ message: response.data.message, seller: response.data.seller });
  }

  public async randomSeller(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await sellerService.getRandomSellers(req.params.size);
    res.status(StatusCodes.OK).json({ message: response.data.message, sellers: response.data.sellers });
  }
}
