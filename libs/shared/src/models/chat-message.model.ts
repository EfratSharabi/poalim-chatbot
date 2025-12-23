export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  timestamp: number;
  isBot?: boolean;
}
