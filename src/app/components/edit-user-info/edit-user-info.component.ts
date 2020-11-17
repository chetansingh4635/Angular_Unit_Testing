import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Roles } from '../../shared/enums/Roles';
import { ProviderInfoService } from '../../shared/services/provider-info.service';
import { ProviderInfo } from '../../shared/models/ProviderInfo';
import { TypeOfEditProfile } from '../../shared/enums/type-of-edit-profile';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'jclt-edit-user-info',
  templateUrl: './edit-user-info.component.html'
})
export class EditUserInfoComponent implements OnInit, OnDestroy {

  form: FormGroup;

  @Input()
  public inputData: { typeOfEditProfile: TypeOfEditProfile, userId: number, role: Roles, additionalClassOfDialog: string, disable: Boolean };

  @Output()
  public outputData = new EventEmitter<boolean>();
  public userInfoSubscription: Subscription;
  public userInfo: ProviderInfo;
  public impersonationSubscription: Subscription;
  public isImpersonating:Boolean = false;
  public emailPattern = /^[A-Za-z][A-Za-z0-9\.\-\_]*@[A-Za-z0-9\.\-\_]*\.[A-Za-z]{1,}$/;
    
  constructor(private userInfoService: ProviderInfoService, private fb: FormBuilder) {

  }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.pattern(this.emailPattern), Validators.required]]
    });

    this.userInfoSubscription = this.userInfoService.getUserInfo(this.inputData.userId, this.inputData.role).subscribe(
      (data) => {
        this.userInfo = data;
        this.form.controls.email.setValue(this.userInfo.email);
      });
      if(this.inputData.disable){
        this.form.controls.email.disable();
      }
  }

  get email() {
    return this.form.get('email');
  }

  updateEmail(event) {
    if (this.form.invalid) {
      document.querySelector(`.${this.inputData.additionalClassOfDialog} .k-primary`)
        .setAttribute('disabled', '');
    } else {
      this.userInfoService.updateUserInfoEmail(this.form.value.email);
      document.querySelector(`.${this.inputData.additionalClassOfDialog} .k-primary`)
        .removeAttribute('disabled');
    }
  }

  public ngOnDestroy() {
    this.userInfoSubscription.unsubscribe();
  }
}