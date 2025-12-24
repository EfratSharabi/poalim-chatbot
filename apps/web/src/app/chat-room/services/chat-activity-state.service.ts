import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { ChatAnswerPending } from '@poalim-chatbot/shared';
import { ChatSocketService } from './chat-socket.service';
import { AuthenticationService } from '../../core/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ChatActivityStateService {

  // questionId → Signal<ChatAnswerPending[]
  private pendingByQuestion = new Map<string, WritableSignal<ChatAnswerPending[]>>();

  private readonly chatSocketService = inject(ChatSocketService);
  private readonly authenticationService = inject(AuthenticationService);

  constructor() {
    this.chatSocketService.onAnswerPending((msg) => this.handlePendingEvent(msg));
  }

  getPendingAnswers(questionId: string) {
    if (!this.pendingByQuestion.has(questionId)) {
      this.pendingByQuestion.set(questionId, signal<ChatAnswerPending[]>([]));
    }
    return this.pendingByQuestion.get(questionId)!;
  }

  private handlePendingEvent(event: ChatAnswerPending) {
    if (event.senderId === this.authenticationService.currentUserId) {
      return;
    }
    const pendingSignal = this.getPendingAnswers(event.questionId);

    pendingSignal.update(current => {
      if (event.mode === 'on') {
        return [...current, event];
      } else {
        return current.filter(a => a.senderId !== event.senderId);
      }
    });
  }
}
