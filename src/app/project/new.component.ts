import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Project from '../models/project';
import {FormBaseComponent} from '../form-base.component';
import {ProjectService} from '../services/project.service';
import {API} from '../helpers/api-helper';
import {parseNgbDate} from '../helpers/date-helper';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import User from '../models/user';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-project-new',
  templateUrl: './new.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectNewComponent extends FormBaseComponent implements OnInit, OnChanges {
  users: User[];
  form: FormGroup = this.fb.group({
    id: [''],
    projectDescription: ['', Validators.required],
    priority: [0],
    startDate: [null, Validators.required],
    endDate: [null, Validators.required],
    startEndDateCheck: [true],
    manager: ['', Validators.required],
  });
  editMode = false;
  selectedUser: string;
  searchUser: string;
  defaultValues = {
    priority: 0,
    startEndDateCheck: true
  };

  @Output() dataEvent = new EventEmitter();
  @Input() projectToUpdate: Project;

  constructor(private fb: FormBuilder,
              private projectService: ProjectService,
              private userService: UserService,
              private modalService: NgbModal) {
    super();
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

  onSearchUser(userModal) {
    if (this.form.value.manager) {
      this.selectedUser = this.form.value.manager.id || this.form.value.manager._id;
    }
    this.modalType = 'manager';
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
    this.form.get('manager').markAsDirty();

    const callback = () => {
      if (this.modalType === 'manager') {
        const manager = this.users.find(u => u.id === this.selectedUser);
        this.form.patchValue({ manager });
      }
    };

    this.openModal(this.modalService, content, callback);
  }
}
