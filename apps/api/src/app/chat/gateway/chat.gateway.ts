import { OnEvent } from '@nestjs/event-emitter';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatEvent, ChatMessage, ChatPayload } from '@poalim-chatbot/shared';
import { Server, Socket } from 'socket.io';
import { CHAT_EVENT, ChatService } from '../services/chat.service';

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200' },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) { }

  afterInit(server: Server): void {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);
    const history = this.chatService.getChatHistory();
    client.emit('chatHistory', history);
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, payload: ChatPayload): void {
    console.log(`client sent action: ${payload?.action}`);
    if (!payload?.action) {
      console.warn('Invalid payload:', payload);
      return;
    }

    this.chatService.handleAction(payload.action, payload.message);
  }

  @OnEvent(CHAT_EVENT)
  handleChatEvent({ event, payload }: { event: ChatEvent; payload: ChatMessage }): void {
    this.server.emit(event, payload);
  }
}
