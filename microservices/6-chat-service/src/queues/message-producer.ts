import { winstonLogger } from '@shanisharrma/hustlr-shared';
import { serverConfig } from '@chat/config';
import { Channel } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@chat/queues/connection';

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'chatServiceProducer', 'debug');

const publishDirectMessage = async (
  channel: Channel,
  exchangeName: string,
  routingKey: string,
  message: string,
  logMessage: string
): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    await channel.assertExchange(exchangeName, 'direct');
    channel.publish(exchangeName, routingKey, Buffer.from(message));
    logger.info(logMessage);
  } catch (error) {
    logger.log('error', 'ChatService publishDirectMessage() method error: ', error);
  }
};

export { publishDirectMessage };
