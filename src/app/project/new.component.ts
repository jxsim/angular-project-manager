import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Project from '../models/project';
import { FormBaseComponent } from '../form-base.component';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import {ProjectService} from '../services/project.service';
import { API } from '../helpers/api-helper';
import {parseDate} from '../helpers/date-helper';

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
    priority: [0, Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    manager: [''],
  });
  startDate: string;
  endDate: string;
  editMode = false;


  @Output() dataEvent = new EventEmitter();
  @Input() projectToUpdate: Project;

  constructor(private fb: FormBuilder, private projectService: ProjectService) {
    super();
  }

  onSubmit() {
    this.editMode ? this.onUpdate() : this.onCreate();
  }

  onCreate() {
    const { projectDescription, priority } = this.form.value;
    const project = { projectDescription, priority, startDate: this.startDate, endDate: this.endDate } as Project;
    const cb = response => {
      const createdProject = { id: response["data"].id, ...response["data"].attributes } as Project;
      this.dataEvent.emit({ action: 'create', data: createdProject });
    };
    API.handleCreate(this.projectService, project, cb);
  }

  onUpdate() {
    const { id, projectDescription, priority } = this.form.value;
    const project = { id, projectDescription, priority, startDate: this.startDate, endDate: this.endDate } as Project;
    const cb = response => {
      const createdProject = { id: response["data"].id, ...response["data"].attributes } as Project;
      this.dataEvent.emit({ action: 'update', data: createdProject });
    };
    API.handleUpdate(this.projectService, project, cb);
  }

  onUpdateMode(editMode) {
    this.editMode = editMode;
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectToUpdate'] && changes['projectToUpdate']['currentValue']) {
      this.editMode = true;
      const { id, projectDescription, priority, startDate, endDate } = this.projectToUpdate;
      this.form.patchValue({ id, projectDescription, priority, startDate: parseDate(startDate), endDate: parseDate(endDate) });
      this.startDate = startDate;
      this.endDate = endDate;
    }
  }
}
