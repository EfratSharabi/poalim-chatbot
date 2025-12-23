import { inject, Injectable, signal } from '@angular/core';
import { ChatAnswer, ChatQuestion } from '@poalim-chatbot/shared';
import { NotificationService } from '../../shared/services/notification.service';
import { ChatSocketService } from './chat-socket.service';

@Injectable({ providedIn: 'root' })
export class ChatStateService {

  questions = signal<ChatQuestion[]>([
    {
      id: '1111', title: 'question 1', content: 'message 1', senderId: 'Efrat', timestamp: Date.now(), answers: [
        { id: 'a1', questionId: '1111', content: 'answer 1', senderId: 'Yossi', timestamp: Date.now() },
        { id: 'a2', questionId: '1111', content: 'answer 2', senderId: 'Leah', timestamp: Date.now() }
      ]
    },
    { id: '2222', title: 'question 2', content: 'message 2', senderId: 'Sara', timestamp: Date.now(), answers: [] },
    { id: '3333', title: 'question 3', content: 'message 3', senderId: 'Chana', timestamp: Date.now(), answers: [] },

  ]);

  private questionsById = new Map<string, ChatQuestion>();
  private pendingClientQuestions = new Map<string, Omit<ChatQuestion, 'answers'>>();

  private readonly chatSocketService = inject(ChatSocketService);
  private readonly notificationService = inject(NotificationService);

  constructor() {
    this.chatSocketService.onHistory((msgs) => this.initHistory(msgs));
    this.chatSocketService.onNewQuestion((q) => this.handleServerQuestion(q));
    this.chatSocketService.onNewAnswer((a) => this.handleServerAnswer(a));
  }

  addTempQuestion(q: Omit<ChatQuestion, 'answers'>) {
    const tempId = `tmp-${Date.now()}`;
    const tmp: ChatQuestion = { ...(q as ChatQuestion), id: tempId, answers: [] };
    this.questionsById.set(tempId, tmp);
    this.pendingClientQuestions.set(tempId, q);
    this.syncQuestionsSignal();
  }

  private initHistory(msgs: ChatQuestion[]) {
    this.questionsById.clear();
    msgs.forEach((q) => this.questionsById.set(q.id, q));
    this.syncQuestionsSignal();
  }

  private handleServerQuestion(q: ChatQuestion) {
    const match = Array.from(this.pendingClientQuestions.entries()).find(([, orig]) => {
      return orig.content === q.content && orig.senderId === q.senderId && orig.timestamp === q.timestamp;
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

  private handleServerAnswer(a: ChatAnswer) {
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

  private syncQuestionsSignal() {
    const allQuestions = Array.from(this.questionsById.values());
    allQuestions.sort((a, b) => b.timestamp - a.timestamp);
    this.questions.set(allQuestions);
  }
}
