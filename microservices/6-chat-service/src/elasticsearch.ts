import { Client } from '@elastic/elasticsearch';
import { Logger } from 'winston';
import { winstonLogger } from '@shanisharrma/hustlr-shared';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/typesWithBodyKey';
import { serverConfig } from '@chat/config';

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'chatElasticSearchServer', 'debug');

const elasticSearchClient = new Client({
  node: `${serverConfig.ELASTIC_SEARCH_URL}`
});

const checkConnection = async (): Promise<void> => {
  let isConnected = false;
  while (!isConnected) {
    logger.info('ChatService: Checking connection to Elastic Search...');
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      logger.info(`ChatService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      logger.error('Connection to Elastic Search failed. Restrying...', error);
      logger.log('error', 'ChatService checkConnection() method:', error);
    }
  }
};

export { checkConnection };
