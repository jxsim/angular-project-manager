import { Pipe, PipeTransform } from '@angular/core';

import {parseDate} from '../helpers/date-helper';
import Project from '../models/project';
import {FILTERS} from '../helpers/filter-helper';

@Pipe({ name: 'filterProject' })
export class ProjectFilterPipe implements PipeTransform {
  transform(projects: Project[], search: string) {
    return projects && projects.filter(project => FILTERS.filterByString(project.projectDescription, search));
  }

  filterByStartDate(task, startDate) {
    if (!startDate || typeof startDate !== 'object') {
      return true;
    }
    return parseDate(task.startDate).equals(startDate) || parseDate(task.startDate).after(startDate);
  }

  filterByEndDate(task, endDate) {
    if (!endDate || typeof endDate !== 'object') {
      return true;
    }
    return parseDate(task.endDate).equals(endDate) || parseDate(task.endDate).before(endDate);
  }

  filterByTaskDescription(task, desc) {
    if (!desc) {
      return true;
    }
    return ~task.taskDescription.indexOf(desc);
  }

  filterByPriorityFrom(task, priorityFrom) {
    if (priorityFrom === undefined || priorityFrom === null || priorityFrom === '') {
      return true;
    }
    return priorityFrom <= task.priority;
  }

  filterByPriorityTo(task, priorityTo) {
    if (priorityTo === undefined || priorityTo === null || priorityTo === '') {
      return true;
    }
    return task.priority <= priorityTo;
  }

  filterByParentTask(task, parentTask) {
    if (!parentTask || typeof parentTask !== 'object') {
      return true;
    }

    return (task.parentTask && task.parentTask._id) === parentTask.id;
  }
}
