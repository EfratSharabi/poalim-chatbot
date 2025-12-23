import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat.gateway';
import { ChatService } from './services/chat.service';
import { ChatStore } from './store/chat.store';
import { BotService } from './services/bot.service';
import { AIClientService } from './services/AI-client.service ';
import { PromptBuilderService } from './services/prompt-builder.service';
import { QuestionMatcherService } from './services/question-matcher.service';

@Module({
  imports: [
  ],
  providers: [
    AIClientService,
    PromptBuilderService,
    QuestionMatcherService,
    ChatGateway,
    ChatService,
    ChatStore,
    BotService,
  ]
})
export class ChatModule { }