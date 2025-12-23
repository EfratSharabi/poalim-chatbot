import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ChatGateway } from './gateway/chat.gateway';
import { ChatService } from './services/chat.service';
import { ChatStore } from './store/chat.store';
import { BotService } from './services/bot.service';
import { BotSimilarityService } from './services/bot-similarity.service';
import { BotPersonalityService } from './services/bot-personality.service';

@Module({
  imports: [
  ],
  providers: [
    ChatGateway,
    ChatService,
    ChatStore,
    BotService,
    BotSimilarityService,
    BotPersonalityService,
  ]
})
export class ChatModule { }