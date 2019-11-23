import { Component, OnInit } from '@angular/core';
import { fetchFieldError } from './helpers/errors-helper';
import {DATES, formatDate} from './helpers/date-helper';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {faCalendarAlt} from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-base',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class FormBaseComponent implements OnInit {
  faCalendar = faCalendarAlt;
  form: any;
  defaultValues: object;
  startDate: string;
  endDate: string;
  closeResult: string;
  modalType: string;
  successMsg: string;

  openModal(modalService, content, callback) {
    modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      callback();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

      console.log('result', this.closeResult);
    });
  }

  ngOnInit(): void {
  }

  onError(fieldName) {
    return fetchFieldError(this.form, fieldName);
  }

  onDateSelect(event, field) {
    this[field] = formatDate(event);
  }

  onReset() {
    this.form.reset(this.defaultValues || {});
  }

  setDefaultDateFields() {
    this.form.patchValue({ startDate: DATES.defaultStartDate, endDate: DATES.defaultEndDate });
    this.startDate = formatDate(DATES.defaultStartDate);
    this.endDate = formatDate(DATES.defaultEndDate);
  }

  showSuccessMessage(message: string) {
    this.successMsg = message;
    setInterval(() => this.successMsg = '', 5000);
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
