import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ChatAnswer } from '@poalim-chatbot/shared';
import { ChatAnswerEmptyComponent } from '../chat-answer-empty/chat-answer-empty.component';
import { ChatAnswerPendingComponent } from '../chat-answer-pending/chat-answer-pending.component';
import { ChatAnswerComponent } from '../chat-answer/chat-answer.component';

@Component({
  selector: 'app-chat-answer-list',
  imports: [ChatAnswerComponent, ChatAnswerEmptyComponent, ChatAnswerPendingComponent],
  templateUrl: './chat-answer-list.component.html',
  styleUrl: './chat-answer-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatAnswerListComponent {
  questionId = input.required<string>();
  answers = input.required<ChatAnswer[]>();
}
