import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'quoting'})
export class QuotingPipe implements PipeTransform {
  transform(value: string) {
    return `"${value}"`;
  }
}