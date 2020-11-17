import {AbstractControl, FormGroup, ValidatorFn} from '@angular/forms';

export class CustomValidators {
  static innerPropertyRequired(key): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } =>
      control.value[key] ? null : {'innerPropertyRequired': true};
  }

  static matchingFields(controlName1: string, controlName2: string, errorFieldName: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const control1 = group.controls[controlName1];
      const control2 = group.controls[controlName2];
      if (control1.value !== control2.value) {
        return {
          [errorFieldName]: true
        };
      }
      return {};
    };
  }

  static lessThan<T>(comparedValue: T): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      return (control.value < comparedValue) ? null : {'lessThan': true};
    };
  }

  static greatThan<T>(comparedValue: T) {
    return (control: AbstractControl): { [key: string]: any } => {
      return (control.value > comparedValue) ? null : {'greatThan': true};
    };
  }

  static noWhitespaceRequired(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : {'whitespace': 'value is only whitespace'};
    };
  }
}
