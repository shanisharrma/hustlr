import { serverConfig } from '@gateway/config';
import { winstonLogger } from '@shanisharrma/hustlr-shared';
import { createClient } from 'redis';
import { Logger } from 'winston';

type TRedisClient = ReturnType<typeof createClient>;

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'gatewayRedisConnection', 'debug');

class RedisConnection {
  client: TRedisClient;

  constructor() {
    this.client = createClient({ url: `${serverConfig.REDIS_HOST}` });
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      logger.info(`APIGatewayService Redis Connection: ${await this.client.ping()}`);
      this.cacheError();
    } catch (error) {
      logger.log('error', 'APIGatewayService connect() method error:', error);
    }
  }

  private cacheError(): void {
    this.client.on('error', (error: unknown) => {
      logger.error(error);
    });
  }
}

export const redisConnection: RedisConnection = new RedisConnection();
