import { Pipe, PipeTransform } from '@angular/core';
import { filterPredicate} from '../helpers/filter-helper';
import User from '../models/user';

@Pipe({ name: 'filterUser' })
export class FilterUserPipe implements PipeTransform {
  transform(list: User[], filterEvent: string, search: string) {
    if (search === undefined) {
      return list;
    }

    return list && list.filter(filterPredicate(filterEvent, search));
  }
}
