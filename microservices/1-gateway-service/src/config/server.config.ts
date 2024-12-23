import dotenv from 'dotenv';

dotenv.config();

class ServerConfig {
  public JWT_TOKEN: string | undefined;
  public GATEWAY_JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public SERVER_PORT: string | undefined;
  public CLIENT_URL: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public ELASTIC_SEARCH_URL: string | undefined;
  public ELASTIC_APM_SERVER_URL: string | undefined;
  public ELASTIC_API_SECRET_TOKEN: string | undefined;
  public AUTH_BASE_URL: string | undefined;
  public USERS_BASE_URL: string | undefined;
  public GIG_BASE_URL: string | undefined;
  public CHAT_BASE_URL: string | undefined;
  public ORDER_BASE_URL: string | undefined;
  public REVIEW_BASE_URL: string | undefined;
  public REDIS_HOST: string | undefined;

  constructor() {
    this.JWT_TOKEN = process.env.JWT_TOKEN || '1234';
    this.GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN || '1234';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.SECRET_KEY_TWO = process.env.SENDER_EMAIL_HOST || '';
    this.SECRET_KEY_ONE = process.env.SENDER_EMAIL_PORT || '';
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
    this.SERVER_PORT = process.env.SERVER_PORT || '';
    this.AUTH_BASE_URL = process.env.AUTH_BASE_URL || '';
    this.USERS_BASE_URL = process.env.USERS_BASE_URL || '';
    this.GIG_BASE_URL = process.env.GIG_BASE_URL || '';
    this.CHAT_BASE_URL = process.env.CHAT_BASE_URL || '';
    this.ORDER_BASE_URL = process.env.ORDER_BASE_URL || '';
    this.REVIEW_BASE_URL = process.env.REVIEW_BASE_URL || '';
    this.REDIS_HOST = process.env.REDIS_HOST || '';
  }
}

export const serverConfig: ServerConfig = new ServerConfig();
