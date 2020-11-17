import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SubmittedTimesheetCardComponent } from './submitted-timesheet-card.component';
import { ActivatedRoute, Router } from '@angular/router';

describe('SubmittedTimesheetsComponent', () => {
    let component: SubmittedTimesheetCardComponent;
    let fixture: ComponentFixture<SubmittedTimesheetCardComponent>;
    beforeEach(() => {
        const activatedRouteStub = () => ({
            snapshot: { data: { submittedTimesheetsArray: {} } }
        });
        const routerStub = () => ({ navigate: array => ({}) });
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [SubmittedTimesheetCardComponent],
            providers: [
                { provide: ActivatedRoute, useFactory: activatedRouteStub },
                { provide: Router, useFactory: routerStub }
            ]
        });
        fixture = TestBed.createComponent(SubmittedTimesheetCardComponent);
        component = fixture.componentInstance;
    });
    beforeAll(() => {
        window.onunload = () => 'Do not reload pages during tests';
        spyOn(global, 'setTimeout');
    });
    it('can load instance', () => {
        expect(component).toBeTruthy();
    });
    describe('ngOnInit', () => {
        it('can load instance', () => {
            component.timesheetCount = 1;
            component.timesheet = <any>{
                bookingCalendarDaysDetail: <any>[
                    { calendarDayId: new Date('01/01/2020'), startTime: new Date('01/01/2020  01:10:00'), endTime: new Date('01/01/2020  07:10:00'), rateTypeName: 'rate', totalHours: 1 },
                    { calendarDayId: new Date('01/02/2020'), startTime: new Date('01/02/2020  01:10:00'), endTime: new Date('01/02/2020  07:10:00'), rateTypeName: 'rate', totalHours: 1 },
                    { calendarDayId: new Date('01/03/2020'), startTime: new Date('01/03/2020  01:10:00'), endTime: new Date('01/03/2020  07:10:00'), rateTypeName: 'rate', totalHours: 1 },
                    { calendarDayId: new Date('01/04/2020'), startTime: new Date('01/04/2020  01:10:00'), endTime: new Date('01/04/2020  07:10:00'), rateTypeName: 'rate', totalHours: 1 },
                    { calendarDayId: new Date('01/05/2020'), startTime: new Date('01/05/2020  01:10:00'), endTime: new Date('01/05/2020  07:10:00'), rateTypeName: 'rate', totalHours: 1 }]
            };
            component.ngOnInit();
        });
    });

    describe('timesheetStatuses', () => {
        it('can load instance', () => {
            component.timesheetStatuses;
        });
    });
    describe('totalHours', () => {
        it('can load instance', () => {
            let timesheet = <any>{
                bookingCalendarDaysDetail: <any>[
                    { totalHours: 1 },
                    { totalHours: 2 }]
            };
            expect(component.totalHours(timesheet)).toEqual(3);
        });
    });
    describe('getWeekOf', () => {
        it('can load instance', () => {
            expect(component.getWeekOf(new Date('01/02/2020'))).toEqual('Jan 2 - 8, 2020');
        });
    });
    describe('onToggleCard', () => {
        it('can load instance', () => {
            component.timesheet = <any>{ timesheetId: 1 };
            component.onToggleCard(1);
        });
    });
    describe('getDisplayState', () => {
        it('can load instance', () => {
            component.expandedTimesheetId = 1
            component.timesheet = <any>{ timesheetId: 1 };
            expect(component.getDisplayState()).toEqual(true);
        });
    });
    describe('calendarDayIds', () => {
        it('can load instance', () => {
            let timesheet = <any>{
                bookingCalendarDaysDetail: <any>[
                    { calendarDayId: new Date('01/01/2020') },
                    { calendarDayId: new Date('01/02/2020') },
                    { calendarDayId: new Date('01/03/2020') },
                    { calendarDayId: new Date('01/04/2020') },
                    { calendarDayId: new Date('01/05/2020') }]
            };
            expect(component.calendarDayIds(timesheet)).toBeTruthy();
        });
    });
    describe('getRateTypeNamesByCalendarDayId', () => {
        it('can load instance', () => {
            let timesheet = <any>{
                bookingCalendarDaysDetail: <any>[
                    { calendarDayId: new Date('01/01/2020'), rateTypeName: 'rate' },
                    { calendarDayId: new Date('01/02/2020'), rateTypeName: 'rate' },
                    { calendarDayId: new Date('01/03/2020'), rateTypeName: 'rate' },
                    { calendarDayId: new Date('01/04/2020'), rateTypeName: 'rate' },
                    { calendarDayId: new Date('01/05/2020'), rateTypeName: 'rate' }]
            };
            expect(component.getRateTypeNamesByCalendarDayId(timesheet, new Date('01/01/2020'))).toBeTruthy();
        });
    });
    describe('getInOutEntries', () => {
        it('can load instance', () => {
            let timesheet = <any>{
                bookingCalendarDaysDetail: <any>[
                    { calendarDayId: new Date('01/01/2020'), rateTypeName: 'rate' },
                    { calendarDayId: new Date('01/02/2020'), rateTypeName: 'rate' },
                    { calendarDayId: new Date('01/03/2020'), rateTypeName: 'rate' },
                    { calendarDayId: new Date('01/04/2020'), rateTypeName: 'rate' },
                    { calendarDayId: new Date('01/05/2020'), rateTypeName: 'rate' }]
            };
            expect(component.getInOutEntries(timesheet, new Date('01/01/2020'), 'rate')).toBeTruthy();
        });
    });
    describe('isTimeEntrySpans2Days', () => {
        it('can load instance', () => {
            var day = <any>{ startTime: new Date('10/20/2020') };
            expect(component.isTimeEntrySpans2Days(day)).toEqual(false);
        });
    });
    describe('getNextDayString', () => {
        it('can load instance', () => {
            expect(component.getNextDayString(new Date('10/20/2020'))).toBeTruthy();
        });
    });

});
