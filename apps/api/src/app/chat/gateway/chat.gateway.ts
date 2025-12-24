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
import { ChatEventPayload } from '../models/chat-event-payload.model';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200' },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) { }

  afterInit(server: Server): void {
    this.logger.log('WebSocket server initialized');
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
    const history = this.chatService.getChatHistory();
    client.emit('chatHistory', history);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, payload: ChatPayload): void {
    this.logger.log(`client sent action: ${payload?.action}`);
    if (!payload?.action) {
      this.logger.warn('Invalid payload:', payload);
      return;
    }

    this.chatService.handleAction(payload.action, payload.message);
  }

  @OnEvent(CHAT_EVENT)
  handleChatEvent<T>({ event, payload }: ChatEventPayload<T>): void {
    this.server.emit(event, payload);
  }
}
