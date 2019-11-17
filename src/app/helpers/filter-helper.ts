import {parseNgbDate} from './date-helper';
import Project from '../models/project';
import User from '../models/user';

const filterByProjectDescription = (project: Project, search: string) => {
  return !!search ? project.projectDescription.includes(search) : true;
};

const filterByUserName = (user: User, search: string) => {
  return !!search ? (user.firstName.includes(search) || user.lastName.includes(search)) : true;
};

const filterByStartDate = (task, startDate) => {
  if (!startDate || typeof startDate !== 'object') {
    return true;
  }
  return parseNgbDate(task.startDate).equals(startDate) || parseNgbDate(task.startDate).after(startDate);
};

const filterByEndDate = (task, endDate) => {
  if (!endDate || typeof endDate !== 'object') {
    return true;
  }
  return parseNgbDate(task.endDate).equals(endDate) || parseNgbDate(task.endDate).before(endDate);
};

const filterByTaskDescription = (task, desc) => {
  if (!desc) {
    return true;
  }
  return ~task.taskDescription.indexOf(desc);
};

const filterByPriorityFrom = (task, priorityFrom) => {
  if (priorityFrom === undefined || priorityFrom === null || priorityFrom === '') {
    return true;
  }
  return priorityFrom <= task.priority;
};

const filterByPriorityTo = (task, priorityTo) => {
  if (priorityTo === undefined || priorityTo === null || priorityTo === '') {
    return true;
  }
  return task.priority <= priorityTo;
};

const filterByParentTask = (task, parentTask) => {
  if (!parentTask || typeof parentTask !== 'object') {
    return true;
  }

  return (task.parentTask && task.parentTask._id) === parentTask.id;
};


const FILTERS = {
  projectDescription: filterByProjectDescription,
  userName: filterByUserName
};

export const filterPredicate = (filter, search) => t => FILTERS[filter](t, search);

