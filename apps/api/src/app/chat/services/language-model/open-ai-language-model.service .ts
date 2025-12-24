import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ResponseInput } from 'openai/resources/responses/responses';
import { ILanguageModelService } from './language-model-service.interface';

@Injectable()
export class OpenAILanguageModelService implements ILanguageModelService {

    private readonly logger = new Logger(OpenAILanguageModelService.name);

    private readonly client: OpenAI;

    constructor(private readonly config: ConfigService) {
        this.client = new OpenAI({ apiKey: this.config.get<string>('OPENAI_API_KEY') });
    }

    async generate(input: ResponseInput): Promise<string> {
        try {
            const response = await this.client.responses.create({
                model: this.config.get<string>('OPENAI_LLM_MODEL'),
                input: input
            });
            return response.output_text;
        } catch (error) {
            this.logger.warn('openAI generate response failed', error);
            throw error;
        }
    }

}
