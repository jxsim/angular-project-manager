const FORM_ERROR_MESSAGES = {
  required: 'This field is required.',
  ngbDate: 'Please select a date from the date picker.',
  invalidParentTask: 'Please select a parent task from the predefined list.'
};
const DEFAULT_ERROR_MESSAGE = 'This field is invalid';

export const fetchFieldError = (form, fieldName: string) => {
  const field = form.get(fieldName);
  if ((field.touched || field.dirty) && field.invalid) {

    return fetchErrorMessage(field.errors);
  }

  return null;
};

export const fetchErrorMessage = (errors: object) => {
  let message = '';
  Object.keys(errors).forEach(k => message = FORM_ERROR_MESSAGES[k] || DEFAULT_ERROR_MESSAGE);

  return message;
};
