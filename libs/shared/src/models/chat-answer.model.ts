import { ChatMessage } from './chat-message.model';

export interface ChatAnswer extends ChatMessage {
  questionId: string;
}
