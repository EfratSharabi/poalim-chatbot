import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatAction, ChatAnswer, ChatEvent, ChatQuestion } from '@poalim-chatbot/shared';
import { ChatUtils } from '../../utils/chat-utils';
import { ChatStore } from '../store/chat.store';
import { BotService } from './bot.service';

export const CHAT_EVENT = 'chatEvent';

@Injectable()
export class ChatService {

  private readonly actionHandlers: Record<ChatAction, (message: any) => void> = {
    [ChatAction.CREATE_QUESTION]: (msg) => this.createQuestion(msg),
    [ChatAction.CREATE_ANSWER]: (msg) => this.createAnswer(msg),
  };

  constructor(
    private readonly store: ChatStore,
    private readonly bot: BotService,
    private readonly eventEmitter: EventEmitter2
  ) { }

  getChatHistory(): ChatQuestion[] {
    return this.store.getAllQuestionsWithAnswers();
  }

  private async createQuestion(q: Omit<ChatQuestion, 'answers'> & { answers?: ChatAnswer[] }): Promise<void> {
    const question: ChatQuestion = {
      id: q.id || ChatUtils.generateId(),
      title: q.title,
      content: q.content,
      senderId: q.senderId || 'anonymous',
      timestamp: q.timestamp || Date.now(),
      answers: q.answers ?? [],
    };
    this.store.addQuestion(question);

    // for (const a of question.answers) {
    //   this.store.addAnswer(a);
    // }

    this.eventEmitter.emit(CHAT_EVENT, { event: ChatEvent.NEW_QUESTION, payload: question });

    this.createBotAnswer(question);
  }

  private createAnswer(a: ChatAnswer): void {
    const answer: ChatAnswer = {
      id: a.id || ChatUtils.generateId(),
      content: a.content,
      senderId: a.senderId || 'anonymous',
      questionId: a.questionId,
      timestamp: a.timestamp || Date.now(),
    };
    this.store.addAnswer(answer);
    this.eventEmitter.emit(CHAT_EVENT, { event: ChatEvent.NEW_ANSWER, payload: answer });;
  }

  private async createBotAnswer(question: ChatQuestion): Promise<void> {
    try {
      const botAnswer = await this.bot.generateAnswerForQuestion(question);
      if (botAnswer) {
        this.store.addAnswer(botAnswer);
        this.eventEmitter.emit(CHAT_EVENT, { event: ChatEvent.NEW_ANSWER, payload: botAnswer });
      }
    } catch (e) {
      console.warn('Bot generation failed', e);
    }
  }

  handleAction(action: ChatAction, message: any): void {
    const handler = this.actionHandlers[action];
    handler?.(message);
  }
}
