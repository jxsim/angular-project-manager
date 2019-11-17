import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Project from '../models/project';
import { FormBaseComponent } from '../form-base.component';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import {ProjectService} from '../services/project.service';
import { API } from '../helpers/api-helper';
import {DATES, formatDate, parseNgbDate} from '../helpers/date-helper';
import {merge, Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import User from '../models/user';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-project-new',
  templateUrl: './new.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectNewComponent extends FormBaseComponent implements OnInit, OnChanges {
  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  faCalendar = faCalendarAlt;
  users: User[];
  form: FormGroup = this.fb.group({
    id: [''],
    projectDescription: ['', Validators.required],
    priority: [0],
    startDate: [null, { disabled: true }],
    endDate: [null, { disabled: true }],
    startEndDateCheck: [true],
    manager: ['', Validators.required],
  });
  startDate: string = null;
  endDate: string = null;
  editMode = false;
  successMsg = '';

  @Output() dataEvent = new EventEmitter();
  @Input() projectToUpdate: Project;

  constructor(private fb: FormBuilder, private projectService: ProjectService, private userService: UserService) {
    super();
  }

  test() {
    console.log('form', this.form.value);
  }

  onSubmit() {
    if (!this.form.value.startEndDateCheck) {
      this.clearDateFields();
    }
    this.editMode ? this.onUpdate() : this.onCreate();
  }

  onCreate() {
    const { projectDescription, priority, manager } = this.form.value;
    const project = { projectDescription, priority, startDate: this.startDate, endDate: this.endDate, manager: manager.id } as Project;
    const cb = response => {
      const createdProject = { id: response["data"].id, ...response["data"].attributes } as Project;
      this.dataEvent.emit({ action: 'create', data: createdProject });
      this.showSuccessMessage('Successfully created the project!');
    };
    API.handleCreate(this.projectService, project, cb);
  }

  onUpdate() {
    const { id, projectDescription, priority, manager } = this.form.value;
    const project = { id, projectDescription, priority, startDate: this.startDate, endDate: this.endDate, manager: (manager.id || manager._id) } as Project;
    const cb = response => {
      const createdProject = { id: response["data"].id, ...response["data"].attributes } as Project;
      this.dataEvent.emit({ action: 'update', data: createdProject });
      this.showSuccessMessage('Successfully updated the project!');
    };
    API.handleUpdate(this.projectService, project, cb);
  }

  onUpdateMode(editMode) {
    this.editMode = editMode;
  }
  showSuccessMessage(message: string) {
    this.successMsg = message;
    setInterval(() => this.successMsg = '', 5000);
  }

  ngOnInit() {
    this.getUsers();
    this.setDefaultDateFields();
    this.form.get('startEndDateCheck').valueChanges.subscribe(checked => {
      const controlsToUpdate = [this.form.get('startDate'), this.form.get('endDate')];
      controlsToUpdate.forEach(control => { checked ? control.enable() : control.disable() });
    });
  }

  getUsers() {
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

  clearDateFields() {
    this.form.patchValue({ startDate: '', endDate: '' });
    this.startDate = null;
    this.endDate = null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectToUpdate'] && changes['projectToUpdate']['currentValue']) {
      this.editMode = true;
      const { id, projectDescription, priority, startDate, endDate, manager } = this.projectToUpdate;
      const hasStartEndDate = startDate || endDate;
      this.form.patchValue(
        { id, projectDescription, priority, manager, startDate: parseNgbDate(startDate),
                endDate: parseNgbDate(endDate), startEndDateCheck: hasStartEndDate});
      this.startDate = startDate;
      this.endDate = endDate;
    }
  }

  searchManager = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.users : this.users.filter(user => {
          return user.lastName.includes(term) || user.firstName.includes(term) || (user.firstName + ' ' + user.lastName).includes(term);
        }))
      ));
  };

  searchManagerFormatter = (result: User) => result && (result.firstName + ' ' + result.lastName);
}
