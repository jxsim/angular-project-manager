import { Component, OnInit } from '@angular/core';
import { fetchFieldError } from './helpers/errors-helper';
import {formatDate} from './helpers/date-helper';

@Component({
  selector: 'app-base',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class FormBaseComponent implements OnInit {
  form: any;

  ngOnInit(): void {
  }

  onError(fieldName) {
    return fetchFieldError(this.form, fieldName);
  }

  onDateSelect(event, field) {
    this[field] = formatDate(event);
  }

  onReset() {
    this.form.reset();
  }
}
