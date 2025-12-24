import { Inject, Injectable, Logger } from '@nestjs/common';
import { ChatQuestion } from '@poalim-chatbot/shared';
import { IEmbeddingService } from '../services/embedding/embedding-service.interface';
import { EMBEDDING_PROVIDER } from '../services/embedding/embedding-token.const';

@Injectable()
export class EmbeddingStore {

  private readonly logger = new Logger(EmbeddingStore.name);

  private questionVectors = new Map<string, number[]>();

  constructor(@Inject(EMBEDDING_PROVIDER) private readonly embeddingService: IEmbeddingService) { }

  getVector(questionId: string): number[] | undefined {
    return this.questionVectors.get(questionId);
  }

  async embedQuestion(question: ChatQuestion): Promise<void> {
    try {
      const vector = await this.embeddingService.getVector(`${question.title} ${question.content}`);
      this.questionVectors.set(question.id, vector);
    } catch (error) {
      this.logger.warn(`Could not store vector for question ${question.id}`, error);
    }
  }
}
