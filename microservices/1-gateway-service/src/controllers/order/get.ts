import { orderService } from '@gateway/services/api';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class GetOrderController {
  public async orderId(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.getOrderById(req.params.orderId);
    res.status(StatusCodes.OK).json({
      message: response.data.message,
      order: response.data.order
    });
  }

  public async sellerOrder(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.sellerOrders(req.params.sellerId);
    res.status(StatusCodes.CREATED).json({
      message: response.data.message,
      orders: response.data.orders
    });
  }

  public async buyerOrder(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.buyerOrders(req.params.buyerId);
    res.status(StatusCodes.CREATED).json({
      message: response.data.message,
      orders: response.data.orders
    });
  }

  public async notifications(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await orderService.getNotifications(req.params.userTo);
    res.status(StatusCodes.CREATED).json({
      message: response.data.message,
      notifications: response.data.notifications
    });
  }
}
