import * as moment from 'moment';
import {NgbCalendarGregorian, NgbDate, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

const ngbCalendar = new NgbCalendarGregorian();

export const DATES = {
  defaultStartDate: ngbCalendar.getToday(),
  defaultEndDate: ngbCalendar.getNext(ngbCalendar.getToday())
}

export function formatDate(date: NgbDateStruct) {
  return `${date.year}-${date.month}-${date.day}`;
}

export function parseNgbDate(date) {
  const momentDate = moment(date).toObject();
  return new NgbDate(momentDate.years, momentDate.months + 1, momentDate.date);
}
