import { serverConfig } from '@gateway/config';
import { GatewayCache } from '@gateway/redis/gateway-cache';
import { IMessageDocument, winstonLogger } from '@shanisharrma/hustlr-shared';
import { Server, Socket } from 'socket.io';
import { io, Socket as SocketClient } from 'socket.io-client';
import { Logger } from 'winston';

const logger: Logger = winstonLogger(`${serverConfig.ELASTIC_SEARCH_URL}`, 'APIGatewaySocket', 'debug');
let chatSocketClient: SocketClient;

export class SocketIOAppHandler {
  private io: Server;
  private gatewayCache: GatewayCache;

  constructor(io: Server) {
    this.io = io;
    this.gatewayCache = new GatewayCache();
    this.chatSocketServiceIOConnections();
  }

  public listen(): void {
    this.chatSocketServiceIOConnections();
    this.io.on('connection', async (socket: Socket) => {
      socket.on('getLoggedInUsers', async () => {
        const response: string[] | undefined = await this.gatewayCache.getLoggedInUserFromCache('loggedInUsers');
        this.io.emit('online', response);
      });

      socket.on('loggedInUsers', async (username: string) => {
        const response: string[] | undefined = await this.gatewayCache.saveLoggedInUserToCache(
          'loggedInUsers',
          username
        );
        this.io.emit('online', response);
      });

      socket.on('removeLoggedInUsers', async (username: string) => {
        const response: string[] | undefined = await this.gatewayCache.removeLoggedInUserFromCache(
          'loggedInUsers',
          username
        );
        this.io.emit('online', response);
      });

      socket.on('category', async (username: string) => {
        await this.gatewayCache.saveUserSelectedCategory(`seletedCategories:${username}`, username);
      });
    });
  }

  private chatSocketServiceIOConnections(): void {
    chatSocketClient = io(`${serverConfig.CHAT_BASE_URL}`, {
      transports: ['websocket', 'pooling'],
      secure: true
    });

    chatSocketClient.on('connect', () => {
      logger.info('GatewayService --> ChatService socket connected');
    });

    chatSocketClient.on('disconnect', (reason: SocketClient.DisconnectReason) => {
      logger.log('error', 'GatewayService --> ChatService socket disconnect reason:', reason);
      chatSocketClient.connect();
    });

    chatSocketClient.on('connect_error', (error: Error) => {
      logger.log('error', 'GatewayService --> ChatService socket connection error:', error);
      chatSocketClient.connect();
    });

    // custom events
    chatSocketClient.on('message received', (data: IMessageDocument) => {
      this.io.emit('message received', data);
    });

    chatSocketClient.on('message updated', (data: IMessageDocument) => {
      this.io.emit('message updated', data);
    });
  }
}
