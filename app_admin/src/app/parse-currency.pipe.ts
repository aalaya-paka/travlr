import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseCurrency',
  standalone: true
})
export class ParseCurrencyPipe implements PipeTransform {

  transform(value: string | number | null | undefined): number {
    if (value == null) return 0;
    if (typeof value === 'number') return value;
    const num = parseInt(String(value).replace(/[$,]/g, ''), 10);
    return isNaN(num) ? 0 : num;
  }

}
