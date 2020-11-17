import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ApplicationInsightsService } from '../../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants,
  ApplicationInsightsCustomEventConstants } from '../../../shared/constants/application-insights-custom-constants';
import {ResendPdfService} from '../../../shared/services/account/resend-pdf.service';
import {DialogService} from '../../../shared/services/dialog.service';
import {SimpleDialogContentComponent} from '../../dialog/simple-dialog-content/simple-dialog-content.component';
import {ActionTypes} from '../../../shared/enums/action-types.enum'; 
import { ResendPdfInfo } from '../../../shared/models/resend-pdf-info';

@Component({
  selector: 'jclt-resend-pdf',
  templateUrl: './resend-pdf.component.html'
})
export class ResendPdfComponent implements OnInit {
  form: FormGroup;
  isSuccessfullyResent = false;
  submitAttempted = false;

  constructor(
    private fb: FormBuilder,
    private resendPdfService: ResendPdfService,
    private dialogService: DialogService,
    private applicationInsightsService: ApplicationInsightsService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group(
      {
        externalBookingId: ['', [Validators.required]],
        timesheetDate: [null,[Validators.required]]
     }
    );
  }

  get externalBookingId() {
    return this.form.get('externalBookingId');
  }

  get timesheetDate() {
    return this.form.get('timesheetDate');
  }

  onKeydown() {
    this.isSuccessfullyResent = false;
  }

  public onSubmit() {
    this.submitAttempted = true;
    if (this.form.valid) {
      let resendPdfInfo:ResendPdfInfo = this.form.getRawValue() as ResendPdfInfo;
      this.resendPdfService.resendPdf(resendPdfInfo)
        .subscribe(
          () => {
            this.isSuccessfullyResent = true;
            this.applicationInsightsService.logResendPdfApplicationInsights(
              ApplicationInsightsCustomDispositionConstants.SUCCESS,
              ApplicationInsightsCustomPageConstants.RESEND_PDF,
              ApplicationInsightsCustomSourceConstants.RESENDPDFCOMPONENT,
              resendPdfInfo.externalBookingId.toString(),
              resendPdfInfo.timesheetDate.toString());
          },
          failedResponse => {
            this.isSuccessfullyResent = false;
            this.applicationInsightsService.logResendPdfApplicationInsights(
              ApplicationInsightsCustomDispositionConstants.FAILURE,
              ApplicationInsightsCustomPageConstants.RESEND_PDF,
              ApplicationInsightsCustomSourceConstants.RESENDPDFCOMPONENT,
              resendPdfInfo.externalBookingId.toString(),
              resendPdfInfo.timesheetDate.toString());

            this.dialogService.openDialog({
              title: 'Resending PDF failed',
              inputData: {
                text: "<strong class='text-danger'>" + (failedResponse.error ? failedResponse.error.errors : []).join(' ') + "</strong>"
              },
              closable: false,
              component: SimpleDialogContentComponent,
              actions: [
                {
                  callbackFn: () => {},
                  primary: true,
                  actionType: ActionTypes.Yes,
                  actionButtonText: 'Ok'
                }
              ]
            });
          }
        );
    }
  }
}
