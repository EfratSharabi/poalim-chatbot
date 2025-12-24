import { ChatEvent } from '@poalim-chatbot/shared';

export interface ChatEventPayload<T> {
    event: ChatEvent;
    payload: T;
}
