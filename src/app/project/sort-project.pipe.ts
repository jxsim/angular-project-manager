import { Pipe, PipeTransform } from '@angular/core';
import {SORTABLES_EVENTS} from '../helpers/sort-helper';
import Project from '../models/project';

@Pipe({ name: 'sortProject' })
export class SortProjectPipe implements PipeTransform {
  transform(list: Project[], sortEvent: string) {
    if (sortEvent === undefined) {
      return list;
    }
    return list && list.sort(SORTABLES_EVENTS['project'][sortEvent]);
  }
}
