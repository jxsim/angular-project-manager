import {NgbDate} from '@ng-bootstrap/ng-bootstrap';

export default class Project {
  private _id: string;
  projectDescription: string;
  priority: number;
  startDate: string;
  endDate: string;

  constructor(id: string, projectDescription: string, priority: number, startDate: string, endDate: string) {
    this._id = id;
    this.projectDescription = projectDescription;
    this.priority = priority;
    this.startDate = startDate;
    this.endDate = endDate;
  }


  set id(value: string) {
    this._id = value;
  }
}
