import {FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';

export const dateRequiredValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const parent = control.parent;
  if (!!parent) {
    return parent.value.startEndDateCheck ? Validators.required : null;
  }
  return null;
};
