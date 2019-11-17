import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import Task from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private taskUrl = 'http://localhost:3000/tasks';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.taskUrl)
      .pipe(catchError(this.handleError<Task[]>('getTasks', [])));
  }

  get(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.taskUrl}/${id}`)
      .pipe(catchError(this.handleError<Task>('getTask')));
  }

  create(task: Task): Observable<Task> {
    return this.http.post<Task>(this.taskUrl, task, this.httpOptions)
      .pipe(catchError(this.handleError<Task>('create')));
  }

  update(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.taskUrl}/${task.id}`, task, this.httpOptions)
      .pipe(catchError(this.handleError<Task>('updateTask')));
  }

  end(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.taskUrl}/${task.id}/end`, this.httpOptions)
      .pipe(catchError(this.handleError<Task>('endTask')));
  }

  delete(task: Task): Observable<Task> {
    return this.http.delete<Task>(`${this.taskUrl}/${task.id}`, this.httpOptions)
      .pipe(catchError(this.handleError<Task>('deleteTask')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      return of(result as T);
    };
  }
}
