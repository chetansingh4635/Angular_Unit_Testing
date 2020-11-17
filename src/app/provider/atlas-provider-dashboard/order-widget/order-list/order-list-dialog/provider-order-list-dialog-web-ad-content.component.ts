import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoginService } from '../../../../../shared/services/account/login.service';
import { ProviderInfoService } from '../../../../../shared/services/provider-info.service';
import { ProviderInfo } from '../../../../../shared/models/ProviderInfo';
import { ProviderOrderList } from '../../../../shared/models/provider-order-list';
import { JobOpportunity } from '../../../../../shared/models/job-opportunity';
import { WebAd } from '../../../../shared/models/web-ad';
import { Roles } from '../../../../../shared/enums/Roles';

@Component({
  selector: 'jclt-provider-order-list-dialog-web-ad-content',
  templateUrl: './provider-order-list-dialog-web-ad-content.component.html'
})
export class ProviderOrderListDialogWebAdContentComponent implements OnInit {
  @Input() public selectedJobOpportunity: ProviderOrderList;
  @Input() public selectedWebAd : WebAd;
  @Input() public dialogOpened = false;

  @Output() isChildFormValid: EventEmitter<boolean> = new EventEmitter<true>();

  private jobOpportunity: JobOpportunity;

  public jobApplyForm: FormGroup;
  public webAd: WebAd;
  public jobOpportunityText: string;
  public userInfoSubscription: Subscription;
  public userInfo: ProviderInfo;
  public emailPattern = /^[A-Za-z][A-Za-z0-9\.\-\_]*@[A-Za-z0-9\.\-\_]*\.[A-Za-z]{1,}$/;

  constructor(
    private userInfoService: ProviderInfoService,
    private loginService: LoginService,
    private jobApplyFormBuilder: FormBuilder) { }

  ngOnInit() {
    this.jobOpportunity = this.selectedJobOpportunity as JobOpportunity;
    this.webAd = this.selectedWebAd;
    
    this.jobApplyForm = this.jobApplyFormBuilder.group({
      email: [{ value: '', disabled: this.getIsImpersonating() }, [Validators.pattern(this.emailPattern), Validators.required]]
    });

    this.jobApplyForm.valueChanges.subscribe(() => {
      this.isChildFormValid.emit(this.jobApplyForm.valid);
    });

    this.userInfoSubscription = this.userInfoService.getUserInfo(this.loginService.getUserId(), Roles.Provider).subscribe(
      (data) => {
        this.userInfo = data;
        this.jobApplyForm.controls.email.setValue(this.userInfo.email);
      });

    this.jobOpportunityText =
      `<h5>By clicking Apply Now you are applying for a ${this.jobOpportunity.specialtyName} Job in ${this.jobOpportunity.regionName}.</h5>`;
  }

  public ngOnDestroy() {
    this.userInfoSubscription.unsubscribe();
  }

  get email() {
    return this.jobApplyForm.get('email');
  }

  updateEmail() {
    this.userInfoService.updateUserInfoEmail(this.jobApplyForm.controls['email'].value);
  }

  getIsImpersonating(): boolean {
    return this.loginService.getIsImpersonating();
  }
}
