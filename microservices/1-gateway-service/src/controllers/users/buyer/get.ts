import { buyerService } from '@gateway/services/api';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class GetBuyerController {
  public async getBuyerByCurrentEmail(_req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await buyerService.getBuyerByEmail();
    res.status(StatusCodes.OK).json({ message: response.data.message, buyer: response.data.buyer });
  }

  public async getBuyerByCurrentUsername(_req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await buyerService.getCurrentBuyerByUsername();
    res.status(StatusCodes.OK).json({ message: response.data.message, buyer: response.data.buyer });
  }

  public async getByBuyerUsername(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await buyerService.getBuyerByUsername(req.params.username);
    res.status(StatusCodes.OK).json({ message: response.data.message, buyer: response.data.buyer });
  }
}
