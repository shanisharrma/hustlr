import { orderService } from '@gateway/services/api';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class CreateOrderController {
  public async intent(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.createOrderIntent(req.body.price, req.body.buyerId);
    res.status(StatusCodes.CREATED).json({
      message: response.data.message,
      clientSecret: response.data.clientSecret,
      paymentIntent: response.data.paymentIntent
    });
  }

  public async order(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.createOrder(req.body);
    res.status(StatusCodes.CREATED).json({
      message: response.data.message,
      order: response.data.order
    });
  }
}
