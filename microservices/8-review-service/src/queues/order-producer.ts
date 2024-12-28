import { winstonLogger } from '@shanisharrma/hustlr-shared';
import { serverConfig } from '@review/config';
import { Channel } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@review/queues/connection';

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'reviewServiceProducer', 'debug');

const publishFanoutMessage = async (
  channel: Channel,
  exchangeName: string,
  message: string,
  logMessage: string
): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    await channel.assertExchange(exchangeName, 'fanout');
    channel.publish(exchangeName, '', Buffer.from(message));
    logger.info(logMessage);
  } catch (error) {
    logger.log('error', 'ReviewService publishFanoutMessage() method error: ', error);
  }
};

export { publishFanoutMessage };
