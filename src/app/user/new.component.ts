import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { FormBaseComponent } from '../form-base.component';
import { API } from '../helpers/api-helper';
import User from '../models/user';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-user-new',
  templateUrl: './new.component.html',
  styleUrls: ['./user.component.css']
})
export class UserNewComponent extends FormBaseComponent implements OnInit, OnChanges {
  users: User[];
  form: FormGroup = this.fb.group({
    id: [''],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    employeeId: ['', Validators.required],
  });
  editMode = false;
  successMsg = '';

  @Output() dataEvent = new EventEmitter();
  @Input() userToUpdate: User;

  constructor(private fb: FormBuilder, private userService: UserService) {
    super();
  }

  onSubmit() {
    this.editMode ? this.onUpdate() : this.onCreate();
  }

  onCreate() {
    const { firstName, lastName, employeeId } = this.form.value;
    const user = { firstName, lastName, employeeId } as User;
    const cb = response => {
      const createdUser = { id: response["data"].id, ...response["data"].attributes } as User;
      this.dataEvent.emit({ action: 'create', data: createdUser });
      this.showSuccessMessage('Successfully created the user!');
    };
    API.handleCreate(this.userService, user, cb);
  }

  onUpdate() {
    const { id, firstName, lastName, employeeId } = this.form.value;
    const user = { id, firstName, lastName, employeeId } as User;
    const cb = response => {
      const updatedUser = { id: response["data"].id, ...response["data"].attributes } as User;
      this.dataEvent.emit({ action: 'update', data: updatedUser });
      this.showSuccessMessage('Successfully updated the user!');
    };
    API.handleUpdate(this.userService, user, cb);
  }

  onUpdateMode(editMode) {
    this.editMode = editMode;
  }

  showSuccessMessage(message: string) {
    this.successMsg = message;
    setInterval(() => this.successMsg = '', 5000);
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userToUpdate'] && changes['userToUpdate']['currentValue']) {
      this.editMode = true;
      const { id, firstName, lastName, employeeId } = this.userToUpdate;
      this.form.patchValue({ id, firstName, lastName, employeeId });
    }
  }
}
