import { winstonLogger } from '@shanisharrma/hustlr-shared';
import { serverConfig } from '@users/config';
import { Channel } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@users/queues/connection';

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'usersServiceProducer', 'debug');

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
    logger.log('error', 'UsersService publishDirectMessage() method error: ', error);
  }
};

export { publishDirectMessage };
