import Project from '../models/project';
import {parseNgbDate} from './date-helper';

const sortByStartDate = (a: Project, b: Project) => {
  const startDateA = parseNgbDate(a.startDate);
  const startDateB = parseNgbDate(b.startDate);

  if (startDateA.before(startDateB)) {
    return -1;
  } else if (startDateA.after(startDateB)) {
    return 1;
  } else {
    return 0;
  }
};

const sortByEndDate = (a: Project, b: Project) => {
  const endDateA = parseNgbDate(a.endDate);
  const endDateB = parseNgbDate(b.endDate);

  if (endDateA.before(endDateB)) {
    return -1;
  } else if (endDateA.after(endDateB)) {
    return 1;
  } else {
    return 0;
  }
};

const sortByPriority = (a: Project, b: Project) => {
  return a.priority - b.priority;
};

const sortByCompleted = (a: Project, b: Project) => {
  return a.priority - b.priority;
};

export const SORTABLES = {
  startDate: sortByStartDate,
  endDate: sortByEndDate,
  priority: sortByPriority,
  completed: sortByCompleted
};
