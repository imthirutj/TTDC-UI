import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthName'
})
export class MonthNamePipe implements PipeTransform {

  private monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  transform(value: number): string {
    if (value < 1 || value > 12) {
      return 'Invalid month';
    }
    return this.monthNames[value - 1];
  }

}