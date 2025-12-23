import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatQuestion } from '@poalim-chatbot/shared';
import OpenAI from 'openai';
import { ChatStore } from '../store/chat.store';

@Injectable()
export class BotSimilarityService {

  private openai = new OpenAI({ apiKey: this.config.get<string>('OPENAI_API_KEY') });

  // questionId → embedding vector
  private questionEmbeddings = new Map<string, number[]>();

  constructor(
    private readonly config: ConfigService,
    private readonly store: ChatStore
  ) {
    this.buildEmbeddings();
  }

  async findSimilarQuestionId(question: ChatQuestion): Promise<string | undefined> {
    const newEmbedding = await this.getEmbedding(question.content);
    if (!newEmbedding) return undefined;

    let bestId: string | undefined = undefined;
    let bestScore = -1;

    for (const [id, emb] of this.questionEmbeddings.entries()) {
      if(id === question.id) continue; // skip self
      if(this.store.getQuestion(id)?.answers?.length === 0) continue; // skip questions without answers
      const score = this.cosineSimilarity(newEmbedding, emb);
      if (score > bestScore) {
        bestScore = score;
        bestId = id;
      }
    }

    this.questionEmbeddings.set(question.id, newEmbedding);

    if (bestScore < 0.75) return undefined;

    return bestId;
  }

  private async buildEmbeddings() {
    const questions = this.store.getAllQuestionsWithAnswers();
    for (const q of questions) {
      const embedding = await this.getEmbedding(q.content);
      if (embedding) this.questionEmbeddings.set(q.id, embedding);
    }
  }

  /**
   * Compute embedding using OpenAI API
   */
  private async getEmbedding(text: string): Promise<number[] | null> {
    try {
      // const response = await this.openai.embeddings.create({
      //   model: 'text-embedding-3-small',
      //   input: text,
      // });
      // return response.data[0].embedding;
      return [1];
    } catch (err) {
      console.warn('Embedding failed', err);
      return null;
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] ** 2;
      normB += b[i] ** 2;
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
