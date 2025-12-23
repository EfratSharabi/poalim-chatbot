import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarLabel, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

@Component({
  selector: 'app-snackbar',
  imports: [MatIconButton, MatSnackBarModule, MatSnackBarLabel, FaIconComponent, TranslateModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnackbarComponent {

  private readonly snackBarRef = inject(MatSnackBarRef<SnackbarComponent>)

  readonly data: { message: string, type: NotificationType } = inject(MAT_SNACK_BAR_DATA);

  readonly closeIcon = faClose;

  close(): void {
    this.snackBarRef.dismiss();
  }
}
