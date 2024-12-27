import { IMessageDocument } from '@shanisharrma/hustlr-shared';
import { model, Model, Schema } from 'mongoose';

const messageSchema: Schema = new Schema(
  {
    conversationId: { type: String, required: true, index: true },
    senderUsesrname: { type: String, required: true, index: true },
    receiverUsesrname: { type: String, required: true, index: true },
    senderPicture: { type: String, required: true },
    receiverPicture: { type: String, required: true },
    body: { type: String, default: '' },
    file: { type: String, default: '' },
    fileType: { type: String, default: '' },
    fileSize: { type: String, default: '' },
    fileName: { type: String, default: '' },
    gigId: { type: String, default: '' },
    buyerId: { type: String, required: true },
    sellerId: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    hasOffer: { type: Boolean, default: false },
    offer: {
      gigTitle: { type: String, default: '' },
      price: { type: Number, default: 0 },
      description: { type: String, default: '' },
      deliveryInDays: { type: Number, default: 0 },
      oldDeliveryDate: { type: String, default: '' },
      newDeliveryDate: { type: String, default: '' },
      accepted: { type: Boolean, default: false },
      cancelled: { type: Boolean, defatul: false }
    },
    createdAt: { type: Date, default: Date.now() }
  },
  { versionKey: false }
);

const MessageModel: Model<IMessageDocument> = model<IMessageDocument>('Message', messageSchema, 'Message');
export { MessageModel };
