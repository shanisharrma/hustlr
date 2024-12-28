import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

dotenv.config();

class ServerConfig {
  public NODE_ENV: string | undefined;
  public SERVER_PORT: string | undefined;
  public GATEWAY_JWT_TOKEN: string | undefined;
  public JWT_TOKEN: string | undefined;
  public DATABASE_URL: string | undefined;
  public API_GATEWAY_URL: string | undefined;
  public CLIENT_URL: string | undefined;
  public RABBITMQ_ENDPOINT: string | undefined;
  public REDIS_HOST: string | undefined;
  public STRIPE_SECRET_KEY: string | undefined;
  public CLOUDINARY_CLOUD_NAME: string | undefined;
  public CLOUDINARY_API_KEY: string | undefined;
  public CLOUDINARY_API_SECRET: string | undefined;
  public ELASTIC_SEARCH_URL: string | undefined;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.SERVER_PORT = process.env.SERVER_PORT || '';
    this.GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN || '';
    this.JWT_TOKEN = process.env.JWT_TOKEN || '';
    this.DATABASE_URL = process.env.DATABASE_URL || '';
    this.API_GATEWAY_URL = process.env.API_GATEWAY_URL || '';
    this.CLIENT_URL = process.env.API_GATEWAY_URL || '';
    this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
    this.REDIS_HOST = process.env.REDIS_HOST || '';
    this.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
    this.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
    this.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
    this.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
  }

  public cloudinaryConfig(): void {
    cloudinary.v2.config({
      cloud_name: this.CLOUDINARY_CLOUD_NAME,
      api_key: this.CLOUDINARY_API_KEY,
      api_secret: this.CLOUDINARY_API_SECRET
    });
  }
}

export const serverConfig = new ServerConfig();
