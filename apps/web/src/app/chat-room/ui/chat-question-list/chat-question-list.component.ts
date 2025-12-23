import { ChangeDetectionStrategy, Component, Input, Signal } from '@angular/core';
import { ChatQuestion } from '@poalim-chatbot/shared';
import { ChatQuestionComponent } from '../chat-question/chat-question.component';

@Component({
  selector: 'app-chat-question-list',
  imports: [ChatQuestionComponent],
  templateUrl: './chat-question-list.component.html',
  styleUrl: './chat-question-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatQuestionListComponent {

  @Input({ required: true }) questions!: Signal<ChatQuestion[]>;

}
