import { Pipe, PipeTransform } from '@angular/core';
import Project from '../models/project';
import {SORTABLES} from '../helpers/sort-helper';

@Pipe({ name: 'sortProject' })
export class ProjectSortPipe implements PipeTransform {
  transform(projects: Project[], sortEvent: string) {
    if (sortEvent === undefined) {
      return projects;
    }
    return projects && projects.sort(SORTABLES[sortEvent]);
  }
}
