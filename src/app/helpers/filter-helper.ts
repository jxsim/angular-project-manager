import Project from '../models/project';
import User from '../models/user';
import Task from '../models/task';

const filterByProjectDescription = (project: Project, search: string) => {
  return !!search ? project.projectDescription.includes(search) : true;
};

const filterByUserName = (user: User, search: string) => {
  return !!search ? (user.firstName.includes(search) || user.lastName.includes(search)) : true;
};

const filterTaskByProject = (task: Task, project: string) => {
  if (!project) {
    return true;
  }
  return task.project ? (task.project['id'] === project || task.project['_id'] === project) : false;
};


const FILTERS = {
  projectDescription: filterByProjectDescription,
  userName: filterByUserName,
  taskByProject: filterTaskByProject
};

export const filterPredicate = (filter, search) => t => FILTERS[filter](t, search);

