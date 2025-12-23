import { ChatAnswer } from './chat-answer.model';
import { ChatMessage } from './chat-message.model';

export interface ChatQuestion extends ChatMessage {
  title: string;
  answers: ChatAnswer[]; 
}
