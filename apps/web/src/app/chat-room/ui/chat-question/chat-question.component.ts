import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCommentAlt } from '@fortawesome/free-solid-svg-icons';
import { ChatQuestion } from '@poalim-chatbot/shared';
import { ChatMessageComponent } from '../basic/chat-message/chat-message.component';
import { ChatAnswerComposerComponent } from '../chat-answer-composer/chat-answer-composer.component';
import { ChatAnswerListComponent } from '../chat-answer-list/chat-answer-list.component';

@Component({
  selector: 'app-chat-question',
  imports: [MatExpansionModule, FaIconComponent, ChatAnswerListComponent, ChatMessageComponent, ChatAnswerComposerComponent],
  templateUrl: './chat-question.component.html',
  styleUrl: './chat-question.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatQuestionComponent {
  question = input.required<ChatQuestion>();
  answersCountIcon = faCommentAlt;
}
