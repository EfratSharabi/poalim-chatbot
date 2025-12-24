import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ChatStateService } from './services/chat-state.service';
import { ChatQuestionComposerComponent } from './ui/chat-question-composer/chat-question-composer.component';
import { ChatQuestionListComponent } from './ui/chat-question-list/chat-question-list.component';
import { ChatActivityStateService } from './services/chat-activity-state.service';

@Component({
  selector: 'app-chat-room',
  imports: [ChatQuestionComposerComponent, ChatQuestionListComponent],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatRoomComponent {

  private readonly chatStateService = inject(ChatStateService);

  questions = this.chatStateService.questions;

  expanded = new Set<string>();

  onCreateQuestion(correlationId: string) {
    this.expanded.add(correlationId);
  }
}
