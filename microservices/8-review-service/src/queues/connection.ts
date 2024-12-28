import { serverConfig } from '@review/config';
import { winstonLogger } from '@shanisharrma/hustlr-shared';
import client, { Channel, Connection } from 'amqplib';
import { Logger } from 'winston';

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'reviewQueueConnection', 'debug');

async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(`${serverConfig.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    logger.info('Review server connection queue successfully.');
    closeConnection(channel, connection);
    return channel;
  } catch (error) {
    logger.log('error', 'ReviewService createConnection() method:', error);
    return undefined;
  }
}

function closeConnection(channel: Channel, connection: Connection): void {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
}

export { createConnection };
