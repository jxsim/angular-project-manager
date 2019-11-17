import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import User from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl = 'http://localhost:3000/users';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.userUrl)
      .pipe(catchError(this.handleError<User[]>('getAll', [])));
  }

  get(id: string): Observable<User> {
    return this.http.get<User>(`${this.userUrl}/${id}`)
      .pipe(catchError(this.handleError<User>('get')));
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(this.userUrl, user, this.httpOptions)
      .pipe(catchError(this.handleError<User>('create')));
  }

  update(user: User): Observable<User> {
    return this.http.put<User>(`${this.userUrl}/${user.id}`, user, this.httpOptions)
      .pipe(catchError(this.handleError<User>('update')));
  }

  delete(user: User): Observable<User> {
    return this.http.delete<User>(`${this.userUrl}/${user.id}`, this.httpOptions)
      .pipe(catchError(this.handleError<User>('deleteUser')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      return of(result as T);
    };
  }
}
