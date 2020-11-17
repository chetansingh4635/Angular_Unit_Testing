import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NotificationService } from '../../shared/services/ui/notification.service';
import { DialogService } from '../../shared/services/dialog.service';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../../shared/services/account/login.service';
import { ProviderLookupService } from '../shared/services/provider-lookup.service';
import { ProviderProfileComponent } from './provider-profile.component';
describe('ProviderProfileComponent', () => {
  let component: ProviderProfileComponent;
  let fixture: ComponentFixture<ProviderProfileComponent>;
  beforeEach(() => {
    const notificationServiceStub = () => ({ addNotification: arg => ({}) });
    const dialogServiceStub = () => ({ openDialog: object => ({}) });
    const activatedRouteStub = () => ({
      snapshot: {
        data: {
          stateAndSpeciality: <any>[{
            licenses: [
              { licenseTypeId: 1 },
              { licenseTypeId: 2 },
              { licenseTypeId: 3 }
            ],
            specialties: [
              { specialtyId: 1 },
              { specialtyId: 2 },
              { specialtyId: 3 }]
          }]
        }
      }
    });
    const loginServiceStub = () => ({});
    const providerLookupServiceStub = () => ({
      saveProviderLookup: payload => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ProviderProfileComponent],
      providers: [
        { provide: NotificationService, useFactory: notificationServiceStub },
        { provide: DialogService, useFactory: dialogServiceStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: LoginService, useFactory: loginServiceStub },
        {
          provide: ProviderLookupService,
          useFactory: providerLookupServiceStub
        }
      ]
    });
    fixture = TestBed.createComponent(ProviderProfileComponent);
    component = fixture.componentInstance;
  });
  beforeAll(() => {
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`stateData has default value`, () => {
    expect(component.stateData).toEqual([]);
  });
  it(`specialityData has default value`, () => {
    expect(component.specialityData).toEqual([]);
  });
  it(`isSubmitted has default value`, () => {
    expect(component.isSubmitted).toEqual(false);
  });
  it(`isLookupChanged has default value`, () => {
    expect(component.isLookupChanged).toEqual(false);
  });
  it(`stateLicenseTypeId has default value`, () => {
    expect(component.stateLicenseTypeId).toEqual(1);
  });
  describe('ngOnInit', () => {
    it('make expected calls', () => {
      component.ngOnInit();
      expect(component.stateData.length).toEqual(3);
      expect(component.specialityData.length).toEqual(3);
    });
  });
  describe('canDeactivate', () => {
    it('make expected calls', () => {
      expect(component.canDeactivate()).toEqual(true);
    });
  });
  describe('onStateChanged', () => {
    it('make expected calls', () => {
      component.onStateChanged([1, 2, 3]);
      expect(component.isLookupChanged).toEqual(true);
      expect(component.stateData.length).toEqual(3);
    });
  });
  describe('onSpecialityChanged', () => {
    it('make expected calls', () => {
      component.onSpecialityChanged([1, 2, 3]);
      expect(component.isLookupChanged).toEqual(true);
      expect(component.specialityData.length).toEqual(3);
    });
  });
  describe('saveLookups', () => {
    it('make expected calls', () => {
      component.stateData = [1, 2, 3]
      component.specialityData = [1, 2, 3];
      component.stateAndSpeciality = <any>[{
        licenses: [
          { licenseTypeId: 1 },
          { licenseTypeId: 2 },
          { licenseTypeId: 3 }
        ],
        specialties: [
          { specialtyId: 1 },
          { specialtyId: 2 },
          { specialtyId: 3 }]
      }];
      component.saveLookups();
      expect(component.isSubmitted).toEqual(true);
    });
  });
});
