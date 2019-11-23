import { Pipe, PipeTransform } from '@angular/core';
import { filterPredicate} from '../helpers/filter-helper';
import Task from '../models/task';

@Pipe({ name: 'filterTask' })
export class FilterTaskPipe implements PipeTransform {
  transform(list: Task[], filterEvent: string, search: string) {
    if (search === undefined) {
      return list;
    }

    return list && list.filter(filterPredicate(filterEvent, search));
  }
}
