import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Task from '../models/task';
import {FormBaseComponent} from '../form-base.component';
import {API} from '../helpers/api-helper';
import {TaskService} from '../services/task.service';
import {NgbModal, NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {merge, Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';
import User from '../models/user';
import Project from '../models/project';
import {ProjectService} from '../services/project.service';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-task-new',
  templateUrl: './new.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskNewComponent extends FormBaseComponent implements OnInit {
  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  projects: Project[];
  tasks: Task[];
  users: User[];
  form: FormGroup = this.fb.group({
    id: [''],
    taskDescription: ['', Validators.required],
    priority: [0],
    startDate: [null, Validators.required],
    endDate: [null, Validators.required],
    isParent: [false],
    parentTask: [''],
    project: ['', Validators.required],
    user: ['', Validators.required],
  });
  defaultValues = {
    priority: 0
  };
  searchUser: string;
  searchProject: string;
  selectedUser: string;
  selectedProject: string;

  constructor(private fb: FormBuilder,
              private taskService: TaskService,
              private projectService: ProjectService,
              private router: Router,
              private userService: UserService,
              private modalService: NgbModal) {
    super();
  }

  onSubmit() {
    if (this.form.value.isParent) {
      this.clearNonParentTaskFields();
    }
    this.onCreate();
  }

  onReset() {
    super.onReset();
    this.setDefaultDateFields();
  }

  onCreate() {
    const { taskDescription, priority, parentTask, project, user, isParent} = this.form.value;
    const task = { taskDescription, priority, isParent, project: project && project.id,
      user: user && user.id, parentTask: parentTask && parentTask.id, startDate: this.startDate, endDate: this.endDate } as Task;
    const cb = response => {
      this.showSuccessMessage('Successfully created the task!');
      this.router.navigate(['tasks']);
    };
    API.handleCreate(this.taskService, task, cb);
  }

  ngOnInit() {
    this.getTasks();
    this.getProjects();
    this.getUsers();
    this.setDefaultDateFields();
    this.form.get('isParent').valueChanges.subscribe(checked => {
      const controlsToUpdate = [this.form.get('startDate'), this.form.get('endDate'), this.form.get('parentTask'),
        this.form.get('priority')];
      controlsToUpdate.forEach(control => { checked ? control.disable() : control.enable(); });
    });
  }

  getTasks(): void {
    const cb = resp => {
      if (resp) {
        this.tasks = resp['data'].filter(t => t.attributes["isParent"]).map(t => {
          return { id: t.id, ...t.attributes } as Task;
        });
      }
    };
    API.handleGetAll(this.taskService, cb);
  }

  getProjects() {
    const cb = resp => {
      if (resp) {
        this.projects = resp['data'].map(t => {
          return { id: t.id, ...t.attributes } as Project;
        });
      }
    };
    API.handleGetAll(this.projectService, cb);
  }

  getUsers(): void {
    const cb = (resp) => {
      this.users = resp['data'].map(t => {
        return { id: t.id, ...t.attributes } as User;
      });
    };
    API.handleGetAll(this.userService, cb);
  }

  clearNonParentTaskFields() {
    this.form.patchValue({ startDate: '', endDate: '', priority: '', parentTask: '' });
    this.startDate = null;
    this.endDate = null;
  }

  searchParentTask = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.tasks : this.tasks.filter(task => {
          return task.taskDescription.includes(term);
        }))
      ));
  };

  searchTaskFormatter = (result: Task) => result && result.taskDescription;

  onSearchUser(userModal) {
    if (this.form.value.user) {
      this.selectedUser = this.form.value.user.id || this.form.value.user._id;
    }
    this.modalType = 'user';
    this.open(userModal);
  }

  onSearchProject(projectModal) {
    if (this.form.value.project) {
      this.selectedProject = this.form.value.project.id || this.form.value.project._id;
    }
    this.modalType = 'project';
    this.open(projectModal);
  }

  onSelectUser(userId) {
    if (this.selectedUser === userId) {
      this.selectedUser = null;
    } else {
      this.selectedUser = userId;
    }
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
      if (this.modalType === 'user') {
        const user = this.users.find(u => u.id === this.selectedUser);
        this.form.patchValue({ user });
      } else if (this.modalType === 'project') {
        const project = this.projects.find(p => p.id === this.selectedProject);
        this.form.patchValue({ project });
      }
    };

    this.openModal(this.modalService, content, callback);
  }
}
