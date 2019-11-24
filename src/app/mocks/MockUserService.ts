import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable()
export class MockUserService {
  USERS = {
    data: [
      {
        type: 'users',
        id: '5dd9130c27034247641d1c82',
        attributes: {
          firstName: 'u1',
          lastName: 'u2',
          employeeId: 2
        }
      },
      {
        type: 'users',
        id: '5dd9132d27034247641d1c83',
        attributes: {
          firstName: 'u3',
          lastName: 'u3',
          employeeId: 3
        }
      }
    ]
  };

  getAll(): Observable<any> {
    return of(this.USERS);
  }
}
