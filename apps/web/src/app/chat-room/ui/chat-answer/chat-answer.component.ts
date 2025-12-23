import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ChatAnswer } from '@poalim-chatbot/shared';
import { ChatMessageComponent } from '../basic/chat-message/chat-message.component';

@Component({
  selector: 'app-chat-answer',
  imports: [ChatMessageComponent],
  templateUrl: './chat-answer.component.html',
  styleUrl: './chat-answer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatAnswerComponent {

    answer = input.required<ChatAnswer>();

}
