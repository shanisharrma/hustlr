import { serverConfig } from '@order/config';
import { OrderModel } from '@order/model/order-model';
import { publishDirectMessage } from '@order/queues/order-producer';
import { orderChannel } from '@order/server';
import {
  IDeliveredWork,
  IExtendedDelivery,
  IOrderDocument,
  IOrderMessage,
  IReviewMessageDetails,
  lowerCase
} from '@shanisharrma/hustlr-shared';
import { sendNotification } from './notification-service';

export const getOrderByOrderId = async (orderId: string): Promise<IOrderDocument> => {
  const order: IOrderDocument[] = await OrderModel.aggregate([{ $match: { orderId } }]);
  return order[0];
};

export const getOrdersBySellerId = async (sellerId: string): Promise<IOrderDocument[]> => {
  const orders: IOrderDocument[] = await OrderModel.aggregate([{ $match: { sellerId } }]);
  return orders;
};

export const getOrdersByBuyerId = async (buyerId: string): Promise<IOrderDocument[]> => {
  const orders: IOrderDocument[] = await OrderModel.aggregate([{ $match: { buyerId } }]);
  return orders;
};

export const createOrder = async (data: IOrderDocument): Promise<IOrderDocument> => {
  const order: IOrderDocument = await OrderModel.create(data);
  const messageDetails: IOrderMessage = {
    sellerId: data.sellerId,
    ongoingJobs: 1,
    type: 'create-order'
  };

  // update seller info
  await publishDirectMessage(
    orderChannel,
    'hustlr-seller-update',
    'user-seller',
    JSON.stringify(messageDetails),
    'Order Details sents to user service'
  );

  // send email to buyer
  const emailMessageDetails: IOrderMessage = {
    orderId: data.orderId,
    invoiceId: data.invoiceId,
    orderDue: `${data.offer.newDeliveryDate}`,
    amount: `${data.price}`,
    buyerUsername: lowerCase(data.buyerUsername),
    sellerUsername: lowerCase(data.sellerUsername),
    title: data.offer.gigTitle,
    description: data.offer.description,
    requirements: data.requirements,
    serviceFee: `${order.serviceFee}`,
    total: `${order.price + order.serviceFee!}`,
    orderUrl: `${serverConfig.CLIENT_URL}/orders/${data.orderId}/activities`,
    template: 'orderPlaced'
  };

  await publishDirectMessage(
    orderChannel,
    'hustlr-order-notification',
    'order-email',
    JSON.stringify(emailMessageDetails),
    'Order email sent to notification service'
  );

  sendNotification(order, 'placed an order for your gig', data.sellerUsername);
  return order;
};

export const cancelOrder = async (orderId: string, data: IOrderMessage): Promise<IOrderDocument> => {
  const order: IOrderDocument = (await OrderModel.findOneAndUpdate(
    { orderId },
    { $set: { cancelled: true, status: 'Cancelled', approvedAt: new Date() } },
    { new: true }
  ).exec()) as IOrderDocument;

  // update seller info
  await publishDirectMessage(
    orderChannel,
    'hustlr-seller-update',
    'user-seller',
    JSON.stringify({ type: 'cancelled-order', sellerId: data.sellerId }),
    'Cancelled Order Details sents to users service'
  );

  // update buyer info
  await publishDirectMessage(
    orderChannel,
    'hustlr-buyer-update',
    'user-buyer',
    JSON.stringify({ type: 'cancel-order', buyerId: data.buyerId, purchasedGigs: data.purchasedGigs }),
    'Cancelled Order Details sents to users service'
  );

  sendNotification(order, 'Cancelled your order delivery.', order.sellerUsername);
  return order;
};

export const approveOrder = async (orderId: string, data: IOrderMessage): Promise<IOrderDocument> => {
  const order: IOrderDocument = (await OrderModel.findOneAndUpdate(
    { orderId },
    { $set: { approved: true, status: 'Completed', approvedAt: new Date() } },
    { new: true }
  ).exec()) as IOrderDocument;

  // update seller info
  const orderMessageDetails: IOrderMessage = {
    sellerId: data.sellerId,
    buyerId: data.buyerId,
    ongoingJobs: data.ongoingJobs,
    completedJobs: data.completedJobs,
    totalEarnings: data.totalEarnings,
    recentDelivery: `${new Date()}`,
    type: 'approve-order'
  };

  await publishDirectMessage(
    orderChannel,
    'hustlr-seller-update',
    'user-seller',
    JSON.stringify(orderMessageDetails),
    'Approved Order Details sents to users service'
  );

  // update buyer info
  await publishDirectMessage(
    orderChannel,
    'hustlr-buyer-update',
    'user-buyer',
    JSON.stringify({ type: 'purchased-gigs', buyerId: data.buyerId, purchasedGigs: data.purchasedGigs }),
    'Approved Order Details sents to users service'
  );

  sendNotification(order, 'Approved your order delivery.', order.sellerUsername);
  return order;
};

export const sellerDeliverOrder = async (
  orderId: string,
  delivered: boolean,
  deliveredWork: IDeliveredWork
): Promise<IOrderDocument> => {
  const order: IOrderDocument = (await OrderModel.findOneAndUpdate(
    { orderId },
    { $set: { delivered, status: 'Delivered', ['event.orderDeliverd']: new Date() }, $push: { deliveredWork } },
    { new: true }
  ).exec()) as IOrderDocument;

  // send email to buyer
  if (order) {
    const orderMessageDetails: IOrderMessage = {
      orderId,
      buyerUsername: lowerCase(order.buyerUsername),
      sellerUsername: lowerCase(order.sellerUsername),
      title: order.offer.gigTitle,
      description: order.offer.description,
      orderUrl: `${serverConfig.CLIENT_URL}/orders/${orderId}/activities`,
      template: 'orderDelivered'
    };

    // update buyer info
    await publishDirectMessage(
      orderChannel,
      'hustlr-order-notification',
      'order-email',
      JSON.stringify(orderMessageDetails),
      'Order Delivered message sent to notification service'
    );

    sendNotification(order, 'delivered your order.', order.buyerUsername);
  }
  return order;
};

export const requestDeliveryExtension = async (orderId: string, data: IExtendedDelivery): Promise<IOrderDocument> => {
  const { newDate, days, reason, originalDate } = data;
  const order: IOrderDocument = (await OrderModel.findOneAndUpdate(
    { orderId },
    {
      $set: {
        ['requestExtension.originalDate']: originalDate,
        ['requestExtension.newDate']: newDate,
        ['requestExtension.reason']: reason,
        ['requestExtension.days']: days
      }
    },
    { new: true }
  ).exec()) as IOrderDocument;

  // send email to buyer
  if (order) {
    const orderMessageDetails: IOrderMessage = {
      buyerUsername: lowerCase(order.buyerUsername),
      sellerUsername: lowerCase(order.sellerUsername),
      originalDate: order.offer.oldDeliveryDate,
      newDate: order.offer.newDeliveryDate,
      reason: order.offer.reason,
      title: order.offer.gigTitle,
      description: order.offer.description,
      orderUrl: `${serverConfig.CLIENT_URL}/orders/${orderId}/activities`,
      template: 'orderExtension'
    };

    // update buyer info
    await publishDirectMessage(
      orderChannel,
      'hustlr-order-notification',
      'order-email',
      JSON.stringify(orderMessageDetails),
      'Order Extension message sent to notification service'
    );

    sendNotification(order, 'requested for an order delivery data extension.', order.buyerUsername);
  }
  return order;
};

export const approveRequestDeliveryExtensionDate = async (
  orderId: string,
  data: IExtendedDelivery
): Promise<IOrderDocument> => {
  const { newDate, days, reason, deliveryDateUpdate } = data;
  const order: IOrderDocument = (await OrderModel.findOneAndUpdate(
    { orderId },
    {
      $set: {
        ['offer.deliveryInDays']: days,
        ['offer.newDeliveryDate']: newDate,
        ['offer.reason']: reason,
        ['events.deliveryDateUpdate']: new Date(`${deliveryDateUpdate}`),
        requestExtension: {
          originalDate: '',
          newDate: '',
          days: 0,
          reason: ''
        }
      }
    },
    { new: true }
  ).exec()) as IOrderDocument;

  // send email to buyer
  if (order) {
    const orderMessageDetails: IOrderMessage = {
      subject: 'Congratulations: Your extension request was approved',
      buyerUsername: lowerCase(order.buyerUsername),
      sellerUsername: lowerCase(order.sellerUsername),
      header: 'Request Accepted',
      type: 'accepted',
      message: 'You can continue working on the order',
      orderUrl: `${serverConfig.CLIENT_URL}/orders/${orderId}/activities`,
      template: 'orderExtensionApproval'
    };

    // update buyer info
    await publishDirectMessage(
      orderChannel,
      'hustlr-order-notification',
      'order-email',
      JSON.stringify(orderMessageDetails),
      'Order Delivery Date Extension approval message sent to notification service'
    );

    sendNotification(order, 'Approved your order delivery date extension.', order.sellerUsername);
  }
  return order;
};

export const rejectedRequestDeliveryExtensionDate = async (orderId: string): Promise<IOrderDocument> => {
  const order: IOrderDocument = (await OrderModel.findOneAndUpdate(
    { orderId },
    {
      $set: {
        requestExtension: {
          originalDate: '',
          newDate: '',
          days: 0,
          reason: ''
        }
      }
    },
    { new: true }
  ).exec()) as IOrderDocument;

  // send email to buyer
  if (order) {
    const orderMessageDetails: IOrderMessage = {
      subject: 'Aorry: Your extension request was rejected',
      buyerUsername: lowerCase(order.buyerUsername),
      sellerUsername: lowerCase(order.sellerUsername),
      header: 'Request Rejected',
      type: 'rejected',
      message: 'You can contact the buyer for more information.',
      orderUrl: `${serverConfig.CLIENT_URL}/orders/${orderId}/activities`,
      template: 'orderExtensionApproval'
    };

    // update buyer info
    await publishDirectMessage(
      orderChannel,
      'hustlr-order-notification',
      'order-email',
      JSON.stringify(orderMessageDetails),
      'Order Delivery Date Extension rejected message sent to notification service'
    );

    sendNotification(order, 'Rejected your order delivery date extension.', order.sellerUsername);
  }
  return order;
};

export const updateOrderReview = async (data: IReviewMessageDetails): Promise<IOrderDocument> => {
  const order: IOrderDocument = (await OrderModel.findOneAndUpdate(
    { orderId: data.orderId },
    {
      $set:
        data.type === 'buyer-review'
          ? {
              buyerReview: {
                rating: data.rating,
                review: data.review,
                created: new Date(`${data.createdAt}`)
              },
              ['events.buyerReview']: new Date(`${data.createdAt}`)
            }
          : {
              sellerReview: {
                rating: data.rating,
                review: data.review,
                created: new Date(`${data.createdAt}`)
              },
              ['events.sellerReview']: new Date(`${data.createdAt}`)
            }
    },
    { new: true }
  ).exec()) as IOrderDocument;

  // send email to buyer
  sendNotification(
    order,
    `left you a ${data.rating} star review`,
    data.type === 'buyer-review' ? order.sellerUsername : order.buyerUsername
  );
  return order;
};
