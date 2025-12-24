import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatAction, ChatAnswer, ChatAnswerPending, ChatEvent, ChatQuestion } from '@poalim-chatbot/shared';
import { ChatUtils } from '../../utils/chat-utils';
import { ChatStore } from '../store/chat.store';
import { EmbeddingStore } from '../store/embedding.store';
import { BotService } from './bot.service';

export const CHAT_EVENT = 'chatEvent';

type ChatActionMessage = Omit<ChatQuestion, 'answers'> | ChatAnswer;

@Injectable()
export class ChatService {

  private readonly logger = new Logger(ChatService.name);

  private readonly actionHandlers: Record<ChatAction, (message: any) => void> = {
    [ChatAction.CREATE_QUESTION]: (msg: ChatQuestion) => this.createQuestion(msg),
    [ChatAction.CREATE_ANSWER]: (msg: ChatAnswer) => this.createAnswer(msg),
    [ChatAction.NOTIFY_ANSWER_PENDING]: (msg: ChatAnswerPending) => this.notifyAnswerPending(msg),
  };

  constructor(
    private readonly chatStore: ChatStore,
    private readonly embeddingStore: EmbeddingStore,
    private readonly bot: BotService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  getChatHistory(): ChatQuestion[] {
    return this.chatStore.getAllQuestionsWithAnswers();
  }

  handleAction(action: ChatAction, message: ChatActionMessage): void {
    const handler = this.actionHandlers[action];
    handler?.(message);
  }

  private async createQuestion(q: Omit<ChatQuestion, 'answers'> & { answers?: ChatAnswer[] }): Promise<void> {
    const question = this.buildQuestion(q);
    this.chatStore.addQuestion(question);
    this.emitEvent(ChatEvent.NEW_QUESTION, question);
    this.createBotAnswer(question);
  }

  private createAnswer(a: ChatAnswer): void {
    const answer = this.buildAnswer(a);
    this.chatStore.addAnswer(answer);
    this.emitEvent(ChatEvent.NEW_ANSWER, answer);
  }

  private notifyAnswerPending(answerPending: ChatAnswerPending): void {
    this.emitEvent(ChatEvent.ANSWER_PENDING, answerPending);
  }

  private async createBotAnswer(question: ChatQuestion): Promise<void> {
    const writingPayload = { senderId: this.bot.botName, questionId: question.id };

    try {
      this.emitEvent(ChatEvent.ANSWER_PENDING, { ...writingPayload, mode: 'on' });

      await this.embeddingStore.embedQuestion(question)

      const botAnswer = await this.bot.generateAnswerForQuestion(question);

      this.chatStore.addAnswer(botAnswer);

      this.emitEvent(ChatEvent.NEW_ANSWER, botAnswer);

    } catch (e) {
      this.logger.warn('Bot generation failed', e);
    } finally {
      this.emitEvent(ChatEvent.ANSWER_PENDING, { ...writingPayload, mode: 'off' });
    }
  }

  private buildQuestion(question: Omit<ChatQuestion, 'answers'> & { answers?: ChatAnswer[] }): ChatQuestion {
    return {
      ...question,
      id: question.id || ChatUtils.generateId(),
      senderId: question.senderId || 'anonymous',
      timestamp: question.timestamp || Date.now(),
      answers: question.answers ?? []
    };
  }

  private buildAnswer(answer: ChatAnswer): ChatAnswer {
    return {
      ...answer,
      id: answer.id || ChatUtils.generateId(),
      senderId: answer.senderId || 'anonymous',
      timestamp: answer.timestamp || Date.now()
    };
  }

  private emitEvent<T>(event: ChatEvent, payload: T) {
    this.eventEmitter.emit(CHAT_EVENT, { event, payload });
  }
}
