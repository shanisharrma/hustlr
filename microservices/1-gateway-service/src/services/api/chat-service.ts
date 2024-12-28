import axios, { AxiosResponse } from 'axios';
import { AxiosService } from '@gateway/services/axios';
import { serverConfig } from '@gateway/config';
import { IMessageDocument } from '@shanisharrma/hustlr-shared';

export let axiosChatInstance: ReturnType<typeof axios.create>;

class ChatServcie {
  constructor() {
    const axiosService: AxiosService = new AxiosService(`${serverConfig.CHAT_BASE_URL}/api/v1/chat`, 'chat');
    axiosChatInstance = axiosService.axios;
  }

  public async getConversation(senderUsername: string, receiverUsername: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosChatInstance.get(`/conversation/${senderUsername}/${receiverUsername}`);
    return response;
  }

  public async getMessages(senderUsername: string, receiverUsername: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosChatInstance.get(`/${senderUsername}/${receiverUsername}`);
    return response;
  }

  public async getConversationList(username: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosChatInstance.get(`/conversations/${username}`);
    return response;
  }

  public async getUserMessages(conversationId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosChatInstance.get(`/${conversationId}`);
    return response;
  }

  public async addMessage(body: IMessageDocument): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosChatInstance.post('/', body);
    return response;
  }

  public async updateOffer(messageId: string, type: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosChatInstance.put('/offer', { messageId, type });
    return response;
  }

  public async markMessageAsRead(messageId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosChatInstance.post('/mark-as-read', { messageId });
    return response;
  }

  public async markMultipleMessagesAsRead(
    receiverUsername: string,
    senderUsername: string,
    messageId: string
  ): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosChatInstance.post('/mark-multiple-as-read', {
      receiverUsername,
      senderUsername,
      messageId
    });
    return response;
  }
}

export const chatServcie: ChatServcie = new ChatServcie();
