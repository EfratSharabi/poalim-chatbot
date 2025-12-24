import { Injectable, OnModuleInit } from '@nestjs/common';
import { BankQAMock } from '../mock/bank-qa.mock';
import { ChatStore } from '../store/chat.store';
import { EmbeddingStore } from '../store/embedding.store';

@Injectable()
export class ChatBootstrapService implements OnModuleInit {

    constructor(
        private readonly chatStore: ChatStore,
        private readonly embeddingStore: EmbeddingStore,
    ) { }

    async onModuleInit(): Promise<void> {
        const questions = BankQAMock;

        for (const q of questions) {
            this.chatStore.addQuestion(q);
        }

        await Promise.all(
            questions.map(q => this.embeddingStore.embedQuestion(q))
        );
    }
}
