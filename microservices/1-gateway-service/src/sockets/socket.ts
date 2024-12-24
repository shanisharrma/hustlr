import { GatewayCache } from '@gateway/redis/gateway-cache';
import { Server, Socket } from 'socket.io';

export class SocketIOAppHandler {
  private io: Server;
  private gatewayCache: GatewayCache;

  constructor(io: Server) {
    this.io = io;
    this.gatewayCache = new GatewayCache();
  }

  public listen(): void {
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
}
