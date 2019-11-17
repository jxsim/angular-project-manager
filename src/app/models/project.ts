import User from './user';

export default class Project {
  id: string;
  projectDescription: string;
  priority: number;
  startDate: string;
  endDate: string;
  isCompleted: boolean;
  manager: User | string;
}
