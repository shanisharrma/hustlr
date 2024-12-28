import { getOrderByOrderId, getOrdersByBuyerId, getOrdersBySellerId } from '@order/services/order-service';
import { IOrderDocument } from '@shanisharrma/hustlr-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const orderId = async (req: Request, res: Response): Promise<void> => {
  const order: IOrderDocument = await getOrderByOrderId(req.params.orderId);
  res.status(StatusCodes.OK).json({ message: 'Order by orderId', order });
};

const sellerOrders = async (req: Request, res: Response): Promise<void> => {
  const orders: IOrderDocument[] = await getOrdersBySellerId(req.params.sellerId);
  res.status(StatusCodes.OK).json({ message: 'Seller orders', orders });
};

const buyerOrders = async (req: Request, res: Response): Promise<void> => {
  const orders: IOrderDocument[] = await getOrdersByBuyerId(req.params.buyerId);
  res.status(StatusCodes.OK).json({ message: 'buyer orders', orders });
};

export { orderId, sellerOrders, buyerOrders };
