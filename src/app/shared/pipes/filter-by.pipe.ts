import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBy'
})
export class FilterByPipe implements PipeTransform {
  transform<T>(list: T[], propNames: string[], value: string): T[] {
    if (!list) return [];

    let filteredList: T[] = [];

    propNames.forEach((propName) => {
      const prop = propName as keyof T;
      filteredList = list.filter(item =>
        item[prop] === value
      );
    });

    return filteredList;
  }
}
