import { Pipe, PipeTransform, inject } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'messageTimestampFormat'
})
export class MessageTimestampFormatPipe implements PipeTransform {

  private datePipe = inject(DatePipe);

  transform(timestamp: number | string | Date): string {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return this.datePipe.transform(date, 'HH:mm') ?? '';
    }

    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') ?? '';
  }
}
