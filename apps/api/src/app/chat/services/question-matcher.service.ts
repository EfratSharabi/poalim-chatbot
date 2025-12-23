import { Injectable } from '@nestjs/common';
import { ChatStore } from '../store/chat.store';
import { ChatQuestion } from '@poalim-chatbot/shared';
import { ChatUtils } from '../../utils/chat-utils';

@Injectable()
export class QuestionMatcherService {

    constructor(private readonly chatStore: ChatStore) { }

    findBestMatch(question: ChatQuestion) {
        const normalizedInput = ChatUtils.normalize(question.title + ' ' + question.content);
        let bestMatch = null;
        let bestScore = 0;

        const questionsWithAnswers = this.chatStore.getAllNormalizedQuestionsWithAnswers();

        for (const { id, normalized } of questionsWithAnswers) {
            if (question.id === id) continue;
            const score = this.similarity(normalizedInput, normalized);

            if (score > bestScore) {
                bestScore = score;
                bestMatch = this.chatStore.getQuestion(id);
            }
        }

        return bestScore > 0.3 ? bestMatch : null;
    }

    private similarity(a: string, b: string): number {
        const aWords = new Set(a.split(' '));
        const bWords = new Set(b.split(' '));

        const intersection = [...aWords].filter(w => bWords.has(w));
        return intersection.length / Math.max(aWords.size, bWords.size);
    }
}