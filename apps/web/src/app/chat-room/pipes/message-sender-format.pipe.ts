import { inject, Pipe, PipeTransform } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
    name: 'messageSenderFormat'
})
export class MessageSenderFormatPipe implements PipeTransform {

    private readonly AuthenticationService = inject(AuthenticationService);
    private readonly translateService = inject(TranslateService);

    transform(sender: string): string {
        return sender === this.AuthenticationService.currentUserId ? this.translateService.instant('chat.you') : sender;
    }
}