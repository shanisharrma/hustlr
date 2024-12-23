import { IBuyerDocument, ISellerDocument, winstonLogger } from '@shanisharrma/hustlr-shared';
import { serverConfig } from '@users/config';
import { Channel, ConsumeMessage, Replies } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@users/queues/connection';
import { createBuyer, updateBuyerPurchasedGigsProp } from '@users/services/buyer-service';
import {
  getRandomSellers,
  updateSellerCancellerJobsProp,
  updateSellerCompletedJobsProp,
  updateSellerOngoingJobsProp,
  updateSellerReview,
  updateTotalGigsCount
} from '@users/services/seller-service';
import { publishDirectMessage } from '@users/queues/user-producer';

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'usersServiceConsumer', 'debug');

const consumeBuyerDirectMessage = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'hustlr-buyer-update';
    const routingKey = 'user-buyer';
    const queueName = 'user-buyer-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const hustlrQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(queueName, exchangeName, routingKey);
    channel.consume(hustlrQueue.queue, async (msg: ConsumeMessage | null) => {
      const { type } = JSON.parse(msg!.content.toString());
      if (type === 'auth') {
        const { username, email, profilePicture, country, createdAt } = JSON.parse(msg!.content.toString());
        const buyer: IBuyerDocument = {
          username,
          email,
          profilePicture,
          country,
          purchasedGigs: [],
          createdAt
        };

        await createBuyer(buyer);
      } else {
        const { buyerId, purchasedGigs } = JSON.parse(msg!.content.toString());
        await updateBuyerPurchasedGigsProp(buyerId, purchasedGigs, type);
      }
      channel.ack(msg!);
    });
  } catch (error) {
    logger.log('error', 'UsersService UserConsumer consumeBuyerDirectMessage() method error: ', error);
  }
};

const consumeSellerDirectMessage = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'hustlr-seller-update';
    const routingKey = 'user-seller';
    const queueName = 'user-seller-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const hustlrQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(queueName, exchangeName, routingKey);
    channel.consume(hustlrQueue.queue, async (msg: ConsumeMessage | null) => {
      const { type, sellerId, ongoingJobs, completedJobs, totalEarnings, recentDelivery, gigSellerId, count } =
        JSON.parse(msg!.content.toString());
      if (type === 'create-order') {
        await updateSellerOngoingJobsProp(sellerId, ongoingJobs);
      } else if (type === 'approve-order') {
        await updateSellerCompletedJobsProp({ sellerId, ongoingJobs, completedJobs, totalEarnings, recentDelivery });
      } else if (type === 'update-gig-count') {
        await updateTotalGigsCount(`${gigSellerId}`, count);
      } else if (type === 'cancelled-order') {
        await updateSellerCancellerJobsProp(sellerId);
      }
      channel.ack(msg!);
    });
  } catch (error) {
    logger.log('error', 'UsersService UserConsumer consumeSellerDirectMessage() method error: ', error);
  }
};

const consumeReviewFanoutMessages = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'hustlr-review';
    const queueName = 'seller-review-queue';
    await channel.assertExchange(exchangeName, 'fanout');
    const hustlrQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(queueName, exchangeName, '');
    channel.consume(hustlrQueue.queue, async (msg: ConsumeMessage | null) => {
      const { type } = JSON.parse(msg!.content.toString());
      if (type === 'buyer-review') {
        await updateSellerReview(JSON.parse(msg!.content.toString()));
        await publishDirectMessage(
          channel,
          'hustlr-update-gig',
          'update-gig',
          JSON.stringify({ type: 'update-gig', gigReview: msg!.content.toString() }),
          'Message sent to gig service.'
        );
      }

      channel.ack(msg!);
    });
  } catch (error) {
    logger.log('error', 'UsersService UserConsumer consumeReviewFanoutMessages() method error: ', error);
  }
};

const consumeSeedGigDirectMessages = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'hustlr-gig';
    const routingKey = 'gig-sellers';
    const queueName = 'user-gig-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const hustlrQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(queueName, exchangeName, routingKey);
    channel.consume(hustlrQueue.queue, async (msg: ConsumeMessage | null) => {
      const { type } = JSON.parse(msg!.content.toString());
      if (type === 'get-sellers') {
        const { count } = JSON.parse(msg!.content.toString());
        const sellers: ISellerDocument[] = await getRandomSellers(parseInt(count, 10));
        await publishDirectMessage(
          channel,
          'hustlr-seed-gig',
          'receive-sellers',
          JSON.stringify({ type: 'receive-sellers', sellers, count }),
          'Message sent to gig service.'
        );
      }

      channel.ack(msg!);
    });
  } catch (error) {
    logger.log('error', 'UsersService UserConsumer consumeSeedGigDirectMessages() method error: ', error);
  }
};

export {
  consumeBuyerDirectMessage,
  consumeSellerDirectMessage,
  consumeReviewFanoutMessages,
  consumeSeedGigDirectMessages
};
