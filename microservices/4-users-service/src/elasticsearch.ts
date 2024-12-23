import { Client } from '@elastic/elasticsearch';
import { Logger } from 'winston';
import { winstonLogger } from '@shanisharrma/hustlr-shared';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/typesWithBodyKey';
import { serverConfig } from '@users/config';

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'usersElasticSearchServer', 'debug');

const elasticSearchClient = new Client({
  node: `${serverConfig.ELASTIC_SEARCH_URL}`
});

const checkConnection = async (): Promise<void> => {
  let isConnected = false;
  while (!isConnected) {
    logger.info('UsersService: Checking connection to Elastic Search...');
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      logger.info(`UsersService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      logger.error('Connection to Elastic Search failed. Restrying...', error);
      logger.log('UsersService checkConnection() method:', error);
    }
  }
};

export { checkConnection, elasticSearchClient };
