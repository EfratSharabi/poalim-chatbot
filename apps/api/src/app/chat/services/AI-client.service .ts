import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ResponseInput } from 'openai/resources/responses/responses';

@Injectable()
export class AIClientService {

    private openai = new OpenAI({ apiKey: this.config.get<string>('OPENAI_API_KEY') });

    constructor(private readonly config: ConfigService) { }

    async generate(input: ResponseInput): Promise<string> {
        try {
            const response = await this.openai.responses.create({
                model: this.config.get<string>('OPENAI_MODEL'),
                input: input,
            });
            return response.output_text;
        } catch (err) {
            console.warn('openAI generate response failed', err);
            return null;
        }
    }

}
