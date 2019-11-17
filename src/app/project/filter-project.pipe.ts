import { Pipe, PipeTransform } from '@angular/core';
import { filterPredicate} from '../helpers/filter-helper';
import Project from '../models/project';

@Pipe({ name: 'filterProject' })
export class FilterProjectPipe implements PipeTransform {
  transform(list: Project[], filterEvent: string, search: string) {
    if (search === undefined) {
      return list;
    }
    return list && list.filter(filterPredicate(filterEvent, search));
  }
}
