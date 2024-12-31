import dotenv from 'dotenv';

dotenv.config();

if(process.env.ENABLE_APM === '1') {
  require('elastic-apm-node').start({
    serviceName: 'hustlr-notification',
    serverUrl: process.env.ELASTIC_APM_SERVER_URL,
    secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
    environment: process.env.NODE_ENV,
    active: true,
    // active: process.env.NODE_ENV !== 'development',
    captureBody: 'all',
    errorOnAbortedRequests: true,
    captureErrorLogStackTraces: 'always',
  })
}

class Config {
  public NODE_ENV: string | undefined;
  public CLIENT_URL: string | undefined;
  public SENDER_EMAIL: string | undefined;
  public SENDER_EMAIL_PASSWORD: string | undefined;
  public SENDER_EMAIL_HOST: string | undefined;
  public SENDER_EMAIL_PORT: string | undefined;
  public RABBITMQ_ENDPOINT: string | undefined;
  public ELASTIC_SEARCH_URL: string | undefined;
  public SERVER_PORT: string | undefined;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.SENDER_EMAIL = process.env.SENDER_EMAIL || '';
    this.SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD || '';
    this.SENDER_EMAIL_HOST = process.env.SENDER_EMAIL_HOST || '';
    this.SENDER_EMAIL_PORT = process.env.SENDER_EMAIL_PORT || '';
    this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
    this.SERVER_PORT = process.env.SERVER_PORT || '';
  }
}

export const config: Config = new Config();
