import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-chat-answer-empty',
  imports: [FaIconComponent, TranslateModule],
  templateUrl: './chat-answer-empty.component.html',
  styleUrl: './chat-answer-empty.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatAnswerEmptyComponent {
  emptyIcon = faComments;
 }
