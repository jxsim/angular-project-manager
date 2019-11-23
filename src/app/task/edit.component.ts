import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Task from '../models/task';
import {FormBaseComponent} from '../form-base.component';
import {API} from '../helpers/api-helper';
import {parseNgbDate} from '../helpers/date-helper';
import {TaskService} from '../services/task.service';
import {NgbModal, NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {merge, Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';
import User from '../models/user';
import Project from '../models/project';
import {ProjectService} from '../services/project.service';
import {UserService} from '../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-task-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskEditComponent extends FormBaseComponent implements OnInit {
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
    parentTask: [''],
    user: [''],
  });
  searchUser: string;
  selectedUser: string;
  task: Task;
  isParent: boolean;
  projectDescription: string;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private taskService: TaskService,
              private projectService: ProjectService,
              private userService: UserService,
              private modalService: NgbModal) {
    super();
  }

  onSubmit() {
    console.log('w', this.form.value);
    this.onUpdate();
  }

  onReset() {
    super.onReset();
    this.setDefaultDateFields();
  }

  onUpdate() {
    let taskToUpdate;
    const { id, taskDescription, priority, parentTask, user } = this.form.value;
    if (this.isParent) {
      taskToUpdate = {
        id, taskDescription, priority, user: user && user.id
      } as Task;
    } else {
      taskToUpdate = {
        id, taskDescription, priority, user: user && user.id,
        parentTask: parentTask && parentTask.id, startDate: this.startDate, endDate: this.endDate
      } as Task;
    }
    const cb = response => {
      console.log('what is resp', response);
      this.router.navigate(['tasks']);
    };
    API.handleUpdate(this.taskService, taskToUpdate, cb);
  }

  ngOnInit() {
    this.route.params.subscribe(routeParams => this.getTask(routeParams.id));
    this.getTasks();
    this.getProjects();
    this.getUsers();
  }

  getTask(taskId: string): void {
    const cb = resp => {
      if (resp) {
        const data = resp.data;
        this.task = { id: data.id, ... data.attributes } as Task;
        const { id, taskDescription, isParent, priority, parentTask, startDate, endDate, user} = this.task;
        this.defaultValues = { ...this.task, startDate: parseNgbDate(startDate), endDate: parseNgbDate(endDate) };
        const project = this.task.project as Project;
        this.isParent = isParent;

        const controlsToUpdate = [this.form.get('startDate'), this.form.get('endDate'), this.form.get('parentTask'),
          this.form.get('priority')];
        if (isParent) {
          this.form.patchValue({ id, taskDescription, user });
          controlsToUpdate.forEach(control => control.disable());
        } else {
          this.form.patchValue({ id, taskDescription, priority, parentTask,
            startDate: parseNgbDate(startDate), endDate: parseNgbDate(endDate), user });
          this.startDate = startDate;
          this.endDate = endDate;
          controlsToUpdate.forEach(control => control.enable());
        }
        this.projectDescription = project.projectDescription;
      }
    };
    API.handleGet(this.taskService, taskId, cb);
  }

  getTasks(): void {
    const cb = resp => {
      if (resp) {
        this.tasks = resp.data.filter(t => t.attributes.isParent).map(t => {
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

  getUsers(): void {
    const cb = (resp) => {
      this.users = resp.data.map(t => {
        return { id: t.id, ...t.attributes } as User;
      });
    };
    API.handleGetAll(this.userService, cb);
  }

  searchParentTask = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.tasks : this.tasks.filter(t => {
          return t.taskDescription.includes(term);
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

  onSelectUser(userId) {
    if (this.selectedUser === userId) {
      this.selectedUser = null;
    } else {
      this.selectedUser = userId;
    }
  }

  open(content) {
    const callback = () => {
      if (this.modalType === 'user') {
        const user = this.users.find(u => u.id === this.selectedUser);
        console.log('what sae user', user);
        this.form.patchValue({ user });
      }
    };

    this.openModal(this.modalService, content, callback);
  }
}
