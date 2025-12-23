import { inject, Pipe, PipeTransform } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';

@Pipe({
    name: 'messageSenderFormat'
})
export class MessageSenderFormatPipe implements PipeTransform {

    private readonly AuthenticationService = inject(AuthenticationService);

    transform(sender: string): string {
        return sender === this.AuthenticationService.currentUserId ? 'You' : sender;
    }
}