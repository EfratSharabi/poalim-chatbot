import { Injectable } from '@nestjs/common';
import { ChatAnswer, ChatQuestion } from '@poalim-chatbot/shared';

@Injectable()
export class ChatStore {

  // questionId → question (without answers)
  private questions = new Map<string, Omit<ChatQuestion, 'answers'>>();

  // questionId → answers[]
  private answersByQuestion = new Map<string, ChatAnswer[]>();

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

  getAnswers(id: string): ChatAnswer[] | undefined {
    return this.getQuestion(id)?.answers;
  }

  addQuestion(q: ChatQuestion): void {
    const { id } = q;
    const { answers, ...qWithoutAnswers } = q;

    this.questions.set(id, qWithoutAnswers);

    this.answersByQuestion.set(id, answers ?? []);
  }

  addAnswer(a: ChatAnswer): void {
    const list = this.answersByQuestion.get(a.questionId) ?? [];
    list.push(a);
    this.answersByQuestion.set(a.questionId, list);
  }

}
