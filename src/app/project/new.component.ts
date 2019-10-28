import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Project from '../models/project';
import { FormBaseComponent } from '../form-base.component';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import {ProjectService} from '../services/project.service';
import { API } from '../helpers/api-helper';
import {DATES, formatDate, parseNgbDate} from '../helpers/date-helper';

@Component({
  selector: 'app-project-new',
  templateUrl: './new.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectNewComponent extends FormBaseComponent implements OnInit, OnChanges {
  faCalendar = faCalendarAlt;
  projects: Project[];
  form: FormGroup = this.fb.group({
    id: [''],
    projectDescription: ['', Validators.required],
    priority: [0],
    startDate: [null, { disabled: true }],
    endDate: [null, { disabled: true }],
    startEndDateCheck: [true],
    manager: [''],
  });
  startDate: string = null;
  endDate: string = null;
  editMode = false;
  successMsg = '';

  @Output() dataEvent = new EventEmitter();
  @Input() projectToUpdate: Project;

  constructor(private fb: FormBuilder, private projectService: ProjectService) {
    super();
  }

  test() {
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log('error', invalid);
    console.log('start', this.startDate);
    console.log('end', this.endDate);
    return invalid;
  }

  onSubmit() {
    if (!this.form.value.startEndDateCheck) {
      this.clearDateFields();
    }
    this.editMode ? this.onUpdate() : this.onCreate();
  }

  onCreate() {
    const { projectDescription, priority } = this.form.value;
    const project = { projectDescription, priority, startDate: this.startDate, endDate: this.endDate } as Project;
    const cb = response => {
      const createdProject = { id: response["data"].id, ...response["data"].attributes } as Project;
      this.dataEvent.emit({ action: 'create', data: createdProject });
      this.showSuccessMessage('Successfully created the project!');
    };
    API.handleCreate(this.projectService, project, cb);
  }

  onUpdate() {
    const { id, projectDescription, priority } = this.form.value;
    const project = { id, projectDescription, priority, startDate: this.startDate, endDate: this.endDate } as Project;
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
    this.setDefaultDateFields();
    this.form.get('startEndDateCheck').valueChanges.subscribe(checked => {
      const controlsToUpdate = [this.form.get('startDate'), this.form.get('endDate')];
      controlsToUpdate.forEach(control => { checked ? control.enable() : control.disable() });
    });
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
      const { id, projectDescription, priority, startDate, endDate } = this.projectToUpdate;
      const hasStartEndDate = startDate || endDate;
      this.form.patchValue({ id, projectDescription, priority, startDate: parseNgbDate(startDate), endDate: parseNgbDate(endDate), startEndDateCheck: hasStartEndDate});
      this.startDate = startDate;
      this.endDate = endDate;
    }
  }
}
