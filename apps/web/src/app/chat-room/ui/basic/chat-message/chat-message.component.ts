import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Input, Signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faRobot, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { ChatMessage } from '@poalim-chatbot/shared';
import { MessageSenderFormatPipe } from '../../../pipes/message-sender-format.pipe';
import { MessageTimestampFormatPipe } from '../../../pipes/message-timestamp-format.pipe';

@Component({
  selector: 'app-chat-message',
  imports: [FaIconComponent, MessageTimestampFormatPipe, MessageSenderFormatPipe],
  providers: [DatePipe],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMessageComponent {

  private readonly userIcon = faUserCircle;
  private readonly robotIcon = faRobot;

  @Input({ required: true }) message!: Signal<ChatMessage>;

  senderIcon = computed(() => {
    //Todo is bot
    return this.message().isBot ? this.robotIcon : this.userIcon;
  });
}
