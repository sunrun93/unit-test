import { Pipe, PipeTransform } from '@angular/core';

export class FormatPipe implements PipeTransform{
  transform(value: number, args?: any){
    if (!value) {
      return '';
    }
    const limit = args || 5;
    return (value.toString().length <= limit) ? value : value.toString().substr(0, limit)+ '...';
  }
}
