import { IOrderNotifcation } from '@shanisharrma/hustlr-shared';
import { model, Model, Schema } from 'mongoose';

const notificationSchema: Schema = new Schema({
  userTo: { type: String, detault: '', index: true },
  senderUsername: { type: String, default: '' },
  receiverUsername: { type: String, default: '' },
  senderPicture: { type: String, default: '' },
  receiverPicture: { type: String, default: '' },
  isRead: { type: Boolean, default: false },
  message: { type: String, default: '' },
  orderId: { type: String, default: '' },
  createdAt: { type: String, default: Date.now }
});

const OrderNotificationModel: Model<IOrderNotifcation> = model<IOrderNotifcation>(
  'OrderNotification',
  notificationSchema,
  'OrderNotification'
);
export { OrderNotificationModel };
