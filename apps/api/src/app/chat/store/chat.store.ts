import { Injectable } from '@nestjs/common';
import { ChatAnswer, ChatQuestion } from '@poalim-chatbot/shared';

@Injectable()
export class ChatStore {

  // questionId → question (without answers)
  private questions = new Map<string, Omit<ChatQuestion, 'answers'>>();

  // questionId → answers[]
  private answersByQuestion = new Map<string, ChatAnswer[]>();

  // normalizedQuestionText → questionId (quick search)
  private questionsIndex = new Map<string, string>();

  constructor() {
    this.questions.set('1111', { id: '1111', title: 'question 1', content: 'message 1', senderId: 'Efrat', timestamp: Date.now() });
    this.answersByQuestion.set('1111', [
      { id: 'a1', questionId: '1111', content: 'answer 1', senderId: 'Yossi', timestamp: Date.now() },
      { id: 'a2', questionId: '1111', content: 'answer 2', senderId: 'Leah', timestamp: Date.now() }
    ]);
    this.questions.set('2222', { id: '2222', title: 'question 2', content: 'message 2', senderId: 'Sara', timestamp: Date.now() });
    this.questions.set('3333', { id: '3333', title: 'question 3', content: 'message 3', senderId: 'Chana', timestamp: Date.now() });
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

  addQuestion(q: ChatQuestion) {
    const { id } = q;
    const { answers, ...qWithoutAnswers } = q;

    this.questions.set(id, qWithoutAnswers);

    if (!this.answersByQuestion.has(id)) {
      this.answersByQuestion.set(id, []);
    }
  }

  addAnswer(a: ChatAnswer) {
    const list = this.answersByQuestion.get(a.questionId) ?? [];
    list.push(a);
    this.answersByQuestion.set(a.questionId, list);
  }

}
