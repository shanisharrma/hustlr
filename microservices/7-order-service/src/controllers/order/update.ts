import crypto from 'crypto';

import { serverConfig } from '@order/config';
import { orderUpdateSchema } from '@order/schemas/order';
import {
  approveOrder,
  approveRequestDeliveryExtensionDate,
  cancelOrder,
  rejectedRequestDeliveryExtensionDate,
  requestDeliveryExtension,
  sellerDeliverOrder
} from '@order/services/order-service';
import { BadRequestError, IDeliveredWork, IOrderDocument, uploads } from '@shanisharrma/hustlr-shared';
import { UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Stripe from 'stripe';

const stripe: Stripe = new Stripe(serverConfig.STRIPE_SECRET_KEY!, {
  typescript: true
});

const cancel = async (req: Request, res: Response): Promise<void> => {
  await stripe.refunds.create({
    payment_intent: `${req.body.paymentIntent}`
  });
  const { orderId } = req.params;
  await cancelOrder(orderId, req.body.orderData);
  res.status(StatusCodes.OK).json({ message: 'Order cancelled successfully.' });
};

const requestExtension = async (req: Request, res: Response): Promise<void> => {
  const { error } = await Promise.resolve(orderUpdateSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Update requestExtensiont() method error');
  }

  const { orderId } = req.params;
  const order: IOrderDocument = await requestDeliveryExtension(orderId, req.body);
  res.status(StatusCodes.OK).json({ message: 'Order delivery extension', order });
};

const deliveryDate = async (req: Request, res: Response): Promise<void> => {
  const { error } = await Promise.resolve(orderUpdateSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Update deliveryDate() method error');
  }

  const { orderId, type } = req.params;
  const order: IOrderDocument =
    type === 'approve'
      ? await approveRequestDeliveryExtensionDate(orderId, req.body)
      : await rejectedRequestDeliveryExtensionDate(orderId);
  res.status(StatusCodes.OK).json({ message: 'Order delivery date extension', order });
};

const buyerApproveOrder = async (req: Request, res: Response): Promise<void> => {
  const { orderId } = req.params;
  const order: IOrderDocument = await approveOrder(orderId, req.body);
  res.status(StatusCodes.OK).json({ message: 'Order approved successfully.', order });
};

const deliverOrder = async (req: Request, res: Response): Promise<void> => {
  const { orderId } = req.params;

  let file: string = req.body.file;
  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters: string = randomBytes.toString('hex');

  if (file) {
    const result: UploadApiResponse =
      req.body.fileType === 'zip'
        ? ((await uploads(file, `${randomCharacters}.zip`)) as UploadApiResponse)
        : ((await uploads(file)) as UploadApiResponse);

    if (!result.public_id) {
      throw new BadRequestError('File upload error. Try again...', 'Update deliverOrder() method error');
    }

    file = result.secure_url;
  }

  const deliverWorkObject: IDeliveredWork = {
    message: req.body.message,
    file,
    fileType: req.body.fileType,
    fileName: req.body.fileName,
    fileSize: req.body.fileSize
  };

  const order: IOrderDocument = await sellerDeliverOrder(orderId, true, deliverWorkObject);
  res.status(StatusCodes.OK).json({ message: 'Order delivered successfully.', order });
};

export { cancel, requestExtension, deliveryDate, buyerApproveOrder, deliverOrder };
