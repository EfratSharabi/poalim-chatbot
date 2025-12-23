import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatAction, ChatAnswer, ChatEvent, ChatQuestion } from '@poalim-chatbot/shared';
import { ChatUtils } from '../../utils/chat-utils';
import { ChatStore } from '../store/chat.store';
import { BotService } from './bot.service';

export const CHAT_EVENT = 'chatEvent';

type ChatActionMessage = Omit<ChatQuestion, 'answers'> | ChatAnswer;

@Injectable()
export class ChatService {
  private readonly actionHandlers: Record<ChatAction, (message: ChatActionMessage) => void> = {
    [ChatAction.CREATE_QUESTION]: (msg: ChatQuestion) => this.createQuestion(msg),
    [ChatAction.CREATE_ANSWER]: (msg: ChatAnswer) => this.createAnswer(msg),
  };

  constructor(
    private readonly store: ChatStore,
    private readonly bot: BotService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  getChatHistory(): ChatQuestion[] {
    return this.store.getAllQuestionsWithAnswers();
  }

  handleAction(action: ChatAction, message: ChatActionMessage): void {
    const handler = this.actionHandlers[action];
    handler?.(message);
  }

  private async createQuestion(q: Omit<ChatQuestion, 'answers'> & { answers?: ChatAnswer[] }): Promise<void> {
    const question = this.buildQuestion(q);
    this.store.addQuestion(question);

    this.emitEvent(ChatEvent.NEW_QUESTION, question);

    this.createBotAnswer(question);
  }

  private createAnswer(a: ChatAnswer): void {
    const answer = this.buildAnswer(a, a.questionId);
    this.store.addAnswer(answer);
    this.emitEvent(ChatEvent.NEW_ANSWER, answer);
  }

  private async createBotAnswer(question: ChatQuestion): Promise<void> {
    const writingPayload = { senderId: this.bot.botName, questionId: question.id };

    try {
      this.emitEvent(ChatEvent.ANSWER_PENDING, { ...writingPayload, mode: 'on' });

      const botAnswer = await this.bot.generateAnswerForQuestion(question);
      this.store.addAnswer(botAnswer);
      this.emitEvent(ChatEvent.NEW_ANSWER, botAnswer);

    } catch (e) {
      console.warn('Bot generation failed', e);
    } finally {
      this.emitEvent(ChatEvent.ANSWER_PENDING, { ...writingPayload, mode: 'off' });
    }
  }

  private buildQuestion(question: Omit<ChatQuestion, 'answers'> & { answers?: ChatAnswer[] }): ChatQuestion {
    return {
      id: question.id || ChatUtils.generateId(),
      title: question.title,
      content: question.content,
      senderId: question.senderId || 'anonymous',
      timestamp: question.timestamp || Date.now(),
      answers: question.answers ?? [],
    };
  }

  private buildAnswer(answer: ChatAnswer, questionId: string): ChatAnswer {
    return {
      id: answer.id || ChatUtils.generateId(),
      content: answer.content,
      senderId: answer.senderId || 'anonymous',
      questionId,
      timestamp: answer.timestamp || Date.now(),
    };
  }

  private emitEvent(event: ChatEvent, payload: any) {
    this.eventEmitter.emit(CHAT_EVENT, { event, payload });
  }
}
