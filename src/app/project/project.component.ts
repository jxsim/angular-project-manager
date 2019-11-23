import {Component, OnInit} from '@angular/core';
import Project from '../models/project';
import {FormBuilder} from '@angular/forms';
import {ProjectService} from '../services/project.service';
import {API} from '../helpers/api-helper';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  projects: Project[];
  projectToUpdate: Project;
  sortEvent: string;
  search: string;

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
    const cb = resp => {
      if (resp) {
        this.projects = resp.data.map(t => {
          return { id: t.id, ...t.attributes } as Project;
        });
      }
    };
    API.handleGetAll(this.projectService, cb);
  }

  onEdit(id) {
    window.scrollTo(0, 0);
    this.projectToUpdate = Object.assign({}, this.projects.find(p => p.id === id));
  }

  onSuspend(id) {
    const data = { id, isCompleted: true };
    const cb = response => {
      const updatedProject = { id: response.data.id, ...response.data.attributes } as Project;
      const project = this.projects.find(p => p.id === data.id);
      Object.assign(project, updatedProject);
    };
    API.handleEnd(this.projectService, data, cb);
  }

  onSort(sortEvent) {
    this.sortEvent = sortEvent;
  }
}
