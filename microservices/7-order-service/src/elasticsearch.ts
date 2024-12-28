import { Client } from '@elastic/elasticsearch';
import { Logger } from 'winston';
import { winstonLogger } from '@shanisharrma/hustlr-shared';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/typesWithBodyKey';
import { serverConfig } from '@order/config';

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'orderElasticSearchServer', 'debug');

const elasticSearchClient = new Client({
  node: `${serverConfig.ELASTIC_SEARCH_URL}`
});

const checkConnection = async (): Promise<void> => {
  let isConnected = false;
  while (!isConnected) {
    logger.info('OrderService: Checking connection to Elastic Search...');
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      logger.info(`OrderService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      logger.error('Connection to Elastic Search failed. Restrying...', error);
      logger.log('error', 'OrderService checkConnection() method:', error);
    }
  }
};

export { elasticSearchClient, checkConnection };
