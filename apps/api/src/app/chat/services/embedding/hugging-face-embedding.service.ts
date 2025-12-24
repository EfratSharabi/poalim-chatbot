import { InferenceClient } from '@huggingface/inference';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEmbeddingService } from './embedding-service.interface';

@Injectable()
export class HuggingFaceEmbeddingService implements IEmbeddingService {

  private readonly logger = new Logger(HuggingFaceEmbeddingService.name);

  private readonly client: InferenceClient;

  constructor(private readonly config: ConfigService) {
    this.client = new InferenceClient(this.config.get<string>('HUGGINGFACE_API_KEY'));
  }

  async getVector(input: string | string[]): Promise<number[]> {
    try {
      const vector = await this.client.featureExtraction({
        model: this.config.get<string>('HUGGINGFACE_EMBEDDING_MODEL'),
        inputs: input,
        provider: 'hf-inference',
      });
      return vector as number[];
    } catch (error) {
      this.logger.error('Failed to extract embedding', error);
      throw error;
    }
  }
}
