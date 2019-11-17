import { Pipe, PipeTransform } from '@angular/core';
import {SORTABLES_EVENTS} from '../helpers/sort-helper';
import User from '../models/user';

@Pipe({ name: 'sortUser' })
export class SortUserPipe implements PipeTransform {
  transform(list: User[], sortEvent: string) {
    if (sortEvent === undefined) {
      return list;
    }
    return list && list.sort(SORTABLES_EVENTS['user'][sortEvent]);
  }
}
