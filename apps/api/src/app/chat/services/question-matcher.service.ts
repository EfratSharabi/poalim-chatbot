import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatQuestion } from '@poalim-chatbot/shared';
import { ChatStore } from '../store/chat.store';
import { EmbeddingStore } from '../store/embedding.store';
import { VectorSimilarityService } from './vector-similarity.service';

@Injectable()
export class QuestionMatcherService {
    private readonly logger = new Logger(QuestionMatcherService.name);

    constructor(
        private readonly config: ConfigService,
        private readonly chatStore: ChatStore,
        private readonly embeddingStore: EmbeddingStore,
        private readonly similarity: VectorSimilarityService,
    ) { }

    findBestMatch(question: ChatQuestion): ChatQuestion | null {
        try {
            const vectorInput = this.embeddingStore.getVector(question.id);
            if (!vectorInput) {
                return null;
            }
            let bestScore = 0;
            let bestMatch: ChatQuestion | null = null;

            const questions = this.chatStore.getAllQuestions();

            for (const { id } of questions) {
                if (id === question.id || !this.chatStore.getAnswers(id)) continue;
                const vector = this.embeddingStore.getVector(id);
                if (!vector) continue;
                const score = this.similarity.cosine(vectorInput, vector);
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = this.chatStore.getQuestion(id);
                }
            }
            const threshold = this.config.get<number>('MATCH_THRESHOLD', 0.3);

            return bestScore > threshold ? bestMatch : null;
        } catch (error) {
            this.logger.error('Failed to find best match', error);
            return null;
        }
    }

}
