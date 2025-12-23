import { inject, Injectable } from '@angular/core';
import { ChatAction, ChatAnswer, ChatAnswering, ChatQuestion } from '@poalim-chatbot/shared';
import { ChatSocketService } from './chat-socket.service';
import { ChatStateService } from './chat-state.service';

@Injectable({ providedIn: 'root' })
export class ChatActionService {

    private readonly chatSocketService = inject(ChatSocketService);
    private readonly chatStateService = inject(ChatStateService);

    sendQuestion(question: Omit<ChatQuestion, 'answers'>) {
        this.chatStateService.addTempQuestion(question);
        this.chatSocketService.emit(ChatAction.CREATE_QUESTION, question);
    }

    sendAnswer(answer: ChatAnswer) {
        this.chatSocketService.emit(ChatAction.CREATE_ANSWER, answer);
    }

    sendStartAnswer(answering: ChatAnswering) {
        this.chatSocketService.emit(ChatAction.START_ANSWER, answering);
    }

    sendEndAnswer(answering: ChatAnswering) {
        this.chatSocketService.emit(ChatAction.END_ANSWER, answering);
    }
}