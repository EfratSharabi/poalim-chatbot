import { Injectable, Logger } from '@nestjs/common';
import { AIClientService } from './AI-client.service ';
import { PromptBuilderService } from './prompt-builder.service';
import { QuestionMatcherService } from './question-matcher.service';
import { ChatStore } from '../store/chat.store';
import { ChatAnswer, ChatQuestion } from '@poalim-chatbot/shared';
import { ChatUtils } from '../../utils/chat-utils';

@Injectable()
export class BotService {

  readonly botName = 'Eli from Poalim';

  constructor(
    private readonly matcher: QuestionMatcherService,
    private readonly promptBuilder: PromptBuilderService,
    private readonly AIClient: AIClientService,
    private readonly chatStore: ChatStore,
  ) { }

  async generateAnswerForQuestion(question: ChatQuestion): Promise<ChatAnswer> {
    try {
      const matched = this.matcher.findBestMatch(question);

      if (!matched) {
        return this.buildBotAnswer(question.id, this.getFallbackAnswer());
      }

      const answers = this.chatStore.getQuestion(matched.id).answers;

      if (!answers) {
        return this.buildBotAnswer(question.id, this.getFallbackAnswer());
      }

      const prompt = this.promptBuilder.build({
        userQuestion: question.content,
        matchedQuestion: matched,
        existingAnswers: answers,
      });

      const answer = await this.AIClient.generate(prompt);
      return this.buildBotAnswer(question.id, answer);
    } catch (error) {
      Logger.log(error);
      return this.buildBotAnswer(question.id, this.getFallbackAnswer());
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

  private getFallbackAnswer(): string {
    return `Thanks for your question 😊  
I couldn’t find a similar question, but a bank representative will be happy to help you soon.`;
  }
}