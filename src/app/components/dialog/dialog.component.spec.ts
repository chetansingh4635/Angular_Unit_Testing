import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { DialogService } from '../../shared/services/dialog.service';
import { DialogService as KendoDialogService } from '@progress/kendo-angular-dialog';
import { DialogComponent } from './dialog.component';
import { Queue } from 'src/app/shared/data-structures/queue';
import { BehaviorSubject, of } from 'rxjs';
describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  beforeEach(() => {
    const renderer2Stub = () => ({
      addClass: (nativeElement, additionalClass) => ({})
    });
    const kendoDialogServiceStub = () => ({ open: object => ({}) });
    const dialogServiceStub = () => ({
      dialogs$: { subscribe: f => f({}) },
      closeAllDialogs$: { subscribe: f => f({}) }
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [DialogComponent],
      providers: [
        { provide: Renderer2, useFactory: renderer2Stub },
        { provide: KendoDialogService, useFactory: kendoDialogServiceStub },
        { provide: DialogService, useFactory: dialogServiceStub }
      ]
    });
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'closeAllDialogs').and.callFake(() => { });
      //@ts-ignore
      spyOn(component, 'openDialog').and.callFake(() => { });
      component.ngOnInit();
      //@ts-ignore
      expect(component.openDialog).toHaveBeenCalled();
      expect(component.closeAllDialogs).toHaveBeenCalled();
    });
  });
  describe('closeAllDialogs', () => {
    it('makes expected calls', () => {
      //@ts-ignore
      spyOn(component.dialogQueue, 'empty').and.callFake(() => {return true });
      component.closeAllDialogs();
      //@ts-ignore
      expect(component.dialogQueue.empty).toHaveBeenCalled();
	});
  });
  describe('onClose', () => {
    it('makes expected calls', () => {
      //@ts-ignore
      spyOn(component.dialogQueue, 'pop').and.callThrough();
      component.onClose();
      //@ts-ignore
      expect(component.dialogQueue.pop).toHaveBeenCalled();
	});
  });
  describe('openDialog', () => {
    it('makes expected calls', () => {
      const rendererStub: Renderer2 = fixture.debugElement.injector.get(Renderer2);
      let dialogConfigObj =  <any>{
        component: <object>{instance:{inputData:'', outputData:new BehaviorSubject<object>({}).asObservable()}},
        actions: [{actionButtonText :''}],
        title: 'Test',
        preventAction: <any>{},
        inputData: <Object>{},
        additionalClasses: ['test1','']
      };
      spyOn(rendererStub,'addClass').and.callFake(()=>{});
      //@ts-ignore
      spyOn(component.kendoDialogService, 'open').and.callFake(() => {
         return{
          content: dialogConfigObj.component,
          title: dialogConfigObj.title,
          actions: dialogConfigObj.actions.map(action => ({
            text: action.actionButtonText,
            primary: action.primary
          })),
          preventAction: dialogConfigObj.preventAction,
          inputData: dialogConfigObj.inputData,
          result: new BehaviorSubject<object>({}).asObservable(),
          dialog:<any>{location:<any>{}}
        }
      });
      //@ts-ignore
      component.openDialog(dialogConfigObj);
      //@ts-ignore
      expect(component.kendoDialogService.open).toHaveBeenCalled();
	});
  });
  describe('Queue', () => {
    it('make expected calls - push', () => {
      let q = new Queue<object>();
      q.push(<any>{});
    });
    it('make expected calls - pop', () => {
      let q = new Queue<object>();
      q.pop();
    });
    it('make expected calls - front', () => {
      let q = new Queue<object>();
      q.front();
    });
    it('make expected calls - empty', () => {
      let q = new Queue<object>();
      q.empty();
    });
  });
});
