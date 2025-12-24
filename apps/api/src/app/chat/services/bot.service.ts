import { Inject, Injectable, Logger } from '@nestjs/common';
import { ChatAnswer, ChatQuestion } from '@poalim-chatbot/shared';
import { ChatUtils } from '../../utils/chat-utils';
import { ChatStore } from '../store/chat.store';
import { ILanguageModelService } from './language-model/language-model-service.interface';
import { LANGUAGE_MODEL_PROVIDER } from './language-model/language-model-token.const';
import { PromptBuilderService } from './prompt-builder.service';
import { QuestionMatcherService } from './question-matcher.service';

@Injectable()
export class BotService {

  private readonly logger = new Logger(BotService.name);

  readonly botName = 'Eli from Poalim';

  constructor(
    private readonly matcher: QuestionMatcherService,
    private readonly promptBuilder: PromptBuilderService,
    @Inject(LANGUAGE_MODEL_PROVIDER) private readonly languageModelService: ILanguageModelService,
    private readonly chatStore: ChatStore,
  ) { }

  async generateAnswerForQuestion(question: ChatQuestion): Promise<ChatAnswer> {
    try {
      const matched = this.matcher.findBestMatch(question);

      if (!matched) {
        return this.buildFallbackAnswer(question.id);
      }

      const answers = this.chatStore.getAnswers(matched.id);

      if (!answers) {
        return this.buildFallbackAnswer(question.id);
      }

      const prompt = this.promptBuilder.build({
        userQuestion: question.content,
        matchedQuestion: matched,
        existingAnswers: answers,
      });

      const answer = await this.languageModelService.generate(prompt);
      return this.buildBotAnswer(question.id, answer);
    } catch (error) {
      this.logger.log(error);
      return this.buildFallbackAnswer(question.id);
    }
  }

  private buildBotAnswer(questionId: string, answer: string): ChatAnswer {
    return {
      id: ChatUtils.generateId(),
      content: answer,
      senderId: this.botName,
      questionId: questionId,
      timestamp: Date.now(),
      isBot: true
    };
  }

  private buildFallbackAnswer(questionId: string): ChatAnswer {
    return this.buildBotAnswer(questionId, this.getFallbackAnswer());
  }

  private getFallbackAnswer(): string {
    return `Thanks for your question 😊  
I couldn’t find a similar question, but a bank representative will be happy to help you soon.`;
  }
}