import { IConversationDocument } from '@shanisharrma/hustlr-shared';
import { model, Model, Schema } from 'mongoose';

const conversationSchema: Schema = new Schema({
  conversationId: { type: String, required: true, unique: true, index: true },
  senderUsesrname: { type: String, required: true, index: true },
  receiverUsesrname: { type: String, required: true, index: true }
});

const ConversationModel: Model<IConversationDocument> = model<IConversationDocument>(
  'Conversation',
  conversationSchema,
  'Conversation'
);
export { ConversationModel };
