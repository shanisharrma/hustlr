import { serverConfig } from '@gig/config';
import { winstonLogger } from '@shanisharrma/hustlr-shared';
import { Logger } from 'winston';
import { client } from '@gig/redis/redis-connection';

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'gigChache', 'debug');

const getUserSelectedGigCategory = async (key: string): Promise<string | undefined> => {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
    const response: string = (await client.GET(key)) as string;
    return response;
  } catch (error) {
    logger.log('error', 'GigService GigCache getUserSeletedGigCategory() method error:', error);
  }
};

export { getUserSelectedGigCategory };
