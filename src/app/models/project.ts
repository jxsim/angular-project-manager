import User from './user';

export default class Project {
  id: string;
  projectDescription: string;
  priority: number;
  startDate: string;
  endDate: string;
  taskCount: number;
  isCompleted: boolean;
  manager: User | string;
}
