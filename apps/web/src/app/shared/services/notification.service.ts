import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';
import { NotificationType, SnackbarComponent } from '../ui/snackbar/snackbar.component';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    private readonly defaultConfig: MatSnackBarConfig = {
        duration: 8000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['notification-snackbar']
    };
    private readonly snackBar = inject(MatSnackBar);

    open(message: string, type: NotificationType = 'info', duration?: number): MatSnackBarRef<SnackbarComponent> {
        duration = duration ?? this.defaultConfig.duration;
        const config = { ...this.defaultConfig, duration, data: { message, type } };
        return this.snackBar.openFromComponent(SnackbarComponent, config);
    }

    success(message: string, duration?: number): MatSnackBarRef<SnackbarComponent> {
        return this.open(message, 'success', duration);
    }

    error(message: string, duration?: number): MatSnackBarRef<SnackbarComponent> {
        return this.open(message, 'error', duration);
    }

    info(message: string, duration?: number): MatSnackBarRef<SnackbarComponent> {
        return this.open(message, 'info', duration);
    }

    warning(message: string, duration?: number): MatSnackBarRef<SnackbarComponent> {
        return this.open(message, 'warning', duration);
    }
}
