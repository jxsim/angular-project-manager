import Project from './project';
import User from './user';

export default class Task {
  id: string;
  taskDescription: string;
  priority: number;
  startDate: string;
  endDate: string;
  status: string;
  isParent: boolean;
  parentTask: Task | string;
  project: Project | string;
  user: User | string;
}
