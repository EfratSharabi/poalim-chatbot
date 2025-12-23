import { ChangeDetectionStrategy, Component, computed, effect, EventEmitter, input, model, Output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormValueControl } from '@angular/forms/signals';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from 'apps/web/src/app/shared/ui/button/button.component';
import { Editor, NgxEditorModule } from 'ngx-editor';

@Component({
  selector: 'app-chat-message-editor',
  imports: [
    // CommonModule,
    ReactiveFormsModule,
    NgxEditorModule,
    TranslateModule,
    ButtonComponent
  ],
  templateUrl: './chat-message-editor.component.html',
  styleUrl: './chat-message-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMessageEditorComponent implements FormValueControl<string> {

  /** The current input value */
  value = model('');

  // @Input() diableSubmitButton: Signal<boolean> = signal<boolean>(false);
  diableSubmit = input(false);
  placeholder = input('What whould you like to say?');

  @Output() send = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<string>();

  editor!: Editor;

  control = new FormControl<string>(this.value(), { nonNullable: true });
  controlValue = toSignal(this.control.valueChanges);


  disableSubmitButton = computed(() => {
    return this.diableSubmit() || !this.controlValue()?.trim() || this.isEditorEmpty();
  });

  isEditorEmpty(): boolean {
    const doc = this.editor.view.state.doc;
    return doc.textContent.trim().length === 0;
  }

  constructor() {
    effect(() => {
      const value = this.value();
      if (value !== this.control.value) {
        this.control.setValue(value, { emitEvent: false });
      }
    });

    effect(() => {
      const value = this.controlValue();
      if (value !== undefined && value !== this.value()) {
        this.value.set(value);
      }
    });
  }

  ngOnInit(): void {
    this.editor = new Editor();
  }

  onSend(): void {
    if (this.disableSubmitButton()) {
      return;
    }
    const html = this.control.value?.trim();
    this.send.emit(html);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
