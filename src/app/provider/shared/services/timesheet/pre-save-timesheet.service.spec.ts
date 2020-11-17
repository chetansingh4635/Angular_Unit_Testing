import { TestBed } from '@angular/core/testing';
import { GUIdGeneratorService } from './guid-generator.service';
import { GlobalTimesheetErrorType } from '../../enums/global-timesheet-error-type.enum';
import { PreSaveTimesheetService } from './pre-save-timesheet.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {IGlobalTimesheetError} from '../../models/global-timesheet-error';

describe('PreSaveTimesheetService', () => {
  let service: PreSaveTimesheetService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    const gUIdGeneratorServiceStub = () => ({ getNextGUId: arg => ({}) });
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PreSaveTimesheetService,
        { provide: GUIdGeneratorService, useFactory: gUIdGeneratorServiceStub }
      ]
    });
    service = TestBed.get(PreSaveTimesheetService);
    httpMock = TestBed.get(HttpTestingController);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('getNonShowingErrors', () => {
    it('Should have getNonShowingErrors method', () => {
      expect(service.getNonShowingErrors().length).toBeGreaterThanOrEqual(0);
    });
  });
  describe('getNewTimesheetDetailErrorsId', () => {
    it('Should have getNewTimesheetDetailErrorsId method', () => {
      const gUIdGeneratorServiceStub: GUIdGeneratorService = TestBed.get(
        GUIdGeneratorService
      );
      spyOn(gUIdGeneratorServiceStub, 'getNextGUId').and.callThrough();
      service.getNewTimesheetDetailErrorsId();
      expect(gUIdGeneratorServiceStub.getNextGUId).toHaveBeenCalled();
    });
  });
  describe('addNewErrorForTimesheetDetail', () => {
    it('Should have addNewErrorForTimesheetDetail method', () => {
      spyOn(service, 'addNewErrorForTimesheetDetail').and.callThrough();
      service.addNewErrorForTimesheetDetail(1, 'test message');
      expect(service.addNewErrorForTimesheetDetail).toHaveBeenCalled();
    });
  });
  describe('globalErrorOccurred', () => {
    it('Should have globalErrorOccurred method', () => {
      service.globalErrorOccurred(GlobalTimesheetErrorType.ImpossibleTotalHours);
    });
  });
  describe('globalErrorFixed', () => {
    it('Should have globalErrorFixed method', () => {
      service.globalErrorFixed(GlobalTimesheetErrorType.ImpossibleTotalHours);
    });
  });
  describe('cleanErrorsByTimesheetDetailId', () => {
    it('Should have cleanErrorsByTimesheetDetailId method', () => {
      service.cleanErrorsByTimesheetDetailId(1);
    });
  });
  describe('cleanAllErrors', () => {
    it('Should have cleanAllErrors method ', () => {
      service.cleanAllErrors();
    });
  });
});
