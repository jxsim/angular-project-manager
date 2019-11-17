import Project from '../models/project';
import {parseNgbDate} from './date-helper';
import User from '../models/user';

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
  if (a.isCompleted) {
    return -1;
  } else if (b.isCompleted) {
    return 1;
  }
  return 0;
};

const sortByFirstName = (a: User, b: User) => {
  if (a.firstName < b.firstName) {
    return -1;
  } else if (a.firstName > b.firstName) {
    return 1;
  } else {
    return 0;
  }
};

const sortByLastName = (a: User, b: User) => {
  if (a.lastName < b.lastName) {
    return -1;
  } else if (a.lastName > b.lastName) {
    return 1;
  } else {
    return 0;
  }
};

const sortByEmployeeId = (a: User, b: User) => {
  console.log('here');
  if (a.employeeId < b.employeeId) {
    return -1;
  } else if (a.employeeId > b.employeeId) {
    return 1;
  } else {
    return 0;
  }
};

export const SORTABLES_EVENTS = {
  project: {
    startDate: sortByStartDate,
    endDate: sortByEndDate,
    priority: sortByPriority,
    completed: sortByCompleted
  },
  user: {
    firstName: sortByFirstName,
    lastName: sortByLastName,
    employeeId: sortByEmployeeId
  }
};
