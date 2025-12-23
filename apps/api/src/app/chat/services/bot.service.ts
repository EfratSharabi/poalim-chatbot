import { Injectable } from '@nestjs/common';
import { ChatAnswer, ChatQuestion } from '@poalim-chatbot/shared';
import { ChatUtils } from '../../utils/chat-utils';
import { ChatStore } from '../store/chat.store';
import { BotPersonalityService } from './bot-personality.service';
import { BotSimilarityService } from './bot-similarity.service';


@Injectable()
export class BotService {

  private readonly botName = 'Poalim Helper';

  constructor(
    private readonly store: ChatStore,
    private readonly similarity: BotSimilarityService,
    private readonly personality: BotPersonalityService,
  ) {}

  /**
   * Generate an answer for the given question if possible.
   * Strategy: find a similar past question and reuse its first answer, wrapped with personality.
   */
  async generateAnswerForQuestion(question: ChatQuestion): Promise<ChatAnswer | null> {
    const similarId = await this.similarity.findSimilarQuestionId(question);
    if (!similarId) return null;

    const similar = this.store.getQuestion(similarId);
    if (!similar) return null;

    const sourceAnswer = (similar.answers && similar.answers[0]) || null;
    if (!sourceAnswer) return null;

    const base = sourceAnswer.content;
    const wrapped = this.personality.wrapAnswer(base, this.botName);

    const botAnswer: ChatAnswer = {
      id: ChatUtils.generateId(),
      content: wrapped,
      senderId: this.botName,
      questionId: question.id,
      timestamp: Date.now(),
      isBot: true,
    };

    return botAnswer;
  }
}
