import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat.gateway';
import { BotService } from './services/bot.service';
import { ChatBootstrapService } from './services/chat-bootstrap.service';
import { ChatService } from './services/chat.service';
import { EMBEDDING_PROVIDER } from './services/embedding/embedding-token.const';
import { HuggingFaceEmbeddingService } from './services/embedding/hugging-face-embedding.service';
import { LANGUAGE_MODEL_PROVIDER } from './services/language-model/language-model-token.const';
import { OpenAILanguageModelService } from './services/language-model/open-ai-language-model.service ';
import { PromptBuilderService } from './services/prompt-builder.service';
import { QuestionMatcherService } from './services/question-matcher.service';
import { VectorSimilarityService } from './services/vector-similarity.service';
import { ChatStore } from './store/chat.store';
import { EmbeddingStore } from './store/embedding.store';

@Module({
  imports: [
  ],
  providers: [
    ChatGateway,
    BotService,
    ChatBootstrapService,
    ChatService,
    PromptBuilderService,
    QuestionMatcherService,
    VectorSimilarityService,
    ChatStore,
    EmbeddingStore,
    { provide: EMBEDDING_PROVIDER, useClass: HuggingFaceEmbeddingService },
    { provide: LANGUAGE_MODEL_PROVIDER, useClass: OpenAILanguageModelService }
  ]
})
export class ChatModule { }