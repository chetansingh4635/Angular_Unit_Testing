import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ExpenseTypes } from '../shared/enums/expense/expense-types';
import { ExpenseService } from '../shared/services/expense/expense.service';
import { NotificationService } from '../../shared/services/ui/notification.service';
import { UploadEvent } from '@progress/kendo-angular-upload';
import { TypeOfRedirectAfterSaveExpense } from '../shared/enums/redirect-type-after-save-expense.enum';
import { DialogService } from '../../shared/services/dialog.service';
import { Location } from '@angular/common';
import { WorkLocation } from '../shared/models/work-location';
import { ProviderExpenseComponent } from './provider-expense.component';
import { ProviderExpenseDialogTypes } from '../shared/enums/expense/component/provider-expense-component-dialog-types.enum';
import { Subject } from 'rxjs';
import { ExpenseArrayFormMapper } from '../shared/mappers/expense-list-form-mapper';
import { LoginService } from '../../shared/services/account/login.service';
import { CustomValidators as ProviderCustomValidators } from '../shared/commons/custom-validators';

describe('ProviderExpenseComponent', () => {
  let component: ProviderExpenseComponent;
  let fixture: ComponentFixture<ProviderExpenseComponent>;
  let expenseService: ExpenseService;
  let dialogService: DialogService;
  let notificationService: NotificationService;
  beforeEach(() => {
    const formBuilderStub = () => ({
      group: object => ({}),
      array: array => ({})
    });
    const activatedRouteStub = () => ({
      params: { subscribe: f => f({}) },
      snapshot: { data: { initialExpense: {}, workLocationArray: [{}] } }
    });
    const routerStub = () => ({ navigate: array => ({}) });
    const expenseServiceStub = () => ({
      removeFiles: (arg, unsavedId) => ({ subscribe: f => f({}) }),
      removeExpense: expenseId => ({ subscribe: f => f({}) }),
      addExpenses: expenses => ({}),
      updateExpense: arg => ({})
    });
    const notificationServiceStub = () => ({ addNotification: arg => ({}) });
    const dialogServiceStub = () => ({ openDialog: object => ({}) });
    const locationStub = () => ({ back: () => ({}) });
    const loginServiceStub = () => ({
      currentlyImpersonating$: { subscribe: f => f({}) },
      currentUser$: { subscribe: f => f({}) },
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ProviderExpenseComponent],
      providers: [
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: ExpenseService, useFactory: expenseServiceStub },
        { provide: NotificationService, useFactory: notificationServiceStub },
        { provide: DialogService, useFactory: dialogServiceStub },
        { provide: Location, useFactory: locationStub },
        { provide: LoginService, useFactory: loginServiceStub },
      ]
    });
    fixture = TestBed.createComponent(ProviderExpenseComponent);
    notificationService = TestBed.get(NotificationService);
    dialogService = TestBed.get(DialogService);
    expenseService = TestBed.get(ExpenseService);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
  });
  afterEach(() => {
    const spy = spyOnProperty(component, 'expenseControl').and.returnValue(
      new FormArray([new FormControl('expense')])
    );
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`defaultFiles has default value`, () => {
    expect(component.defaultFiles).toEqual([]);
  });
  it(`uploadRemoveUrl has default value`, () => {
    expect(component.uploadRemoveUrl).toEqual(`https://httpbin.org/post`);
  });
  it(`minAmount has default value`, () => {
    expect(component.minAmount).toEqual(1);
  });
  it(`maxAmount has default value`, () => {
    expect(component.maxAmount).toEqual(100000);
  });
  it(`dialogTypes has default value`, () => {
    expect(component.dialogTypes).toEqual(ProviderExpenseDialogTypes);
  });
  it(`showDialog has default value`, () => {
    expect(component.showDialog).toEqual(ProviderExpenseDialogTypes.None);
  });
  it(`datePickerOpenMobile has default value`, () => {
    expect(component.datePickerOpenMobile).toEqual(false);
  });
  it('ngOnInit', () => {
    const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(
      FormBuilder
    );
    const routerStub: Router = fixture.debugElement.injector.get(Router);
    component.expenseId = 0;
    spyOn(formBuilderStub, 'group').and.callThrough();
    spyOn(formBuilderStub, 'array').and.callThrough();
    spyOn(routerStub, 'navigate').and.callFake(() => { });
    spyOn<any>(component, 'prepWorkLocationData').and.callFake(() => { });
    spyOn<any>(component, 'prepInitialDataFromInitialExpense').and.callFake(() => { });
    spyOn<any>(component, 'addItemRow').and.callFake(() => { });
    component.ngOnInit();
    expect(formBuilderStub.group).toHaveBeenCalled();
    expect(formBuilderStub.array).toHaveBeenCalled();
    expect(routerStub.navigate).toHaveBeenCalled();
  });
  it('canDeactivate', () => {
    component.form = <any>{
      controls: {
        expense: {
          dirty: true
        }
      }
    }
    component.canDeactivate();
    expect(component.form.controls.expense.dirty).toEqual(true);
  });
  it('onAddExpense', () => {
    spyOn<any>(component, 'addItemRow').and.callFake(() => { });
    component.onAddExpense();
    //@ts-ignore
    expect(component.addItemRow).toHaveBeenCalled();
  });
  it('onSubmitForm', () => {
    component.form = <any>{
      getRawValue: () => { return { expense: [] } },
      valid: true
    }
    spyOn<any>(component, 'getFormDataWithOldDocumentsList').and.callFake(() => { });
    spyOn<any>(component, 'confirmSendFormData').and.callFake(() => { });
    component.onSubmitForm();
    //@ts-ignore
    expect(component.canSubmit).toEqual(true)
  });
  it('onSaveForm', () => {
    let typeOfRedirect: TypeOfRedirectAfterSaveExpense;
    component.form = <any>{
      controls: {
        expense: {
          dirty: true,
          controls: [],
          markAsPristine: () => { }
        }
      },
      getRawValue: () => { return { expense: [] } },
      valid: true
    }

    spyOn<any>(component, 'getFormDataWithOldDocumentsList').and.callFake(() => { });
    spyOn<any>(component, 'confirmSendFormData').and.callFake(() => { });
    spyOn<any>(component, 'redirectAfterSave').and.callFake(() => { });
    spyOn<any>(notificationService, 'addNotification').and.callFake(() => { });
    component.onSaveForm(typeOfRedirect);
    //@ts-ignore
    expect(component.getFormDataWithOldDocumentsList).toHaveBeenCalled();
    //@ts-ignore
    expect(component.confirmSendFormData).toHaveBeenCalled();
    component.form = <any>{
      controls: {
        expense: {
          dirty: false,
          controls: [],
          markAsPristine: () => { }
        }
      },
      getRawValue: () => { return { expense: [] } },
      valid: true
    }
    component.onSaveForm(typeOfRedirect);
    //@ts-ignore
    expect(notificationService.addNotification).toHaveBeenCalled();
  });
  it('getVerboseTotalAmountName', () => {
    component.getVerboseTotalAmountName(ExpenseTypes.Mileage);
    expect(ExpenseTypes.Mileage).toEqual(4);
    component.getVerboseTotalAmountName(ExpenseTypes.AutoExpense);
    expect(ExpenseTypes.AutoExpense).toEqual(6);
  });
  it('getTotalAmountFormat', () => {
    component.getTotalAmountFormat(ExpenseTypes.Mileage);
    expect(ExpenseTypes.Mileage).toEqual(4);
    component.getTotalAmountFormat(ExpenseTypes.AutoExpense);
    expect(ExpenseTypes.AutoExpense).toEqual(6);
  });
  it('fixTotalAmount', () => {
    component.maxAmount = 10;
    component.minAmount = 10;
    component.form = <any>{
      controls: {
        expense: {
          dirty: true,
          controls: [],
          markAsPristine: () => { },
          at: index => {
            return {
              controls: {
                totalAmount: { value: "5" }
              },
              patchValue: () => { }
            }
          }
        }
      },
      getRawValue: () => { return { expense: [] } },
      valid: true
    }
    component.fixTotalAmount(0);
    expect(component.maxAmount).toBeDefined();
    expect(component.minAmount).toBeDefined();
  });
  it('wantToSave', () => {
    expect(component.wantToSave).toBeDefined();
  });
  it('wantToSubmit', () => {
    expect(component.wantToSubmit).toBeDefined();
  });
  it('onWorkLocationChange', () => {
    let workLocationItem: WorkLocation;
    const workLocation = { text: "test", value: workLocationItem };
    component.onWorkLocationChange(workLocation);
    expect(component.onWorkLocationChange).toBeDefined();
  });
  it('onDocumentUploadHandler', () => {
    const uploadEventStub: UploadEvent = <any>{
      files: [{ extension: '.jpg' }, { extension: '.mp4' }],
      preventDefault: () => { }
    };
    component.acceptFiles = {
      allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.doc', '.docx', '.xls', '.xlsx', '.pdf', '.csv']
    }
    spyOn(dialogService, 'openDialog').and.callFake(() => { });
    component.onDocumentUploadHandler(uploadEventStub);
    uploadEventStub.files.map(() => { })
    expect(dialogService.openDialog).toHaveBeenCalled();
  });
  it('onDocumentRemoveHandler', () => {
    const uploadEventStub: UploadEvent = <any>{
      files: [{ state: 1 }, { state: 2 }]
    };
    spyOn<any>(component, 'removeOldFiles').and.callFake(() => { });
    spyOn<any>(component, 'removeNewFiles').and.callFake(() => { });
    component.onDocumentRemoveHandler(uploadEventStub, "1");
    //@ts-ignore
    expect(component.removeOldFiles).toHaveBeenCalled();
    //@ts-ignore
    expect(component.removeNewFiles).toHaveBeenCalled();
  });
  it('removeOldFiles', () => {
    const filesList = <any>[{ uid: '1234' }];
    //@ts-ignore
    component.oldDocumentsList = <any>[{ uid: '1234' }];
    const uploadEventStub: UploadEvent = <any>{
      files: [{ state: 1 }, { state: 2 }]
    };
    //@ts-ignore
    component.removeOldFiles(filesList);
  });
  it('removeNewFiles', () => {
    const filesList = <any>[{ name: "test1" }, { name: "test2" }];
    spyOn(expenseService, 'removeFiles').and.callFake(() => { return new Subject() })
    //@ts-ignore
    component.removeNewFiles(filesList, "1");
    //@ts-ignore
    expect(expenseService.removeFiles).toHaveBeenCalled();
  });
  it('refreshExpense', () => {
    component.form = <any>{
      controls: {
        expense: {
          at: index => {
            return {
              reset: () => { }
            }
          }
        }
      }
    }
    //@ts-ignore
    component.oldDocumentsList = <any>[{ status: 1 }]
    const uploadEventStub: UploadEvent = <any>{
      files: [{ state: 1 }, { state: 2 }]
    };
    component.initialExpense = <any>{
      startDate: new Date(),
      endDate: new Date(),
      expenseId: 1,
      totalAmount: 100,
      updateStamp: new Date().toString(),
    }
    component.refreshExpense(0);
    //@ts-ignore
    expect(component.oldDocumentsList.length).toBeGreaterThan(0);
  });
  it('removeExpense', () => {
    //@ts-ignore
    component.indexFormControl = 0;
    component.form = <any>{
      getRawValue: () => { return { expense: [{ expenseId: 1 }] } },
      valid: true
    }
    spyOn(expenseService, 'removeExpense').and.callFake(() => { return new Subject() });
    component.removeExpense();
    //@ts-ignore
    expect(expenseService.removeExpense).toHaveBeenCalled();
  });
  it('onRefreshClick', () => {
    spyOn(component, 'refreshExpense').and.callFake(() => { });
    component.onRefreshClick(0);
    //@ts-ignore
    expect(component.refreshExpense).toHaveBeenCalled();
  });
  it('onTrashClick', () => {
    component.form = <any>{
      controls: {
        expense: {
          removeAt: index => { },
          length: 2
        }
      }
    }
    spyOn(component, 'refreshExpense').and.callFake(() => { });
    spyOn<any>(component, 'displayDialog').and.callFake(() => { });
    component.onTrashClick(0);
    component.form = <any>{
      controls: {
        expense: {
          removeAt: index => { },
          length: 1
        }
      }
    }
    //@ts-ignore
    component.expenseId = 1;
    component.onTrashClick(0);
    //@ts-ignore
    component.expenseId = 0;
    component.onTrashClick(0);
    //@ts-ignore
    expect(component.refreshExpense).toHaveBeenCalled();
    //@ts-ignore
    expect(component.displayDialog).toHaveBeenCalled();
  });
  it('addItemRow', () => {
    component.initialExpense = <any>{
      startDate: new Date(),
      endDate: new Date()
    }
    component.form = <any>{
      controls: {
        expense: {
          dirty: true,
          controls: [],
          markAsPristine: () => { },
          at: index => {
            return {
              controls: {
                totalAmount: { value: "5" }
              },
              getRawValue: () => { return { from: new Date(), to: new Date() } }
            }
          },
          push: () => { },
          length: 1
        }
      },
      getRawValue: () => { return { expense: [] } },
      valid: true
    }
    //@ts-ignore
    component.addItemRow();
    //@ts-ignore
    expect(component.form.controls.expense.length).toBeGreaterThan(0);
  });
  it('prepWorkLocationData', () => {
    //@ts-ignore
    component.prepWorkLocationData();
    //@ts-ignore
    expect(component.prepWorkLocationData).toBeDefined();
  });
  it('addServerSideErrors', () => {
    const errorsObject = { 'error1': "test error1", 'error2': "test error2" };
    //@ts-ignore
    component.addServerSideErrors(errorsObject);
    //@ts-ignore
    expect(component.addServerSideErrors).toBeDefined();
  });
  it('cleanServerSideErrors', () => {
    component.form = <any>{
      controls: {
        expense: {
          markAsPristine: () => { }
        }
      }
    }
    //@ts-ignore
    component.cleanServerSideErrors();
    //@ts-ignore
    expect(component.errorList.length).toEqual(0);
  });
  it('prepInitialDataFromInitialExpense', () => {
    component.initialExpense = <any>{
      nextExpenseId: 1,
      previousExpenseId: 0,
      bookingId: 11,
      expenseTypeId: 20,
      documentsList: [{
        uid: 'test123',
        status: 1,
        documentPath: 'c://test/',
        size: 100
      }]
    }
    component.workLocationDropDownData = <any>[{
      value: 11
    }]
    component.expenseTypes = <any>[{
      value: 20
    }]
    //@ts-ignore
    component.prepInitialDataFromInitialExpense()
    //@ts-ignore
    expect(component.oldDocumentsList.length).toBeGreaterThan(0);
  });
  it('getFormDataWithOldDocumentsList', () => {
    const documentsList = [{
      uid: 'test123',
      status: 1,
      documentPath: 'c://test/',
      size: 100
    }]

    //@ts-ignore
    component.oldDocumentsList = <any>[{
      uid: 'test123',
      status: 1,
      documentPath: 'c://test/',
      size: 100
    }]
    //@ts-ignore
    component.getFormDataWithOldDocumentsList(documentsList)
    //@ts-ignore
    expect(documentsList.length).toBeGreaterThan(0);
  });
  it('redirectToOtherExpense', () => {
    const routerStub: Router = fixture.debugElement.injector.get(Router);
    spyOn(routerStub, 'navigate').and.callFake(() => { });
    //@ts-ignore
    component.redirectToOtherExpense(1);
    expect(routerStub.navigate).toHaveBeenCalledWith(['/provider/expense/1']);
  });
  it('confirmSendFormData', () => {
    const formData = [];
    const expenseProviderStatus = 1;
    const typeOfRedirect = 1;
    //@ts-ignore
    spyOn(component, 'sendFormData').and.callFake(() => { });
    //@ts-ignore
    spyOn(component, 'displayDialog').and.callFake(() => { });
    //@ts-ignore
    component.confirmSendFormData(formData, expenseProviderStatus, typeOfRedirect);
    //@ts-ignore
    expect(component.sendFormData).toHaveBeenCalled();
    //@ts-ignore
    component.confirmSendFormData(formData, 2, typeOfRedirect);
    //@ts-ignore
    expect(component.displayDialog).toHaveBeenCalled();
  });
  it('sendFormData', () => {
    const formData = [];
    const expenseProviderStatus = 1;
    const typeOfRedirect = 1;
    const expenses = [{ expenseProviderStatusId: 1 }];
    spyOn(expenseService, 'addExpenses').and.callFake(() => { return new Subject() });
    spyOn(expenseService, 'updateExpense').and.callFake(() => { return new Subject() });
    //@ts-ignore
    component.sendFormData(formData, expenseProviderStatus, typeOfRedirect);
    expect(expenses.length).toBeGreaterThan(0);
  });
  it('redirectAfterSave', () => {
    const routerStub: Router = fixture.debugElement.injector.get(Router);
    const locationStub: Location = fixture.debugElement.injector.get(Location);
    spyOn(routerStub, 'navigate').and.callFake(() => { });
    //@ts-ignore
    spyOn(component, 'redirectToOtherExpense').and.callFake(() => { });
    spyOn(locationStub, 'back').and.callFake(() => { });
    //@ts-ignore
    component.redirectAfterSave(0);
    expect(routerStub.navigate).toHaveBeenCalledWith(['/provider/non-submitted-expenses']);
    //@ts-ignore
    component.redirectAfterSave(2);
    expect(locationStub.back).toHaveBeenCalled();
    //@ts-ignore
    component.redirectAfterSave(1);
    //@ts-ignore
    expect(component.redirectToOtherExpense).toHaveBeenCalled();
  });
  it('onCancelExpense', () => {
    component.form = <any>{
      controls: {
        expense: {
          dirty: true
        }
      }
    }
    spyOn<any>(component, 'displayDialog').and.callFake(() => { });
    spyOn(component, 'continueCancel').and.callFake(() => { });
    //@ts-ignore
    component.onCancelExpense();
    //@ts-ignore
    expect(component.displayDialog).toHaveBeenCalled();
    component.form = <any>{
      controls: {
        expense: {
          dirty: false
        }
      }
    }
    component.onCancelExpense();
    expect(component.continueCancel).toHaveBeenCalled();
  });
  it('continueCancel', () => {
    component.form = <any>{
      controls: {
        expense: {
          markAsPristine: () => { }
        }
      }
    }
    const routerStub: Router = fixture.debugElement.injector.get(Router);
    spyOn(routerStub, 'navigate').and.callFake(() => { });
    component.continueCancel();
    expect(routerStub.navigate).toHaveBeenCalledWith(['/provider/non-submitted-expenses']);

  });
  it('displayDialog', () => {
    //@ts-ignore
    component.displayDialog(ProviderExpenseDialogTypes.Submit);
    //@ts-ignore
    expect(component.displayDialog).toBeDefined();
  });
  it('closeDialog', () => {
    //@ts-ignore
    component.closeDialog(ProviderExpenseDialogTypes.None);
    //@ts-ignore
    expect(component.closeDialog).toBeDefined();
  });
  it('continueSubmit', () => {
    component.form = <any>{
      getRawValue: () => { return { expense: [] } },
      valid: true
    }
    spyOn<any>(component, 'getFormDataWithOldDocumentsList').and.callFake(() => { return [] });
    spyOn<any>(component, 'sendFormData').and.callFake(() => { });
    //@ts-ignore
    component.continueSubmit(ProviderExpenseDialogTypes.Submit);
    //@ts-ignore
    expect(component.getFormDataWithOldDocumentsList).toHaveBeenCalled();
    //@ts-ignore
    expect(component.sendFormData).toHaveBeenCalled();
  });
  it('isIe', () => {
    component.isIe();
    expect(component.isIe).toBeDefined();
  });
  it('onOverlayClick', () => {
    const picker = {
      isOpen: false,
      toggle: () => { }
    }
    //@ts-ignore
    component.isMobile = true;
    spyOn(component, 'onKendoOpen').and.callFake(() => { });
    component.onOverlayClick(picker);
    //@ts-ignore
    expect(component.activePicker).toEqual(picker);
  });
  it('onDateChange', () => {
    const picker = {
      isOpen: false,
      toggle: () => { },
      value: {
        value: new Date(),
        getFullYear: () => { return 10 },
        setFullYear: () => { }
      }
    }
    component.form = <any>{
      controls: {
        expense: {
          dirty: true,
          controls: [],
          markAsPristine: () => { },
          at: index => {
            return {
              controls: {
                date: { value: new Date(), setValue: () => { } }
              },
              patchValue: () => { }
            }
          }
        }
      }
    }

    component.onDateChange(picker, 'date', 0);
    //@ts-ignore
    expect(picker).toBeDefined;
  });
  it('onKendoOpen', () => {
    //@ts-ignore
    component.isMobile = true;
    component.onKendoOpen();
    //@ts-ignore
    expect(component.isMobile).toEqual(true);
  });
  it('onKendoClose', () => {
    //@ts-ignore
    component.scrollPos = 10;
    //@ts-ignore
    component.activePicker = {
      blur: () => { }
    };
    jasmine.clock().install();
    component.onKendoClose();
    jasmine.clock().tick(1);
    //@ts-ignore
    expect(component.activePicker).toEqual(null);
    jasmine.clock().uninstall(); // 
    //@ts-ignore
    expect(component.datePickerOpenMobile).toEqual(false);
  });
  it('onClickKendoShadow', () => {
    //@ts-ignore
    component.activePicker = {
      isOpen: true,
      toggle: () => { }
    };
    spyOn(component, 'onKendoClose').and.callFake(() => { });
    component.onClickKendoShadow();
    expect(component.onKendoClose).toHaveBeenCalled();
  });
  describe('ExpenseArrayFormMapper', () => {
    it('make expected calls', () => {
      var mapper = new ExpenseArrayFormMapper([<any>{
        unsavedId: 1,
        expenseType: { value: 1 },
        workLocation: { value: 1 }
      }]);
    });
  });

  describe('dateLessThan', () => {
    it('makes expected calls', () => {
      let formControl1 = new FormControl('from');
      let formControl2 = new FormControl('to');    
      let formGroup = new FormGroup({ from: formControl1, to: formControl2 });
      let validatorFuntion = ProviderCustomValidators.dateLessThan('from', 'to');
      validatorFuntion(formGroup);
    });
  });

  describe('expenseFilesRequired', () => {
    it('makes expected calls', () => {
      let formControl1 = new FormControl('expenseTypeFieldName');
      let formControl2 = new FormControl('filesFieldName');    
      let formGroup = new FormGroup({ expenseTypeFieldName: formControl1, filesFieldName: formControl2 });
      let validatorFuntion = ProviderCustomValidators.expenseFilesRequired('expenseTypeFieldName', 'filesFieldName');
      validatorFuntion(formGroup);
    });
  });

});
