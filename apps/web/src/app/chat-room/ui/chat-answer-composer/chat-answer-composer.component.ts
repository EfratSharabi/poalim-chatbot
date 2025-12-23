import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ChatAnswer } from '@poalim-chatbot/shared';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { ChatActionService } from '../../services/chat-action.service';
import { ChatMessageEditorComponent } from '../basic/chat-message-editor/chat-message-editor.component';

@Component({
  selector: 'app-chat-answer-composer',
  imports: [TranslateModule, ButtonComponent, ChatMessageEditorComponent],
  templateUrl: './chat-answer-composer.component.html',
  styleUrl: './chat-answer-composer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatAnswerComposerComponent {

  @Input({ required: true }) questionId!: string;

  isEditorOpen = signal<boolean>(false);

  private readonly chatActionService = inject(ChatActionService);
  private readonly authenticationService = inject(AuthenticationService);

  onOpenEditor(): void {
    this.isEditorOpen.set(true);
    this.sendStartAnswer()
  }

  onSendAnswer($event: string): void {
    const answer: ChatAnswer = {
      id: '',
      content: $event,
      senderId: this.authenticationService.currentUserId,
      timestamp: Date.now(),
      questionId: this.questionId
    }
    this.chatActionService.sendAnswer(answer);
    this.isEditorOpen.set(false);
  }

  onCancelAnswer() {
    this.isEditorOpen.set(false);
    this.sendEndAnswer();
  }
  
  sendStartAnswer() {
    const answering = {
      questionId: this.questionId,
      senderId: this.authenticationService.currentUserId
    };
    this.chatActionService.sendStartAnswer(answering);
  }

  sendEndAnswer() {
    const answering = {
      questionId: this.questionId,
      senderId: this.authenticationService.currentUserId
    };
    this.chatActionService.sendEndAnswer(answering);
  }
}
