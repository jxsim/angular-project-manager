import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import Project from '../models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectUrl = 'http://localhost:3000/projects';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getAll(): Observable<Project[]> {
    return this.http.get<Project[]>(this.projectUrl)
      .pipe(catchError(this.handleError<Project[]>('getProjects', [])));
  }

  get(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.projectUrl}/${id}`)
      .pipe(catchError(this.handleError<Project>('getProject')));
  }

  create(project: Project): Observable<Project> {
    return this.http.post<Project>(this.projectUrl, project, this.httpOptions)
      .pipe(catchError(this.handleError<Project>('createProject')));
  }

  update(project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.projectUrl}/${project.id}`, project, this.httpOptions)
      .pipe(catchError(this.handleError<Project>('updateProject')));
  }

  end(project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.projectUrl}/${project.id}/end`, project, this.httpOptions)
      .pipe(catchError(this.handleError<Project>('endProject')));
  }

  delete(project: Project): Observable<Project> {
    return this.http.delete<Project>(`${this.projectUrl}/${project.id}`, this.httpOptions)
      .pipe(catchError(this.handleError<Project>('deleteProject')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      return of(result as T);
    };
  }
}
