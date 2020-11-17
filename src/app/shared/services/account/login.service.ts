import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import "rxjs/add/operator/map";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import "rxjs-compat/add/operator/do";
import { Router } from "@angular/router";
import { tap } from "rxjs/operators";
import "rxjs-compat/add/operator/share";
import { LocalStorageService } from "../local-storage.service";
import { DialogService } from "../dialog.service";
import { Roles } from "../../enums/Roles";
import { Module } from "../../enums/module";

@Injectable()
export class LoginService {
    constructor(
        private http: HttpClient,
        private router: Router,
        private localStorageService: LocalStorageService,
        private dialogService: DialogService
    ) { }

    public currentUserSubject = new BehaviorSubject<object>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    public isImpersonatingSubject = new BehaviorSubject<boolean>(false);
    public currentlyImpersonating$ = this.isImpersonatingSubject.asObservable();

    private userLogoutSubject = new BehaviorSubject<boolean>(false);
    public userLogOut$ = this.userLogoutSubject.asObservable();

    public browserRefreshSubject = new BehaviorSubject<boolean>(false);
    public browserRefresh$ = this.browserRefreshSubject.asObservable();

    public loginNavigationSubject = new BehaviorSubject<boolean>(false);
    public loginNavigation$ = this.loginNavigationSubject.asObservable();

    public userIsAuthorization = false;

    private userRole: string;
    private userEmail: string;
    private userId: number;
    private adminUserId: number;
    private userFriendlyName: string;
    private adminUserFriendlyName: string;
    public adminUser = "";
    public impersonationOn = false;
    public isLogout = false;

    // ReSharper disable once InconsistentNaming
    public MS_BEFORE_AUTO_LOGOUT;
    public atlasRpEnabled = true;
    private userModuleId: Module = Module.Tne;
    private isSyncedRpAndSyncedTneBookings = false;
    public presentDataFeatureFlag: boolean = false;
    public emailRegex: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([a-zA-Z0-9-]+\.[a-zA-Z]+)+$/;
    public passwordRegex: RegExp = /^(?=.{10,}$)(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!@#$%*]).*$/;
    
    public get atlasRpDashboardEnabled(): boolean {
        return (
            this.atlasRpEnabled && this.userModuleId === Module.RecruitingPlatform
        );
    }

    public get isSyncedRpAndSyncedTneBookingsEnabled(): boolean {
        return this.isSyncedRpAndSyncedTneBookings;
    }

    // to be called in app.component.ts to set value from Web.config
    public initSessionTimeout(timeout: number) {
        this.MS_BEFORE_AUTO_LOGOUT = 1000 * 60 * timeout;
        setInterval(() => {
            if(this.userIsAuthorization)
                this.updateUserAuthorizationStatus();
        }, this.MS_BEFORE_AUTO_LOGOUT / 10);
    }

    login(formData) {
        this.userLogoutSubject.next(false);
        return this.http.post(
            environment["host"] + "/api/account/login",
            formData,
            { withCredentials: true }
        );
    }

    getCurrentUser() {
        return this.http
            .get(environment["host"] + "/api/account/users/getCurrentUserInfo", {
                withCredentials: true
            })
            .pipe(
                tap((response: any) => {
                    var currentUserInfo = response.returnData.user;
                    this.userModuleId = response.returnData.moduleId;
                    this.isSyncedRpAndSyncedTneBookings = response.returnData.isSyncedRpAndSyncedTneBookings;

                    this.localStorageService.setItem("atlasRpEnabled", this.atlasRpEnabled && this.userModuleId === Module.RecruitingPlatform);
                    this.localStorageService.setItem("isSyncedRpAndSyncedTneBookings", this.isSyncedRpAndSyncedTneBookings);
                    this.localStorageService.setItem("presentDataFeatureFlag", this.presentDataFeatureFlag);

                    //Capture userID in Google Analytics
                    if ((window as any).dataLayer) {
                        (window as any).dataLayer.push({ userID: `${currentUserInfo["id"]}` });
                    }

                    this.userId = currentUserInfo["id"];
                    this.userRole = Roles[currentUserInfo["roles"][0].roleId].toLowerCase();
                    this.userEmail = currentUserInfo["email"];
                    this.http
                        .get(
                            environment["host"] +
                            "/api/account/users/GetServerImpersonationUsersInfo",
                            { withCredentials: true }
                        )
                        .subscribe(result => {
                            this.manageImpersonatedUser(result);
                        },
                            err => console.log(err));

                    this.localStorageService.setItem("userRole", this.userRole);
                    this.localStorageService.setItem("userRoleId", currentUserInfo["roles"][0].roleId);
                    this.currentUserSubject.next(currentUserInfo);
                    this.userIsAuthorization = true;
                })
            )
            .share();
    }

    getUserRole() {
        return this.userRole;
    }

    getUserRoleId() {
        return this.localStorageService.getString("userRoleId");
    }

    getUserEmail() {
        return this.userEmail;
    }

    getUserId(): number {
        return this.userId;
    }

    getUserFriendlyName() {
        return this.userFriendlyName;
    }

    getAdminUserId() {
      return this.adminUserId;
    }

    getAdminUserFriendlyName() {
        return this.adminUserFriendlyName;
    }

    getAdminUser() {
        return this.adminUser;
    }

    getIsImpersonating() {
        return this.impersonationOn;
    }

    manageImpersonatedUser(impersonationUserInfo: any) {
        this.adminUserId = impersonationUserInfo.adminUserId;
        this.adminUser = impersonationUserInfo.adminUserEmail;
        this.impersonationOn = impersonationUserInfo.isImpersonating;
        this.userFriendlyName = impersonationUserInfo.currentUserFriendlyName;
        this.adminUserFriendlyName = impersonationUserInfo.adminUserFriendlyName;
        this.isImpersonatingSubject.next(this.impersonationOn);
    }

    loginByEmail(userName: string): Observable<object> {
        return this.http.post(
            environment["host"] + "/api/account/loginByUserName",
            { userName: userName },
            { withCredentials: true }
        );
    }

    stopImpersonation() {
        return this.http.post(
            environment["host"] + "/api/account/loginByUserName",
            { userName: this.getAdminUser() },
            { withCredentials: true }
        );
    }

    logOut() {
        this.userLogoutSubject.next(true);
        return this.http
            .post(environment["host"] + "/api/account/logout", null, {
                withCredentials: true
            })
            .map((r: Response) => {
                this.currentUserSubject.next(null);
                this.localStorageService.removeItem("atlasRpEnabled");
                this.localStorageService.removeItem("userRole");
                this.userRole = "";
                this.isLogout = false;
                this.userIsAuthorization = false;
                return r;
            });
    }



    redirectToDashboard() {
        this.getCurrentUser().subscribe(() => {
            this.router.navigate(["/" + this.userRole + "/dashboard"]);
        });
    }

    private updateUserAuthorizationStatus(): void {
        this.http
            .post(
                `${environment["host"]}/api/account/checkAuthenticationStatus`,
                {},
                { withCredentials: true }
            )
            .subscribe(
                () => {
                    this.userIsAuthorization = true;
                },
                (err) => {
                    if(err.status === 0) return;
                    this.userIsAuthorization = false;
                    this.currentUserSubject.next(null);
                    this.dialogService.closeAllDialogs();

                    if (this.getIsImpersonating()) {
                        this.isImpersonatingSubject.next(false);
                    }
                    if (
                        !this.router.url.startsWith("/account") &&
                        !this.router.url.startsWith("/login")
                    ) {
                        this.router.navigate(["/login"]);
                    }
                }
            );
    }
}
