import { serverConfig } from '@gateway/config';
import { winstonLogger } from '@shanisharrma/hustlr-shared';
import { createClient } from 'redis';
import { Logger } from 'winston';

type TRedisClient = ReturnType<typeof createClient>;

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'gatewayCache', 'debug');

export class GatewayCache {
  client: TRedisClient;

  constructor() {
    this.client = createClient({ url: `${serverConfig.REDIS_HOST}` });
  }

  public async saveUserSelectedCategory(key: string, value: string): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.SET(key, value);
    } catch (error) {
      logger.log('error', 'GatewayService GatewayCache saveUserSelectedCategory() method error', error);
    }
  }

  public async saveLoggedInUserToCache(key: string, value: string): Promise<string[] | undefined> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const index: number | null = await this.client.LPOS(key, value);
      if (index === null) {
        await this.client.LPUSH(key, value);
        logger.info(`User ${value} added to cache`);
      }
      const response: string[] = await this.client.LRANGE(key, 0, -1);
      return response;
    } catch (error) {
      logger.log('error', 'GatewayService GatewayCache saveLoggedInUserToCache() method error', error);
    }
  }

  public async getLoggedInUserFromCache(key: string): Promise<string[] | undefined> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const response: string[] = await this.client.LRANGE(key, 0, -1);
      return response;
    } catch (error) {
      logger.log('error', 'GatewayService GatewayCache getLoggedInUserToCache() method error', error);
    }
  }

  public async removeLoggedInUserFromCache(key: string, value: string): Promise<string[] | undefined> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.LREM(key, 1, value);
      logger.info(`User ${value} removed from cache`);
      const response: string[] = await this.client.LRANGE(key, 0, -1);
      return response;
    } catch (error) {
      logger.log('error', 'GatewayService GatewayCache removeLoggedInUserToCache() method error', error);
    }
  }
}
