import {Component, OnChanges, OnInit, ViewChild} from '@angular/core';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {merge, Observable, Subject} from 'rxjs';
import Project from '../models/project';
import {FormBuilder} from '@angular/forms';
import {ProjectService} from '../services/project.service';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  projects: Project[];
  search = '';
  projectToUpdate: Project;
  sortEvent: string;

  constructor(private fb: FormBuilder, private projectService: ProjectService) {}

  ngOnInit() {
    this.getProjects();
  }

  onDataEvent(dataEvent) {
    const { action, data } = dataEvent;
    if (action === 'create') {
      this.projects = [...this.projects, data];
    } else if (action === 'update') {
      const project = this.projects.find(p => p.id === data.id);
      Object.assign(project, data);
    }
  }

  getProjects(): void {
    this.projectService.getProjects().subscribe(resp => {
      if (resp) {
        this.projects = resp['data'].map(t => {
          return { id: t.id, ...t.attributes } as Project;
        });
      }
    });
  }

  onEdit(id) {
    window.scrollTo(0, 0);
    this.projectToUpdate = Object.assign({}, this.projects.find(p => p.id === id));
  }

  onSort(sortEvent) {
    this.sortEvent = sortEvent;
  }

  searchProject(text$: Observable<string>) {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.projects : this.projects.filter(project => project.projectDescription.includes(term)))
    ));
  }

  searchProjectFormatter = (result: Project) => result.projectDescription;
}
