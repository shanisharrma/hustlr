import { serverConfig } from '@gig/config';
import { winstonLogger } from '@shanisharrma/hustlr-shared';
import { createClient } from 'redis';
import { Logger } from 'winston';

type TRedisClient = ReturnType<typeof createClient>;

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'gigRedisConnection', 'debug');

const client: TRedisClient = createClient({ url: `${serverConfig.REDIS_HOST}` });

const redisConnect = async (): Promise<void> => {
  try {
    await client.connect();
    logger.info(`GigService Redis Connection: ${await client.ping()}`);
    cacheError();
  } catch (error) {
    logger.log('error', 'GigService redisConnect() method error:', error);
  }
};

const cacheError = (): void => {
  client.on('error', (error: unknown) => {
    logger.error(error);
  });
};

export { client, redisConnect };
