import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Field, form, required } from '@angular/forms/signals';
import { TranslateModule } from '@ngx-translate/core';
import { ChatQuestion } from '@poalim-chatbot/shared';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { ChatActionService } from '../../services/chat-action.service';
import { ChatMessageEditorComponent } from '../basic/chat-message-editor/chat-message-editor.component';

@Component({
  selector: 'app-chat-question-composer',
  imports: [
    TranslateModule,
    ChatMessageEditorComponent,
    Field,
    ButtonComponent,
    CardComponent,
    InputComponent,
  ],
  templateUrl: './chat-question-composer.component.html',
  styleUrl: './chat-question-composer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatQuestionComposerComponent {

  isEditorOpen = signal<boolean>(false);

  private readonly chatActionService = inject(ChatActionService);
  private readonly authenticationService = inject(AuthenticationService);

  questionModel = signal({
    title: '',
    content: ''
  });

  questionForm = form(this.questionModel, (schemaPath) => {
    required(schemaPath.title, { message: 'Title is required' });
    required(schemaPath.content, { message: 'Content is required' });
  });

  onSendQuestion(): void {
    if (this.questionForm().invalid()) return;

    const question: ChatQuestion = {
      id: '',
      title: this.questionForm.title().value(),
      content: this.questionForm.content().value(),
      senderId: this.authenticationService.currentUserId,
      timestamp: Date.now(),
      answers: []
    }
    this.chatActionService.sendQuestion(question);
    this.reset();
  }

  onCancelQuestion() {
    this.reset();
  }

  private reset() {
    this.isEditorOpen.set(false);
    this.questionModel.set({
      title: '',
      content: ''
    });
    this.questionForm().reset();
  }
}
