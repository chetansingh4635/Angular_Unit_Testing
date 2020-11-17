import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../shared/services/account/login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProviderInfoService } from '../../../shared/services/provider-info.service';

@Component({
  selector: 'jclt-timesheet-submit-impersonation-detail',
  templateUrl: './timesheet-submit-impersonation-detail.component.html'
})
export class TimesheetSubmitImpersonationDetailComponent implements OnInit {

  public impersonationSubscription;
  public isImpersonating = false;
  public form: FormGroup;
  constructor(public loginService: LoginService, public fb: FormBuilder, private userInfoService: ProviderInfoService) {
    this.form = this.fb.group({
      reason: ['', [Validators.required, Validators.maxLength(250)]]
    });

  }

  ngOnInit() {
    this.userInfoService.impersonationErrorSubscription.subscribe(data => {
      if (data)
        this.form.controls.reason.markAsTouched()
    })
    this.impersonationSubscription = this.loginService.currentlyImpersonating$.subscribe(currentlyImpersonating => {
      this.isImpersonating = currentlyImpersonating;
    });
  }

  updateReason() {
    this.userInfoService.updateImpersonateReason(this.form.value.reason);
  }

}
