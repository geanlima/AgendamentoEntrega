import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
  transform<T>(value: T[], propName: string): T[] {
    if (!value) return [];

    const prop = propName as keyof T;
    return value.sort((a: T, b: T) => {
      return +(a[prop] > b[prop]) || +(a[prop] === b[prop]) - 1;
    });
  }
}
