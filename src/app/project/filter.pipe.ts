import { Pipe, PipeTransform } from '@angular/core';

import Project from '../models/project';
import { filterPredicate} from '../helpers/filter-helper';

@Pipe({ name: 'filterProject' })
export class ProjectFilterPipe implements PipeTransform {
  transform(projects: Project[], filterEvent: string, ...args) {
    if (filterEvent === undefined) {
      return projects;
    }
    return projects && projects.filter(filterPredicate(filterEvent, ...args));
  }
}
