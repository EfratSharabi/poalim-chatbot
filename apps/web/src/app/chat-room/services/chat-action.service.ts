import { inject, Injectable } from '@angular/core';
import { ChatAction, ChatAnswer, ChatAnswerPending, ChatQuestion } from '@poalim-chatbot/shared';
import { ChatSocketService } from './chat-socket.service';
import { ChatStateService } from './chat-state.service';

@Injectable({
    providedIn: 'root'
})
export class ChatActionService {

    private readonly chatSocketService = inject(ChatSocketService);
    private readonly chatStateService = inject(ChatStateService);

    sendQuestion(question: Omit<ChatQuestion, 'answers'>): void {
        this.chatStateService.addTempQuestion(question);
        this.chatSocketService.emit(ChatAction.CREATE_QUESTION, question);
    }

    sendAnswer(answer: ChatAnswer): void {
        this.chatSocketService.emit(ChatAction.CREATE_ANSWER, answer);
    }

    notifyAnswerPending(answerPending: ChatAnswerPending): void {
        this.chatSocketService.emit(ChatAction.NOTIFY_ANSWER_PENDING, answerPending);
    }
}