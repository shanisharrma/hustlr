import { serverConfig } from '@users/config';
import { winstonLogger } from '@shanisharrma/hustlr-shared';
import client, { Channel, Connection } from 'amqplib';
import { Logger } from 'winston';

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'usersQueueConnection', 'debug');

async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(`${serverConfig.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    logger.info('Users server connection queue successfully.');
    closeConnection(channel, connection);
    return channel;
  } catch (error) {
    logger.log('UsersService createConnection() method:', error);
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
