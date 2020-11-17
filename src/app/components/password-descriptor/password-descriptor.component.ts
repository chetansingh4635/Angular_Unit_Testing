import { Component, OnInit, Input, EventEmitter, Output, OnChanges, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'jclt-password-descriptor',
  templateUrl: './password-descriptor.component.html'
})
export class PasswordDescriptorComponent implements OnInit, OnChanges {

  private uclRegex: RegExp = /.*[A-Z].*/;
  private scRegex: RegExp = /^[A-Za-z0-9 ]+$/;
  private lclRegex: RegExp = /.*[a-z].*/;
  private numberRegex: RegExp = /.*[0-9].*/;
  @Input() public value: string;
  @Input() public addCustomClass: Boolean = false;
  @Input() public passwordValue: FormControl;
  public successType = {
    isLength: false,
    isNumber: false,
    isUCLetter: false,
    isLCLetter: false,
    isSCharacter: false,
  }

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.validateError(this.value)
  }

  public validateError(pass) {
    this.successType.isLength = (pass.length >= 10) ? true : false;
    this.successType.isNumber = this.numberRegex.test(pass) ? true : false;
    this.successType.isUCLetter = this.uclRegex.test(pass) ? true : false;
    this.successType.isLCLetter = this.lclRegex.test(pass) ? true : false;
    this.successType.isSCharacter = (pass != '' && !this.scRegex.test(pass)) ? true : false;

    if (!this.successType.isLength || !this.successType.isNumber || !this.successType.isUCLetter || !this.successType.isLCLetter || !this.successType.isSCharacter) {
      this.passwordValue.setErrors({ pattern: true });
    }
    else {
      this.passwordValue.setErrors(null);
    }
  }
}
