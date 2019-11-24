import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable()
export class MockProjectService {
  PROJECTS = { data: [
      {
        type: 'tasks',
        attributes: {
          projectDescription: 'p1',
          priority: 7,
          startDate: '2019-11-23T00:00:00.000Z',
          endDate: '2019-11-24T00:00:00.000Z',
          isCompleted: true,
          taskCount: 2,
          manager: [
            {id: '5dd9132d27034247641d1c83', isDeleted: false, firstName: 'u3', lastName: 'u3', employeeId: '3', V: 0}
          ]
        }
      },
      {
        type: 'tasks',
        attributes: {
          projectDescription: 'p2',
          priority: 16,
          startDate: '2019-11-06T16:00:00.000Z',
          endDate: '2019-12-06T16:00:00.000Z',
          isCompleted: false,
          taskCount: 1,
          manager: [
            {
              Id: '5dd9132d27034247641d1c83',
              isDeleted: false,
              firstName: 'u3',
              lastName: 'u3',
              employeeId: 3,
              V: 0
            }
          ]
        }
      }
  ]};

  getAll(): Observable<any> {
    return of(this.PROJECTS);
  }
}
