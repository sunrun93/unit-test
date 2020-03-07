import { FormComponent } from './form.component';
import { FormBuilder } from '@angular/forms';

describe('form', () => {

  let component: FormComponent;

  beforeEach(() => {
    component = new FormComponent(new FormBuilder());
  });

  it('should create the formGroup with 2 fields', () => {
    expect(component.formGroup.contains('name')).toBeTruthy();
    expect(component.formGroup.contains('email')).toBeTruthy();
  });

  it('should make the name control required', () => {
    const control = component.formGroup.get('name');
    control.setValue('');
    expect(control.valid).toBeFalsy();
  });

  it('should make the name control valid if input name', () => {
    const control = component.formGroup.get('name');
    control.setValue('Reina');
    expect(control.valid).toBeTruthy();
  });


});

