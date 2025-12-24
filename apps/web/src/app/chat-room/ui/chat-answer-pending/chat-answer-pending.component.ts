import { ChangeDetectionStrategy, Component, computed, inject, Input, Signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChatActivityStateService } from '../../services/chat-activity-state.service';

@Component({
  selector: 'app-chat-answer-pending',
  imports: [],
  templateUrl: './chat-answer-pending.component.html',
  styleUrl: './chat-answer-pending.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatAnswerPendingComponent {

  @Input({ required: true }) questionId!: Signal<string>;

  private readonly chatActivityStateService = inject(ChatActivityStateService);
  private readonly translateService = inject(TranslateService);

  typingText = computed(() => {
    const pending = this.chatActivityStateService.getPendingAnswers(this.questionId());
    return pending()
      .map((pending) => this.translateService.instant('chat.typing', { senderId: pending.senderId }))
      .join('\n');
  });

}
