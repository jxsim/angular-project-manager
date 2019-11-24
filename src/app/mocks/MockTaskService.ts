import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable()
export class MockTaskService {
  TASKS = {
    data: [
      {
        type: 'tasks',
        id: '5dd9142b27034247641d1c86',
        attributes: {
          taskDescription: 't1',
          priority: 6,
          startDate: '2019-11-23T00:00:00.000Z',
          endDate: '2019-11-24T00:00:00.000Z',
          status: 'ongoing',
          isParent: false,
          parentTask: {
            isParent: true,
            _id: '5dd9286798d4f62ef8c73e24',
            taskDescription: 't2',
            project: '5dd9137927034247641d1c85',
            user: '5dd9130c27034247641d1c82',
            status: 'ended',
            __v: 0
          },
          project: {
            isCompleted: true,
            _id: '5dd9135c27034247641d1c84',
            projectDescription: 'p1',
            priority: 7,
            startDate: '2019-11-23T00:00:00.000Z',
            endDate: '2019-11-24T00:00:00.000Z',
            manager: '5dd9132d27034247641d1c83',
            __v: 0
          },
          user: {
            isDeleted: false,
            _id: '5dd9130c27034247641d1c82',
            firstName: 'u1',
            lastName: 'u2',
            employeeId: 2,
            __v: 0
          }
        }
      },
      {
        type: 'tasks',
        id: '5dd9286798d4f62ef8c73e24',
        attributes: {
          taskDescription: 't2',
          status: 'ended',
          isParent: true,
          project: {
            isCompleted: false,
            _id: '5dd9137927034247641d1c85',
            projectDescription: 'p2',
            priority: 16,
            startDate: '2019-11-06T16:00:00.000Z',
            endDate: '2019-12-06T16:00:00.000Z',
            manager: '5dd9132d27034247641d1c83',
            __v: 0
          },
          user: {
            isDeleted: false,
            _id: '5dd9130c27034247641d1c82',
            firstName: 'u1',
            lastName: 'u2',
            employeeId: 2,
            __v: 0
          }
        }
      },
      {
        type: 'tasks',
        id: '5dd93ca1d2eb6b44186f8900',
        attributes: {
          taskDescription: 't44',
          priority: 0,
          startDate: '2019-11-23T00:00:00.000Z',
          endDate: '2019-11-24T00:00:00.000Z',
          status: 'ongoing',
          isParent: false,
          parentTask: {
            isParent: true,
            _id: '5dd9286798d4f62ef8c73e24',
            taskDescription: 't2',
            project: '5dd9137927034247641d1c85',
            user: '5dd9130c27034247641d1c82',
            status: 'ended',
            __v: 0
          },
          project: {
            isCompleted: true,
            _id: '5dd9135c27034247641d1c84',
            projectDescription: 'p1',
            priority: 7,
            startDate: '2019-11-23T00:00:00.000Z',
            endDate: '2019-11-24T00:00:00.000Z',
            manager: '5dd9132d27034247641d1c83',
            __v: 0
          },
          user: {
            isDeleted: false,
            _id: '5dd9132d27034247641d1c83',
            firstName: 'u3',
            lastName: 'u3',
            employeeId: 3,
            __v: 0
          }
        }
      }
    ]
  };

  getAll(): Observable<any> {
    return of(this.TASKS);
  }
}
