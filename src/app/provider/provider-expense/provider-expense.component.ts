import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators as CommonCustomValidators } from '../../shared/commons/custom-validators';
import { CustomValidators as ProviderCustomValidators } from '../shared/commons/custom-validators';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseTypes } from '../shared/enums/expense/expense-types';
import { environment } from '../../../environments/environment';
import { ExpenseArrayFormMapper } from '../shared/mappers/expense-list-form-mapper';
import { ExpenseService } from '../shared/services/expense/expense.service';
import { NotificationService } from '../../shared/services/ui/notification.service';
import { PopupNotification } from '../../shared/models/notification/popup-notification';
import { NotificationType } from '../../shared/enums/notification/notification-type';
import { ExpenseProviderStatuses } from '../shared/enums/expense/expense-provider-statuses';
import { FileInfo, FileRestrictions, FileState, RemoveEvent, UploadEvent } from '@progress/kendo-angular-upload';
import { ExpenseDocument } from '../shared/models/expense-document';
import { ExpenseDocumentStatuses } from '../shared/enums/expense/expense-document-statuses';
import { Expense } from '../shared/models/expense';
import { TypeOfRedirectAfterSaveExpense } from '../shared/enums/redirect-type-after-save-expense.enum';
import * as moment from 'moment';
import * as uuid from 'uuid';
import { DialogService } from '../../shared/services/dialog.service';
import { SimpleDialogContentComponent } from '../../components/dialog/simple-dialog-content/simple-dialog-content.component';
import { ActionTypes } from '../../shared/enums/action-types.enum';
import { IComponentCanDeactivate } from '../shared/guards/can-deactivate-guard.service';
import { Location } from '@angular/common';
import { WorkLocation } from '../shared/models/work-location';
import { ProviderExpenseDialogTypes } from '../shared/enums/expense/component/provider-expense-component-dialog-types.enum';
import { LoginService } from '../../shared/services/account/login.service';

@Component({
  selector: 'jclt-provider-expense',
  templateUrl: 'provider-expense.component.html',
})
export class ProviderExpenseComponent implements OnInit, IComponentCanDeactivate {
  @ViewChild("dateKendo1") public dateKendo1: any;
  @ViewChild("dateKendo2") public dateKendo2: any;
  private activePicker: any = null;

  form: FormGroup;

  public defaultFiles: Array<FileInfo> = [];
  public errorList: Array<string>;

  public workLocationArray: Array<WorkLocation>;
  public workLocationDropDownData: Array<{ value: number, text: string }>;
  public expenseTypes = [
    { value: ExpenseTypes.Lodging, text: 'Lodging' },
    { value: ExpenseTypes.Airfare, text: 'Air Travel' },
    { value: ExpenseTypes.CarRental, text: 'Car Rental' },
    { value: ExpenseTypes.Mileage, text: 'Mileage' },
    { value: ExpenseTypes.Misc, text: 'Misc' },
    { value: ExpenseTypes.AutoExpense, text: 'Auto Expense' }
  ];
  private wasSubmitPressedLast = false;

  public uploadSaveUrl = `${environment['host']}/api/provider/expense/initialUploadFiles`;
  public uploadRemoveUrl = 'https://httpbin.org/post'; // TODO: change this url
  expenseId: number;

  public minDate = moment('20170101', 'YYYYMMDD').toDate();
  public maxDate = moment().add(1, 'year').toDate();
  public minAmount = 1;
  public maxAmount = 100000;
  public defaultWorkLocation = { text: 'Select work location', value: null };
  public defaultExpenseType = { text: 'Select expense type', value: null };
  public lastSelectedWorkLocation = { text: 'Select work location', value: null };
  public totalAmountFormat;
  public initialExpense: Expense;
  public nextExpenseId?: number;
  public prevExpenseId?: number;

  private oldDocumentsList: Array<ExpenseDocument>;
  private indexFormControl: number;

  public dialogTypes = ProviderExpenseDialogTypes;
  public showDialog: ProviderExpenseDialogTypes = ProviderExpenseDialogTypes.None;
  public datePickerOpenMobile = false;
  private isMobile = false;
  public impersonationSubscription;
  public isImpersonating = false;
  public acceptFiles: FileRestrictions = {
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.doc', '.docx', '.xls', '.xlsx', '.pdf', '.csv']
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private expenseService: ExpenseService,
    private notificationService: NotificationService,
    private dialogService: DialogService,
    private location: Location,
    public loginService: LoginService
  ) {
    this.totalAmountFormat = 'c0';
  }

  ngOnInit() {
    this.isMobile = (navigator.userAgent.match(/(Mobi|Android)/) != null);
    this.impersonationSubscription = this.loginService.currentlyImpersonating$.subscribe(impersonating => {
      this.isImpersonating = impersonating;
    });
    document.addEventListener("dragstart", (e) => {
      e.preventDefault();
      return false;
    });

    this.prepWorkLocationData();
    this.route.params.subscribe(params => {
      this.expenseId = +params['id'];
      if (Number.isNaN(this.expenseId)) {
        this.router.navigate(['/provider/non-submitted-expenses']);
      }
      this.initialExpense = this.route.snapshot.data.initialExpense;
      if (!this.isNewExpenses) {
        if (this.expenseId === 0) {
          this.router.navigate(['/provider/non-submitted-expenses']);
        } else {
          this.prepInitialDataFromInitialExpense();
        }
      } else {
        this.lastSelectedWorkLocation = this.defaultWorkLocation = { text: 'Select work location', value: null };
        this.defaultExpenseType = { text: 'Select expense type', value: null };
        this.oldDocumentsList = null;
        this.defaultFiles = [];
      }

      this.form = this.fb.group({
        expense: this.fb.array([])
      });
      this.addItemRow();
    });
  }

  @HostListener('window:beforeunload')
  canDeactivate(): boolean {
    return !this.expenseControl.dirty;
  }

  public onAddExpense() {
    this.addItemRow();
  }

  public onSubmitForm() {
    this.wasSubmitPressedLast = true;

    const formData = this.getFormDataWithOldDocumentsList(this.form.getRawValue().expense);

    if (this.canSubmit) {
      this.confirmSendFormData(formData, ExpenseProviderStatuses.Submitted, TypeOfRedirectAfterSaveExpense.ToListPage);
    }
  }

  public onSaveForm(typeOfRedirect: TypeOfRedirectAfterSaveExpense) {
    this.wasSubmitPressedLast = false;
    if (this.expenseControl.dirty) {
      const formData = this.getFormDataWithOldDocumentsList(this.form.getRawValue().expense);

      if (this.canSave) {
        this.confirmSendFormData(formData, ExpenseProviderStatuses.Draft, typeOfRedirect);
        this.expenseControl.markAsPristine();
      }
    } else {
      this.notificationService.addNotification(
        new PopupNotification('Expense was not modified', NotificationType.Success, 3000));
      this.redirectAfterSave(typeOfRedirect);
    }
  }

  public getVerboseTotalAmountName(expenseType: ExpenseTypes) {
    if (expenseType === ExpenseTypes.Mileage) {
      return 'Total Mileage';
    } else {
      return 'Total Amount';
    }
  }

  public getTotalAmountFormat(expenseType: ExpenseTypes) {
    if (expenseType === ExpenseTypes.Mileage) {
      return 'n2';
    } else {
      return 'c2';
    }
  }

  public fixTotalAmount(indexFormControl) {
    let form: FormGroup = <FormGroup>this.expenseControl.at(indexFormControl);
    let val = form.controls["totalAmount"].value;
    if (val > this.maxAmount) {
      form.patchValue({ totalAmount: this.maxAmount });
    }
    if (val && val < this.minAmount) {
      form.patchValue({ totalAmount: this.minAmount });
    }
  }

  public get expenseControl(): FormArray {
    return <FormArray>(this.form.controls['expense']);
  }

  public get canAddExpense(): boolean {
    return this.isNewExpenses;
  }

  public get isNewExpenses(): boolean {
    return this.expenseId === 0;
  }

  private get canSave(): boolean {
    return this.expenseControl.controls.every(
      expenseControl => (
        !expenseControl.hasError('innerPropertyRequired', ['workLocation']) &&
        !expenseControl.hasError('innerPropertyRequired', ['expenseType']) &&
        (!expenseControl.errors || !expenseControl.errors['dates'])
      )
    );
  }

  private get canSubmit(): boolean {
    return this.form.valid;
  }

  public get wantToSave(): boolean {
    return !this.wasSubmitPressedLast;
  }

  public get wantToSubmit(): boolean {
    return this.wasSubmitPressedLast;
  }

  public onWorkLocationChange(workLocation: { text: string, value: WorkLocation }): void {
    this.lastSelectedWorkLocation = workLocation;
  }

  public onDocumentUploadHandler(event: UploadEvent) {
    event.files.map((f) => {
      if (this.acceptFiles.allowedExtensions.indexOf(f.extension) === -1) {
        event.preventDefault();
        this.dialogService.openDialog({
          title: 'File type not allowed',
          component: SimpleDialogContentComponent,
          inputData: {
            text: `<p class="text-danger"><b>${f.name}</b> will not be uploaded because the file type is not allowed.</p>
<p>Allowed file extensions are: ${this.acceptFiles.allowedExtensions.join(', ')}.</p>`
          },
          actions: [
            {
              actionType: ActionTypes.Yes,
              actionButtonText: 'OK',
              primary: true,
              callbackFn: () => { }
            }
          ],
          closable: true
        });
        return;
      }
    });
  }

  public onDocumentRemoveHandler(event: RemoveEvent, unsavedId: string) {
    const oldDocumentsFromEvent: Array<FileInfo> = [];
    const newDocumentsFromEvent: Array<FileInfo> = [];

    for (const document of event.files) {
      if (document.state === FileState.Initial) {
        oldDocumentsFromEvent.push(document);
      } else {
        newDocumentsFromEvent.push(document);
      }
    }

    this.removeOldFiles(oldDocumentsFromEvent);
    this.removeNewFiles(newDocumentsFromEvent, unsavedId);
  }

  private removeOldFiles(filesList: Array<FileInfo>) {
    if (!this.oldDocumentsList) {
      return;
    }

    this.oldDocumentsList = this.oldDocumentsList.map(document => {
      const needToRemove = filesList.find(fileInfoFromRemoveEvent => {
        return fileInfoFromRemoveEvent.uid === document.uid;
      }) !== undefined;

      if (needToRemove) {
        document.status = ExpenseDocumentStatuses.needToRemove;
      }

      return document;
    });
  }

  private removeNewFiles(filesList: Array<FileInfo>, unsavedId: string) {
    this.expenseService.removeFiles(
      filesList.map((fileInfo: FileInfo) => fileInfo.name), unsavedId).subscribe();
  }

  public refreshExpense(indexFormControl: number) {
    (<FormGroup>this.expenseControl.at(indexFormControl))
      .reset({
        workLocation: this.defaultWorkLocation,
        expenseType: this.defaultExpenseType,
        from: this.initialExpense.startDate,
        to: this.initialExpense.endDate,
        expenseId: this.initialExpense.expenseId,
        totalAmount: this.initialExpense.totalAmount,
        uploadedFiles: this.defaultFiles,
        unsavedId: uuid(),
        updateStamp: this.initialExpense.updateStamp
      });

    this.oldDocumentsList = this.oldDocumentsList.map(document => {
      document.status = ExpenseDocumentStatuses.keep;
      return document;
    });
  }

  public removeExpense() {
    const expenseId = this.form.getRawValue().expense[this.indexFormControl].expenseId;

    this.expenseService.removeExpense(expenseId).subscribe(
      () => {
        this.notificationService.addNotification(
          new PopupNotification('Success removing expense', NotificationType.Success, 5000));
        this.router.navigate(['/provider/non-submitted-expenses']);
      },
      () => {
        this.notificationService.addNotification(
          new PopupNotification('Failed removing expense', NotificationType.Danger, 2500));
      }
    );
  }

  public onRefreshClick(indexFormControl: number) {
    this.refreshExpense(indexFormControl);
  }

  public onTrashClick(indexFormControl: number): void {
    if (this.expenseControl.length > 1) {
      this.expenseControl.removeAt(indexFormControl);
    } else {
      if (this.isNewExpenses) {
        this.refreshExpense(indexFormControl);
      } else {
        //ask user
        this.indexFormControl = indexFormControl;
        this.displayDialog(ProviderExpenseDialogTypes.Delete);
      }
    }
  }

  private addItemRow() {
    const countOfExpenses = this.expenseControl.length;
    let fromDate = this.initialExpense.startDate;
    let toDate = this.initialExpense.endDate;

    if (countOfExpenses > 0) {
      const prevExpense = (<FormGroup>this.expenseControl.at(countOfExpenses - 1)).getRawValue();
      fromDate = prevExpense.from;
      toDate = prevExpense.to;
    }

    this.expenseControl.push(
      this.fb.group({
        expenseId: [this.initialExpense.expenseId],
        workLocation: [this.lastSelectedWorkLocation, CommonCustomValidators.innerPropertyRequired('value')],
        expenseType: [this.defaultExpenseType, CommonCustomValidators.innerPropertyRequired('value')],
        from: [
          fromDate,
          [Validators.required, CommonCustomValidators.lessThan(this.maxDate), CommonCustomValidators.greatThan(this.minDate)]
        ],
        to: [
          toDate,
          [Validators.required, CommonCustomValidators.lessThan(this.maxDate), CommonCustomValidators.greatThan(this.minDate)]
        ],
        totalAmount: [this.initialExpense.totalAmount, [Validators.required, Validators.min(this.minAmount), Validators.max(this.maxAmount)]],
        uploadedFiles: [this.defaultFiles],
        unsavedId: [uuid()],
        updateStamp: [this.initialExpense.updateStamp]
      }, {
        validator: Validators.compose([
          ProviderCustomValidators.dateLessThan('from', 'to'),
          ProviderCustomValidators.expenseFilesRequired('expenseType', 'uploadedFiles')
        ])
      })
    );
    if(this.isImpersonating)
      this.form.disable();
  }

  private prepWorkLocationData() {
    this.workLocationArray = this.route.snapshot.data.workLocationArray;
    this.workLocationDropDownData = this.workLocationArray.map((workLocation: WorkLocation) => {
      return {
        value: workLocation.bookingId,
        text: `${workLocation.workLocationName}, ${workLocation.city} ${workLocation.stateAbbreviation}`
      };
    });
  }

  private addServerSideErrors(errors: any) {
    this.errorList = Object.keys(errors).map(errorKey => errors[errorKey]);
  }

  private cleanServerSideErrors() {
    this.errorList = [];
    this.expenseControl.markAsPristine();
  }

  private prepInitialDataFromInitialExpense(): void {
    this.nextExpenseId = this.initialExpense.nextExpenseId;
    this.prevExpenseId = this.initialExpense.previousExpenseId;

    this.lastSelectedWorkLocation = this.workLocationDropDownData.find(
      dropDownWorkLocationItem => dropDownWorkLocationItem.value === this.initialExpense.bookingId);

    this.defaultWorkLocation = this.workLocationDropDownData.find(
      dropDownWorkLocationItem => dropDownWorkLocationItem.value === this.initialExpense.bookingId);

    this.defaultExpenseType = this.expenseTypes.find(
      expenseType => expenseType.value === this.initialExpense.expenseTypeId);

    this.oldDocumentsList = this.initialExpense.documentsList
      .map(document => {
        document.uid = uuid();
        document.status = ExpenseDocumentStatuses.keep;
        return document;
      });

    this.defaultFiles = this.oldDocumentsList.map((document: ExpenseDocument): FileInfo => ({
      name: document.documentPath.split('\\').pop(),
      size: document.size,
      uid: document.uid
    }));
  }

  private getFormDataWithOldDocumentsList(expenses: Array<any>) {
    return expenses.map(expense => {
      expense.oldDocumentsList = this.oldDocumentsList ? this.oldDocumentsList.filter(
        document => document.status === ExpenseDocumentStatuses.keep
      ) : [];
      return expense;
    });
  }

  private redirectToOtherExpense(expenseId: number) {
    if (expenseId > 0) {
      this.router.navigate(['/provider/expense/' + expenseId]);
    }
  }

  private confirmSendFormData(
    formData: Array<any>,
    expenseProviderStatus: ExpenseProviderStatuses,
    typeOfRedirect: TypeOfRedirectAfterSaveExpense) {

    if (expenseProviderStatus === ExpenseProviderStatuses.Draft) {
      // save without asking user
      this.sendFormData(
        new ExpenseArrayFormMapper(formData).serializedData,
        expenseProviderStatus,
        typeOfRedirect);
    } else {
      // ask user if wants to submit
      this.displayDialog(ProviderExpenseDialogTypes.Submit);
    }
  }

  private sendFormData(
    expenses: Array<Expense>,
    expenseProviderStatus: ExpenseProviderStatuses,
    typeOfRedirectAfterSave: TypeOfRedirectAfterSaveExpense): void {

    expenses = expenses.map(expense => {
      expense.expenseProviderStatusId = expenseProviderStatus;
      return expense;
    });


    const successResponseSubscriber = () => {
      this.notificationService.addNotification(
        new PopupNotification(`Your expense was successfully ${expenseProviderStatus === ExpenseProviderStatuses.Draft ? 'saved. All expense submittals are subject to approval prior to reimbursement.' : 'submitted. All expense submittals are subject to approval prior to reimbursement.'}`, NotificationType.Success, 4000)
      );
      this.cleanServerSideErrors();

      if (expenseProviderStatus === ExpenseProviderStatuses.Draft) {
        this.redirectAfterSave(typeOfRedirectAfterSave);
      } else {
        this.router.navigate(['/provider/submitted-expenses']);
      }
    };

    const errorResponseSubscriber = (errorResponse) => {
      this.addServerSideErrors(errorResponse.error);
      this.notificationService.addNotification(
        new PopupNotification('Expense saving failed', NotificationType.Danger, 2500)
      );
    };

    const responseObservable = this.isNewExpenses ?
      this.expenseService.addExpenses(expenses) :
      this.expenseService.updateExpense(expenses[0]);

    responseObservable.subscribe(successResponseSubscriber, errorResponseSubscriber);
  }

  private redirectAfterSave(typeOfRedirect: TypeOfRedirectAfterSaveExpense) {
    if (typeOfRedirect === TypeOfRedirectAfterSaveExpense.ToListPage) {
      this.router.navigate(['/provider/non-submitted-expenses']);
    } else if (typeOfRedirect === TypeOfRedirectAfterSaveExpense.ToPreviousPage) {
      this.location.back();
    } else {
      this.redirectToOtherExpense(
        typeOfRedirect === TypeOfRedirectAfterSaveExpense.ToNext ?
          this.nextExpenseId :
          this.prevExpenseId
      );
    }
  }

  public onCancelExpense() {
    if (this.expenseControl.dirty) {
      this.displayDialog(ProviderExpenseDialogTypes.Cancel);
    } else {
      this.continueCancel();
    }
  }

  public continueCancel() {
    this.expenseControl.markAsPristine();
    this.router.navigate(['/provider/non-submitted-expenses']);
  }

  private displayDialog(type: ProviderExpenseDialogTypes) {
    this.showDialog = type;
  }

  public closeDialog() {
    this.showDialog = ProviderExpenseDialogTypes.None;
  }

  public continueSubmit() {
    const formData = this.getFormDataWithOldDocumentsList(this.form.getRawValue().expense);
    this.sendFormData(
      new ExpenseArrayFormMapper(formData).serializedData,
      ExpenseProviderStatuses.Submitted,
      TypeOfRedirectAfterSaveExpense.ToListPage);
  }

  public isIe(): boolean {
    return window.navigator.userAgent.indexOf('Trident/') > 0;
  }

  public onOverlayClick(picker: any) {
    if (this.isMobile && !picker.isOpen) {
      this.activePicker = picker;
      picker.toggle(true);
      this.onKendoOpen();
    }
  }

  public onDateChange(picker: any, controlName: string, index: number) {
    if (picker.value) {
      if (picker.value.getFullYear() < 100) {
        picker.value.setFullYear(picker.value.getFullYear() + 2000);

        let form: FormGroup = <FormGroup>this.expenseControl.at(index);
        form.controls[controlName].setValue(picker.value);
      }
    }
  }

  private scrollPos = 0;
  public onKendoOpen() {
    if (this.isMobile) {
      this.datePickerOpenMobile = true;
      if (window.matchMedia("(max-width: 619px)").matches) {

        if (navigator.userAgent.match(/(iPod|iPhone)/) && document.documentElement.clientWidth <= window.innerWidth) {
          this.scrollPos = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
          document.body.classList.add("preventTouchScroll");
          document.documentElement.classList.add("preventTouchScroll");
          if (this.scrollPos > 0) {
            document.body.style.top = `-${this.scrollPos}px`;
          }
        } else {
          document.body.classList.add("noScroll");
        }

      }
    }
  }

  public onKendoClose() {
    this.datePickerOpenMobile = false;
    document.body.classList.remove("noScroll");

    document.body.classList.remove("preventTouchScroll");
    document.documentElement.classList.remove("preventTouchScroll");
    if (this.scrollPos > 0) {
      document.body.style.top = "0";
      document.body.scrollTop = this.scrollPos;
      document.documentElement.scrollTop = this.scrollPos;
      this.scrollPos = 0;
    }

    window.setTimeout(() => {
      if (this.activePicker) {
        this.activePicker.blur();
      }
      this.activePicker = null;
    },
      1);
  }

  public onClickKendoShadow() {
    if (this.activePicker.isOpen) {
      this.activePicker.toggle(false);
      this.onKendoClose();
    }
  }
}
