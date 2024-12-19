import { Logger } from 'winston';
import { winstonLogger } from '@shanisharrma/hustlr-shared';
import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/typesWithBodyKey';

import { serverConfig } from '@gateway/config';

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'APIGatewayElasticConnection', 'debug');

class ElasticSearch {
  private elasticSearchClient: Client;

  constructor() {
    this.elasticSearchClient = new Client({ node: serverConfig.ELASTIC_SEARCH_URL });
  }

  public async checkConnection(): Promise<void> {
    let isConnected = false;
    while (!isConnected) {
      logger.info('GatewayService Connecting to ElasticSearch');
      try {
        const health: ClusterHealthResponse = await this.elasticSearchClient.cluster.health({});
        logger.info(`GatewayService ElasticSearch health status = ${health.status}`);
        isConnected = true;
      } catch (error) {
        logger.error('ElasticSearch Connection Failed, Retrying...');
        logger.error('GatewayService checkConnection() method error:', error);
      }
    }
  }
}

export const elasticSearch: ElasticSearch = new ElasticSearch();
