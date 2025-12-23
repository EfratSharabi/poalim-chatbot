import { Injectable } from '@angular/core';
import { ChatAction, ChatAnswer, ChatEvent, ChatQuestion } from '@poalim-chatbot/shared';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({ 
  providedIn: 'root' 
})
export class ChatSocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.apiUrl);
  }

  emit(action: ChatAction, message: any): void {
    this.socket.emit('sendMessage', { action, message });
  }

  onHistory(cb: (msgs: ChatQuestion[]) => void): void {
    this.socket.on('chatHistory', cb);
  }

  onNewQuestion(cb: (q: ChatQuestion) => void): void {
    this.socket.on(ChatEvent.NEW_QUESTION, cb as any);
  }

  onNewAnswer(cb: (a: ChatAnswer) => void): void {
    this.socket.on(ChatEvent.NEW_ANSWER, cb as any);
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
