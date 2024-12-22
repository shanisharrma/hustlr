import { Logger } from 'winston';
import { winstonLogger } from '@shanisharrma/hustlr-shared';
import { serverConfig } from '@auth/config';
import { Channel } from 'amqplib';
import { createConnection } from '@auth/queues/connection';

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'authServiceProducer', 'debug');

export async function publishDirectMessage(
  channel: Channel,
  exchangeName: string,
  routingKey: string,
  message: string,
  logMessage: string
): Promise<void> {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    await channel.assertExchange(exchangeName, 'direct');
    channel.publish(exchangeName, routingKey, Buffer.from(message));
    logger.info(logMessage);
  } catch (error) {
    logger.error('AuthService Producer publishDirectMessage() method error:', error);
  }
}
