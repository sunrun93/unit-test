import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class FormComponent {
  formGroup: FormGroup;

  constructor(fb: FormBuilder){
    // 初始化一个formgroup,将name设为required
    this.formGroup = fb.group({
      name: ['', Validators.required],
      email: [''],
    });

  }
}
