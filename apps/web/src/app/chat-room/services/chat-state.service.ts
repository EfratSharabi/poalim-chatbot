import { inject, Injectable, signal } from '@angular/core';
import { ChatAnswer, ChatQuestion } from '@poalim-chatbot/shared';
import { NotificationService } from '../../shared/services/notification.service';
import { ChatSocketService } from './chat-socket.service';
import { nanoid } from 'nanoid';

@Injectable({
  providedIn: 'root'
})
export class ChatStateService {

  questions = signal<ChatQuestion[]>([]);

  private questionsById = new Map<string, ChatQuestion>();
  private pendingClientQuestions = new Map<string, Omit<ChatQuestion, 'answers'>>();

  private readonly chatSocketService = inject(ChatSocketService);
  private readonly notificationService = inject(NotificationService);

  constructor() {
    this.chatSocketService.onHistory((msgs) => this.initHistory(msgs));
    this.chatSocketService.onNewQuestion((q) => this.handleServerQuestion(q));
    this.chatSocketService.onNewAnswer((a) => this.handleServerAnswer(a));
  }

  addTempQuestion(q: Omit<ChatQuestion, 'answers'>): void {
    const tempId = `tmp-${Date.now()}`;
    const tmp: ChatQuestion = { ...(q as ChatQuestion), id: tempId, answers: [] };
    this.questionsById.set(tempId, tmp);
    this.pendingClientQuestions.set(tempId, q);
    this.syncQuestionsSignal();
  }

  private initHistory(msgs: ChatQuestion[]): void {
    this.questionsById.clear();
    msgs
      .map(q => this.ensureCorrelationId(q))
      .forEach((q) => this.questionsById.set(q.id, q));
    this.syncQuestionsSignal();
  }

  private handleServerQuestion(q: ChatQuestion): void {
    q = this.ensureCorrelationId(q);
    const match = Array.from(this.pendingClientQuestions.entries()).find(([, orig]) => {
      return orig.correlationId === q.correlationId;
    });

    if (match) {
      const [tempId] = match;
      this.questionsById.delete(tempId);
      this.questionsById.set(q.id, q);
      this.pendingClientQuestions.delete(tempId);
      this.syncQuestionsSignal();
      return;
    }

    this.notificationService.info('chat.new-question-received');
    this.questionsById.set(q.id, q);
    this.syncQuestionsSignal();
  }

  private handleServerAnswer(a: ChatAnswer): void {
    const question = this.questionsById.get(a.questionId);
    if (question) {
      const updatedQuestion = {
        ...question,
        answers: [...question.answers, a]
      };
      this.questionsById.set(a.questionId, updatedQuestion);
      this.syncQuestionsSignal();
    }
  }

  private syncQuestionsSignal(): void {
    const allQuestions = Array.from(this.questionsById.values());
    allQuestions.sort((a, b) => b.timestamp - a.timestamp);
    this.questions.set(allQuestions);
  }

  private ensureCorrelationId(q: ChatQuestion): ChatQuestion {
    return {
      ...q,
      correlationId: q.correlationId ?? nanoid()
    };
  }
}
