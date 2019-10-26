import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import Project from '../models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectUrl = 'http://localhost:3000/projects';
  private endTaskUrl = 'http://localhost:3000/end_project';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.projectUrl)
      .pipe(catchError(this.handleError<Project[]>('getProjects', [])));
  }

  getProject(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.projectUrl}/${id}`)
      .pipe(catchError(this.handleError<Project>('getProject')));
  }

  create(project: Project): Observable<Project> {
    return this.http.post<Project>(this.projectUrl, project, this.httpOptions)
      .pipe(catchError(this.handleError<Project>('create')));
  }

  update(project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.projectUrl}/${project.id}`, project, this.httpOptions)
      .pipe(catchError(this.handleError<Project>('updateProject')));
  }

  endProject(id: string): Observable<Project> {
    return this.http.put<Project>(`${this.endTaskUrl}/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError<Project>('endProject')));
  }

  deleteProject(project: Project): Observable<Project> {
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
