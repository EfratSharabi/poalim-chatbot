import { ChatQuestion, ChatAnswer, ChatAction } from './index';

export interface ChatPayload {
  action: ChatAction;
  message: Omit<ChatQuestion, 'answers'> | ChatAnswer;
}
