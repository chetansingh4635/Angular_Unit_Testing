import { Component, OnInit, EventEmitter, Output, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { PasswordChangeService } from '../../shared/services/account/password-change.service';
import { LoginService } from '../../shared/services/account/login.service';
import { NotificationService } from '../../shared/services/ui/notification.service';
import { PopupNotification } from '../../shared/models/notification/popup-notification';
import { NotificationType } from '../../shared/enums/notification/notification-type';
import { DialogService } from '../../shared/services/dialog.service';
import { ActionTypes } from '../../shared/enums/action-types.enum';
import { ActivatedRoute } from '@angular/router';
import { IComponentCanDeactivate } from '../shared/guards/can-deactivate-guard.service';
import { ProviderPreferencesLookupService } from '../shared/services/preferences/provider-preferences-lookup.service';
import { SimpleDialogContentComponent } from '../../components/dialog/simple-dialog-content/simple-dialog-content.component';
import { Roles } from '../../shared/enums/Roles';
import { ProviderInfoService } from '../../shared/services/provider-info.service';
import { Subscription } from 'rxjs';
import { ProviderInfo } from '../../shared/models/ProviderInfo';

interface Item {
  text: string,
  value: number,
}
@Component({
  selector: 'jclt-provider-preferences',
  templateUrl: './provider-preferences.component.html'
})
export class ProviderPreferencesComponent implements OnInit, IComponentCanDeactivate {

  public myGroup: any;
  public preferencesList: any;
  public preferencesChoice: any;
  public isChildShow: boolean = false;
  public minAgeControl: any;
  public maxAgeControl: any;
  public dayofWeekControl: any;
  public minAgeValue: number = null;
  public maxAgeValue: number = null;
  public selectedShiftValue: Array<any> = [];
  public selectedSchecduleValue: Array<any> = [];
  public dayofWeek: number = null;
  public rate: number = null;
  public minAge: number = null;
  public maxAge: number = null;
  public isLookupChanged: Boolean = false;
  public shiftData: Array<number> = [];
  public schecduleData: Array<number> = [];
  public isJobtypeChecked: boolean = false;
  public isworkSettingsChecked: boolean = false;
  public ispatientAgeChecked: boolean = false;
  public iscoverageChecked: boolean = false;
  public patientChoiceList: Array<any> = [];
  public SelectedJobTypes: any;
  public SelectedWorkSettings: any;
  public SelectedCoverages: any;
  public isSubmitted: boolean = true;
  public patientAgeChkLength: number;
  public maxAgeValidator: boolean = false;
  public maxAgeValidatorMsg: string;
  public dayofWeekDropDownData: Array<Item> = [];
  public childAgeDropDownData: Array<Item> = [];
  public providerInfo: ProviderInfo;
  public userInfoSubscription: Subscription;

  public isImpersonating = false;
  public subscription;
  public impersonationSubscription;

  constructor(
    private loginService: LoginService,
    private passwordChangeService: PasswordChangeService,
    private notificationService: NotificationService,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private providerPreferencesLookupService: ProviderPreferencesLookupService,
    private userInfoService: ProviderInfoService
  ) {
    this.myGroup = new FormGroup({
      jobTypeList: new FormArray([]),
      scheduleList: new FormArray([]),
      shiftList: new FormArray([]),
      workSettingList: new FormArray([]),
      patientAgeList: new FormArray([]),
      coverageList: new FormArray([]),
      dayofWeekControl: new FormControl(),
      rateControl: new FormControl('', [Validators.max(99999), Validators.min(0)]),
      minAgeControl: new FormControl(),
      maxAgeControl: new FormControl()
    });
  }
  private addCheckboxes() {
    this.preferencesList[0].jobTypes.forEach((o, i) => {
      if (this.preferencesChoice.jobTypeList.includes(this.preferencesList[0].jobTypes[i].jobTypeId.toString())) {
        this.isJobtypeChecked = true;
      }
      const control = new FormControl(this.isJobtypeChecked); // if first item set to true, else false
      this.isJobtypeChecked = false;
      (this.myGroup.controls.jobTypeList as FormArray).push(control);
    });

    this.preferencesList[0].schedules.forEach((o, i) => {
      const control = new FormControl(false);
      (this.myGroup.controls.scheduleList as FormArray).push(control);
    });
    this.preferencesList[0].shifts.forEach((o, i) => {
      const control = new FormControl(false);
      (this.myGroup.controls.shiftList as FormArray).push(control);
    });
    this.preferencesList[0].workSettings.forEach((o, i) => {
      if (this.preferencesChoice.workSettingList.includes(this.preferencesList[0].workSettings[i].workSettingId.toString())) {
        this.isworkSettingsChecked = true;
      }
      const control = new FormControl(this.isworkSettingsChecked);
      this.isworkSettingsChecked = false;
      (this.myGroup.controls.workSettingList as FormArray).push(control);
    });
    this.preferencesList[0].patientAge.forEach((o, i) => {
      if (this.patientChoiceList.includes(this.preferencesList[0].patientAge[i].patientAgeId.toString())) {
        this.ispatientAgeChecked = true;
      }
      const control = new FormControl(this.ispatientAgeChecked); // if first item set to true, else false
      this.ispatientAgeChecked = false;
      (this.myGroup.controls.patientAgeList as FormArray).push(control);
    });
    this.preferencesList[0].coverages.forEach((o, i) => {
      if (this.preferencesChoice.coverageList.includes(this.preferencesList[0].coverages[i].coverageId.toString())) {
        this.iscoverageChecked = true;
      }
      const control = new FormControl(this.iscoverageChecked); // if first item set to true, else false
      this.iscoverageChecked = false;
      (this.myGroup.controls.coverageList as FormArray).push(control);
    });
  }
  ngOnInit() {

    this.impersonationSubscription = this.loginService.currentlyImpersonating$.subscribe(currentlyImpersonating => {
      this.isImpersonating = currentlyImpersonating;
    });
    //initialize dayof week dropdown
    this.dayofWeekDropDownData
      = [{ value: 1, text: '1' }, { value: 2, text: '2' },
      { value: 3, text: '3' }, { value: 4, text: '4' },
      { value: 5, text: '5' }, { value: 6, text: '6' },
      { value: 7, text: '7' }];

    //initialize child age dropdowns
    this.childAgeDropDownData
      = [{ value: 0, text: '0' }, { value: 1, text: '1' },
      { value: 2, text: '2' }, { value: 3, text: '3' },
      { value: 4, text: '4' }, { value: 5, text: '5' },
      { value: 6, text: '6' }, { value: 7, text: '7' },
      { value: 8, text: '8' }, { value: 9, text: '9' },
      { value: 10, text: '10' },
      { value: 11, text: '11' }, { value: 12, text: '12' },
      { value: 13, text: '13' }, { value: 14, text: '14' },
      { value: 15, text: '15' }, { value: 16, text: '16' },
      { value: 17, text: '17' }, { value: 18, text: '18' }];

    //fetch API data
    this.preferencesList = this.route.snapshot.data.preferencesList;

    this.userInfoSubscription = this.userInfoService.getUserInfo(this.loginService.getUserId(), Roles.Provider).subscribe(
      (data) => {
        this.providerInfo = data;
      });

    this.preferencesChoice = this.route.snapshot.data.preferencesChoice;

    for (let i = 0; i < this.preferencesChoice.shiftList.length; i++) {
      this.selectedShiftValue.push(parseInt(this.preferencesChoice.shiftList[i]));
    }
    for (let i = 0; i < this.preferencesChoice.scheduleList.length; i++) {
      this.selectedSchecduleValue.push(parseInt(this.preferencesChoice.scheduleList[i]));
    }
    for (let i = 0; i < this.preferencesChoice.patientAgeList.length; i++) {
      this.patientChoiceList.push(this.preferencesChoice.patientAgeList[i].patientAgeId.toString());
    }
    this.patientAgeChkLength = this.preferencesList[0].patientAge.length;
    if (this.patientChoiceList.includes(this.patientAgeChkLength.toString())) {
      this.isChildShow = true;
    }
    this.rate = this.preferencesChoice.rate === null ? 0 : this.preferencesChoice.rate;
    if (this.preferencesChoice.daysPerWeek !== 0) { this.dayofWeek = this.preferencesChoice.daysPerWeek; }

    for (let i = 0; i < this.preferencesChoice.patientAgeList.length; i++) {
      if (this.preferencesChoice.patientAgeList[i].patientAgeId === 2) {
        this.minAge = this.preferencesChoice.patientAgeList[i].fromAge;
        this.maxAge = this.preferencesChoice.patientAgeList[i].toAge;
        this.minAgeValue = this.preferencesChoice.patientAgeList[i].fromAge;
        this.maxAgeValue = this.preferencesChoice.patientAgeList[i].toAge;
      }
    }
    this.addCheckboxes();

    //disable controls when personating
    if (this.isImpersonating) {
      this.myGroup.controls['jobTypeList'].disable();
      this.myGroup.controls['minAgeControl'].disable();
      this.myGroup.controls['maxAgeControl'].disable();
      this.myGroup.controls['shiftList'].disable();
      this.myGroup.controls['workSettingList'].disable();
      this.myGroup.controls['patientAgeList'].disable();
      this.myGroup.controls['coverageList'].disable();
    }
    

  }
  @HostListener('window:beforeunload')
  canDeactivate(): boolean {
    return !this.isLookupChanged;
  }

  public onShiftChanged(event) {
    this.isLookupChanged = true;
    this.shiftData = event;
    this.selectedShiftValue = event;
  }
  public onScheduleChanged(event) {
    this.isLookupChanged = true;
    this.schecduleData = event;
    this.selectedSchecduleValue = event;
  }
  public JobTypeChange(values: any) {
    this.isLookupChanged = true;
  }
  public WorkSettingsChange(values: any) {
    this.isLookupChanged = true;
  }
  public CoveragesChange(values: any) {
    this.isLookupChanged = true;
  }
  public maxAgeChange(event) {
    this.isLookupChanged = true;
    if (this.myGroup.controls['minAgeControl'].value > this.myGroup.controls['maxAgeControl'].value
      && this.myGroup.controls['maxAgeControl'].value !== null && this.myGroup.controls['maxAgeControl'].value !== '') {
      this.myGroup.controls['maxAgeControl'].setErrors({ 'noMatch': true });
      return { invalid: true };
    }
    else if (this.myGroup.controls['minAgeControl'].value <= this.myGroup.controls['maxAgeControl'].value
      || this.myGroup.controls['maxAgeControl'].value === null || this.myGroup.controls['maxAgeControl'].value === '') {
      this.myGroup.controls['maxAgeControl'].setErrors(null);
      this.myGroup.controls['minAgeControl'].setErrors(null);
      return { invalid: null };
    }
    return { invalid: null };
  }
  public minAgeChange(event) {
    this.isLookupChanged = true;
    if ((this.myGroup.controls['minAgeControl'].value > this.myGroup.controls['maxAgeControl'].value)
      && this.myGroup.controls['maxAgeControl'].value !== null && this.myGroup.controls['maxAgeControl'].value !== '') {
      this.myGroup.controls['minAgeControl'].setErrors({ 'noMatch': true });
      return { invalid: true };
    }
    else if (this.myGroup.controls['minAgeControl'].value <= this.myGroup.controls['maxAgeControl'].value
      || this.myGroup.controls['maxAgeControl'].value === null || this.myGroup.controls['maxAgeControl'].value === '') {
      this.myGroup.controls['minAgeControl'].setErrors(null);
      this.myGroup.controls['maxAgeControl'].setErrors(null);
      return { invalid: null };
    }
    return { invalid: null };
  }
  public rateChange(event) {
    this.isLookupChanged = true;
  }
  public DayofWeekChange(event) {
    this.isLookupChanged = true;
  }
  public numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  // save form data
  submit() {
    const selectedJobTypeIds = this.myGroup.value.jobTypeList
      .map((v, i) => (v ? this.preferencesList[0].jobTypes[i].jobTypeId : null))
      .filter(v => v !== null);

    const selectedWorkSettingsIds = this.myGroup.value.workSettingList
      .map((v, i) => (v ? this.preferencesList[0].workSettings[i].workSettingId : null))
      .filter(v => v !== null);

    const selectedCoveragesIds = this.myGroup.value.coverageList
      .map((v, i) => (v ? this.preferencesList[0].coverages[i].coverageId : null))
      .filter(v => v !== null);

    const selectedPatientAgeIds = this.myGroup.value.patientAgeList
      .map((v, i) => (v ? this.preferencesList[0].patientAge[i].patientAgeId : null))
      .filter(v => v !== null);

    const arrPatientAge: Array<any> = [];
    for (let i = 0; i < selectedPatientAgeIds.length; i++) {
      if (selectedPatientAgeIds[i] === 1) {
        arrPatientAge.push({ "patientAgeId": 1, "fromAge": null, "toAge": null });
      }
      else if (selectedPatientAgeIds[i] === 2) {
        arrPatientAge.push({ "patientAgeId": 2, "fromAge": this.minAge, "toAge": this.maxAge });
      }
    }
    this.isSubmitted = true;

    //payload data
    let payload = {
      providerId: this.providerInfo.providerId,
      daysPerWeek: this.dayofWeek === null ? 0 : this.dayofWeek,
      rate: this.rate === null ? 0 : this.rate,
      jobTypeList: selectedJobTypeIds,
      coverageList: selectedCoveragesIds,
      scheduleList: this.selectedSchecduleValue,
      shiftList: this.selectedShiftValue,
      workSettingList: selectedWorkSettingsIds,
      patientAgeList: arrPatientAge
    }
    this.providerPreferencesLookupService.saveProviderPreferences(payload)
      .subscribe(
        (data) => {
          this.notificationService.addNotification(
            new PopupNotification('Provider preferences have been saved successfully', NotificationType.Success, 3000)
          );
          this.isLookupChanged = false;
        },
        (err) => {
          console.log('err', err);
          this.dialogService.openDialog({
            title: 'Invalid Data!',
            inputData: {
              text: ('err' ? [] : []).join('\n')
            },
            closable: false,
            component: SimpleDialogContentComponent,
            actions: [
              {
                actionButtonText: 'Ok',
                primary: true,
                callbackFn: () => {
                },
                actionType: ActionTypes.Yes
              }
            ]
          });
        });
  }
  //show/hide child age section
  toggleChildAge(e) {
    const patientAgeChildChk = 'chkPatientAge_' + this.patientAgeChkLength;
    this.isLookupChanged = true;
    if (e.target.id === patientAgeChildChk) {
      if (e.target.checked) {
        this.isChildShow = true;
      }
      else if (!e.target.checked) {
        this.minAgeValue = null;
        this.maxAgeValue = null;
        this.minAge = null;
        this.maxAge = null;
        this.myGroup.controls['maxAgeControl'].setErrors(null);
        this.myGroup.controls['minAgeControl'].setErrors(null);
        this.isChildShow = false;
      }
    }
  }
  // min/max age validation
  private maxAgeValidatorfun(c: AbstractControl): { invalid: boolean } {
    if (c.get('minAgeControl').value > c.get('maxAgeControl').value) {
      c.get('maxAgeControl').setErrors({ 'noMatch': true });
      return { invalid: true };
    }
    else if (c.get('minAgeControl').value <= c.get('maxAgeControl').value) {
      c.get('maxAgeControl').setErrors(null);
      return { invalid: null };
    }
    return { invalid: null };
  }
  public ngOnDestroy() {
    this.userInfoSubscription.unsubscribe();
  }
}


