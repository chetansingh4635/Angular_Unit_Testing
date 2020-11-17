﻿import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { LoginService } from './account/login.service';
import { ApplicationInsightsService } from './application-insights.service';

describe('ApplicationInsightsService', () => {
    let service: ApplicationInsightsService;
    beforeEach(() => {
        const routerStub = () => ({
            events: new Observable<Event>()
        });
        const loginServiceStub = () => ({
            getAdminUserId: () => ({}),
            currentUser$: new BehaviorSubject<object>(null).asObservable(),
            currentlyImpersonating$: new BehaviorSubject<object>(null).asObservable()
        });
        TestBed.configureTestingModule({
            providers: [
                ApplicationInsightsService, [
                    { provide: Router, useFactory: routerStub },
                    { provide: LoginService, useFactory: loginServiceStub }
                ]
            ]
        });
        service = TestBed.get(ApplicationInsightsService);
    });
    it('can load instance', () => {
        expect(service).toBeTruthy();
    });
    describe('setUserId', () => {
        it('make expected call', () => {
            //@ts-ignore
            spyOn(service.appInsights, 'setAuthenticatedUserContext').and.callFake(() => { });
            service.setUserId('1');
            //@ts-ignore
            expect(service.appInsights.setAuthenticatedUserContext).toHaveBeenCalled();
        });
    });
    describe('clearUserId', () => {
        it('make expected call', () => {
            //@ts-ignore
            spyOn(service.appInsights, 'clearAuthenticatedUserContext').and.callFake(() => { });
            service.clearUserId();
            //@ts-ignore
            expect(service.appInsights.clearAuthenticatedUserContext).toHaveBeenCalled();
        });
    });
    describe('logPageView', () => {
        it('make expected call', () => {
            //@ts-ignore
            spyOn(service.appInsights, 'trackPageView').and.callFake(() => { });
            service.logPageView('logPageView', 'urlTest');
            //@ts-ignore
            expect(service.appInsights.trackPageView).toHaveBeenCalled();
        });
    });
    describe('logCustomTrackEvent', () => {
        it('make expected call', () => {
            //@ts-ignore
            spyOn(service.appInsights, 'trackEvent').and.callFake(() => { });
            service.logCustomTrackEvent('name', 'orderId', 'specialtyName', 'regionName');
            //@ts-ignore
            expect(service.appInsights.trackEvent).toHaveBeenCalled();
        });
    });
    describe('logJobApplyApplicationInsights', () => {
        it('make expected call', () => {
            //@ts-ignore
            spyOn(service, 'logCustomEvent').and.callFake(() => { });
            service.logJobApplyApplicationInsights('disposition', <any>{});
            //@ts-ignore
            expect(service.logCustomEvent).toHaveBeenCalled();
        });
    });
    describe('logJobViewApplicationInsights', () => {
        it('make expected call', () => {
            //@ts-ignore
            spyOn(service, 'logCustomEvent').and.callFake(() => { });
            service.logJobViewApplicationInsights('disposition', 'customPageName', 'customSourceName', <any>{});
            //@ts-ignore
            expect(service.logCustomEvent).toHaveBeenCalled();
        });
    });
    describe('logForgotPasswordApplicationInsights', () => {
        it('make expected call', () => {
            //@ts-ignore
            spyOn(service, 'logCustomEvent').and.callFake(() => { });
            service.logForgotPasswordApplicationInsights('disposition', 'customPageName', 'customSourceName', 'customEventName', 'emailAddress');
            //@ts-ignore
            expect(service.logCustomEvent).toHaveBeenCalled();
        });
    });
    describe('logResetPasswordApplicationInsights', () => {
        it('make expected call', () => {
            //@ts-ignore
            spyOn(service, 'logCustomEvent').and.callFake(() => { });
            service.logResetPasswordApplicationInsights('disposition', 'customPageName', 'customSourceName');
            //@ts-ignore
            expect(service.logCustomEvent).toHaveBeenCalled();
        });
    });
    describe('logClickPastTabApplicationInsights', () => {
        it('make expected call', () => {
            //@ts-ignore
            spyOn(service, 'logCustomEvent').and.callFake(() => { });
            service.logClickPastTabApplicationInsights('disposition', 'customPageName', 'customSourceName');
            //@ts-ignore
            expect(service.logCustomEvent).toHaveBeenCalled();
        });
    });
    describe('logCreateAdminUserApplicationInsights', () => {
        it('make expected call', () => {
            //@ts-ignore
            spyOn(service, 'logCustomEvent').and.callFake(() => { });
            service.logCreateAdminUserApplicationInsights('disposition', 'customPageName', 'customSourceName', 'emailAttempted');
            //@ts-ignore
            expect(service.logCustomEvent).toHaveBeenCalled();
        });
    });
    describe('logResendPdfApplicationInsights', () => {
        it('make expected call', () => {
            //@ts-ignore
            spyOn(service, 'logCustomEvent').and.callFake(() => { });
            service.logResendPdfApplicationInsights('disposition', 'customPageName', 'customSourceName', 'externalBookingId', 'timesheetDate');
            //@ts-ignore
            expect(service.logCustomEvent).toHaveBeenCalled();
        });
    });
    describe('logImpersonateUser', () => {
        it('make expected call - 2', () => {
            //@ts-ignore
            spyOn(service, 'logCustomEvent').and.callFake(() => { });
            service.logImpersonateUser('disposition', 'customSourceName', 'impersonatedUserId', '2', 'impersonatorUserId');
            //@ts-ignore
            expect(service.logCustomEvent).toHaveBeenCalled();
        });
        it('make expected call - 3', () => {
            //@ts-ignore
            spyOn(service, 'logCustomEvent').and.callFake(() => { });
            service.logImpersonateUser('disposition', 'customSourceName', 'impersonatedUserId', '3', 'impersonatorUserId');
            //@ts-ignore
            expect(service.logCustomEvent).toHaveBeenCalled();
        });
    });
    describe('logStopImpersonateUser', () => {
        it('make expected call - 2', () => {
            //@ts-ignore
            spyOn(service, 'logCustomEvent').and.callFake(() => { });
            service.logStopImpersonateUser('disposition', 'customSourceName', 'impersonatedUserId', '2', 'impersonatorUserId');
            //@ts-ignore
            expect(service.logCustomEvent).toHaveBeenCalled();
        });
        it('make expected call - 3', () => {
            //@ts-ignore
            spyOn(service, 'logCustomEvent').and.callFake(() => { });
            service.logStopImpersonateUser('disposition', 'customSourceName', 'impersonatedUserId', '3', 'impersonatorUserId');
            //@ts-ignore
            expect(service.logCustomEvent).toHaveBeenCalled();
        });
    });
    describe('getUserDataProperties', () => {
        it('make expected calls', () => {
            //@ts-ignore
            service.userId = 1;
            //@ts-ignore
            service.userRoleId = 1;
            //@ts-ignore
            service.isImpersonating = true;
            //@ts-ignore
            service.impersonatorUserId = 2;
            service.getUserDataProperties();
        });
    });
    describe('getActivatedComponent', () => {
        it('make expected calls', () => {
            let snapshot = <any>{ firstChild: { url: '_url' } };
            //@ts-ignore
            service.getActivatedComponent(snapshot);
        });
    });
    describe('getRouteTemplate', () => {
        it('make expected calls', () => {
            let snapshot = <any>{ routeConfig: { path: 'path' }, firstChild: {} };
            //@ts-ignore
            service.getRouteTemplate(snapshot);
        });
    });
});

