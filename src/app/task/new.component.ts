import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Task from '../models/task';
import { FormBaseComponent } from '../form-base.component';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import { API } from '../helpers/api-helper';
import {DATES, formatDate, parseNgbDate} from '../helpers/date-helper';
import {TaskService} from '../services/task.service';
import {ModalDismissReasons, NgbModal, NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {merge, Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';
import User from '../models/user';
import Project from '../models/project';
import {ProjectService} from '../services/project.service';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-task-new',
  templateUrl: './new.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskNewComponent extends FormBaseComponent implements OnInit {
  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  faCalendar = faCalendarAlt;
  projects: Project[];
  tasks: Task[];
  users: User[];
  form: FormGroup = this.fb.group({
    id: [''],
    taskDescription: ['', Validators.required],
    priority: [0],
    startDate: [null, { disabled: true }],
    endDate: [null, { disabled: true }],
    isParent: [false],
    parentTask: [''],
    project: ['', Validators.required],
    user: [''],
  });
  startDate: string = null;
  endDate: string = null;
  successMsg = '';
  closeResult: string;
  searchUser: string;
  searchProject: string;
  selectedUser: string;
  selectedProject: string;
  modalType: string;

  @Output() dataEvent = new EventEmitter();
  @Input() taskToUpdate: Task;

  constructor(private fb: FormBuilder,
              private taskService: TaskService,
              private projectService: ProjectService,
              private userService: UserService,
              private modalService: NgbModal) {
    super();
  }

  test() {
    console.log('form', this.form.value);
    console.log('sear', this.searchUser);
  }

  onSubmit() {
    if (this.form.value.isParent) {
      this.clearNonParentTaskFields();
    }
    this.onCreate();
  }

  onCreate() {
    const { taskDescription, priority, parentTask, project, user, isParent} = this.form.value;
    const task = { taskDescription, priority, isParent, project: project && project.id,
      user: user && user.id, parentTask: parentTask && parentTask.id, startDate: this.startDate, endDate: this.endDate } as Task;
    const cb = response => {
      console.log('what is res', response);
      const createdTask = { id: response["data"].id, ...response["data"].attributes } as Task;
      this.dataEvent.emit({ action: 'create', data: createdTask });
      this.showSuccessMessage('Successfully created the task!');
    };
    API.handleCreate(this.taskService, task, cb);
  }

  onUpdate() {
    const { id, taskDescription, priority } = this.form.value;
    const task = { id, taskDescription, priority, startDate: this.startDate, endDate: this.endDate } as Task;
    const cb = response => {
      const createdTask = { id: response["data"].id, ...response["data"].attributes } as Task;
      this.dataEvent.emit({ action: 'update', data: createdTask });
      this.showSuccessMessage('Successfully updated the task!');
    };
    API.handleUpdate(this.taskService, task, cb);
  }

  showSuccessMessage(message: string) {
    this.successMsg = message;
    setInterval(() => this.successMsg = '', 5000);
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

  setDefaultDateFields() {
    this.form.patchValue({ startDate: DATES.defaultStartDate, endDate: DATES.defaultEndDate });
    this.startDate = formatDate(DATES.defaultStartDate);
    this.endDate = formatDate(DATES.defaultEndDate);
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
      this.selectedUser = this.form.value.user.id;
    }
    this.modalType = 'user';
    this.open(userModal);
  }

  onSearchProject(projectModal) {
    if (this.form.value.project) {
      this.selectedProject = this.form.value.project.id;
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
    console.log('what is selected', this.selectedUser);
  }

  onSelectProject(projectId) {
    if (this.selectedProject === projectId) {
      this.selectedProject = null;
    } else {
      this.selectedProject = projectId;
    }
    console.log('what is selected', this.selectedUser);
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (this.modalType === 'user') {
        const user = this.users.find(u => u.id === this.selectedUser);
        this.form.patchValue({ user });
      } else if (this.modalType === 'project') {
        const project = this.projects.find(p => p.id === this.selectedProject);
        this.form.patchValue({ project });
      }
      console.log('result', this.closeResult);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

      console.log('result', this.closeResult);
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
