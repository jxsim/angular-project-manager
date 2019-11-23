import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {API} from '../helpers/api-helper';
import Task from '../models/task';
import {TaskService} from '../services/task.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ProjectService} from '../services/project.service';
import Project from '../models/project';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBaseComponent} from '../form-base.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent extends FormBaseComponent implements OnInit {
  tasks: Task[];
  projects: Project[];
  search = '';
  selectedProject: string;
  searchProject: string;
  modalType: string;
  closeResult: string;
  projectToFilter: Project;

  constructor(private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private taskService: TaskService,
              private projectService: ProjectService,
              private modalService: NgbModal) {
    super();
  }

  ngOnInit() {
    this.getTasks();
    this.getProjects();
  }

  getTasks(): void {
    const cb = resp => {
      if (resp) {
        this.tasks = resp.data.map(t => {
          return { id: t.id, ...t.attributes } as Task;
        });
      }
    };
    API.handleGetAll(this.taskService, cb);
  }

  getProjects() {
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
    this.router.navigate(['tasks', id, 'edit']);
  }

  onEndTask(id) {
    const data = { id, status: 'ended' };
    const cb = response => {
      const updatedTask = { id: response.data.id, ...response.data.attributes } as Task;
      const task = this.tasks.find(p => p.id === data.id);
      Object.assign(task, updatedTask);
    };
    API.handleEnd(this.taskService, data, cb);
  }

  onSearchProject(projectModal) {
    this.modalType = 'project';
    this.open(projectModal);
  }

  onSelectProject(projectId) {
    if (this.selectedProject === projectId) {
      this.selectedProject = null;
    } else {
      this.selectedProject = projectId;
    }
  }

  open(content) {
    const callback = () => {
      if (this.modalType === 'project') {
        return this.projectToFilter = this.projects.find(p => p.id === this.selectedProject);
      }
      return;
    };
    this.openModal(this.modalService, content, callback);
  }
}
