import { Injectable } from '@nestjs/common';
import { ResponseInput } from 'openai/resources/responses/responses';

@Injectable()
export class PromptBuilderService {

    build(params: {
        userQuestion: string;
        matchedQuestion: any;
        existingAnswers: { content: string }[];
    }): ResponseInput {
        const systemContent = 'You are a helpful, friendly, and cheerful banking assistant.'

        const answersText = params.existingAnswers
            .map(a => `- ${a.content}`)
            .join('\n');

        const userContent = `
A customer asked:
"${params.userQuestion}"

A similar question was previously answered:
"${params.matchedQuestion.title}"

Previous answers:
${answersText}

Please write a friendly, clear, and helpful answer.
Use simple language and a warm, cheerful tone.
Make the customer feel comfortable and happy while explaining.
`;
        return [
            { role: 'system', content: systemContent },
            { role: 'user', content: userContent }
        ];
    }
}
