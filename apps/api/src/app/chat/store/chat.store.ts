import { Injectable } from '@nestjs/common';
import { ChatAnswer, ChatQuestion } from '@poalim-chatbot/shared';
import { BankQAMock } from '../mock/bank-qa.mock';
import { ChatUtils } from '../../utils/chat-utils';

@Injectable()
export class ChatStore {

  // questionId → question (without answers)
  private questions = new Map<string, Omit<ChatQuestion, 'answers'>>();

  // questionId → answers[]
  private answersByQuestion = new Map<string, ChatAnswer[]>();

  // questionId → normalizedQuestion
  private normalizedQuestions = new Map<string, string>();

  constructor() {
    this.initializeFromJson(BankQAMock);
  }

  getAllQuestions(): Omit<ChatQuestion, 'answers'>[] {
    return Array.from(this.questions.values());
  }

  getAllQuestionsWithAnswers(): ChatQuestion[] {
    const out: ChatQuestion[] = [];
    for (const [id, q] of this.questions.entries()) {
      const answers = this.answersByQuestion.get(id) ?? [];
      out.push({ ...q, answers });
    }

    out.sort((a, b) => a.timestamp - b.timestamp);
    return out;
  }

  getQuestion(id: string): ChatQuestion | undefined {
    const q = this.questions.get(id);
    if (!q) return undefined;
    const answers = this.answersByQuestion.get(id) ?? [];
    return { ...q, answers };
  }

  getAllNormalizedQuestionsWithAnswers(): { id: string; normalized: string }[] {
    return Array.from(this.questions.entries())
      .filter(([id]) => (this.answersByQuestion.get(id)?.length ?? 0) > 0)
      .map(([id]) => ({ id, normalized: this.normalizedQuestions.get(id) }));
  }

  addQuestion(q: ChatQuestion): void {
    const { id, title, content } = q;
    const { answers, ...qWithoutAnswers } = q;

    this.questions.set(id, qWithoutAnswers);

    if (!this.answersByQuestion.has(id)) {
      this.answersByQuestion.set(id, []);
    }
    this.normalizedQuestions.set(id, ChatUtils.normalize(title + ' ' + content));
  }

  addAnswer(a: ChatAnswer): void {
    const list = this.answersByQuestion.get(a.questionId) ?? [];
    list.push(a);
    this.answersByQuestion.set(a.questionId, list);
  }

  private initializeFromJson(data: ChatQuestion[]) {
    for (const question of data) {
      const { id, title, content } = question;
      const { answers, ...questionWithoutAnswers } = question;

      this.questions.set(id, questionWithoutAnswers);

      this.answersByQuestion.set(id, answers ?? []);

      this.normalizedQuestions.set(id, ChatUtils.normalize(title + ' ' + content));
    }
  }

}
