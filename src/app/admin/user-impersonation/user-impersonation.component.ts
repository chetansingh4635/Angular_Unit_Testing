import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../shared/services/ui/notification.service';
import { PopupNotification } from '../../shared/models/notification/popup-notification';
import { NotificationType } from '../../shared/enums/notification/notification-type';
import { Router, ActivatedRoute } from '@angular/router';
import { ApplicationInsightsService } from '../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../shared/constants/application-insights-custom-constants';
import { LoginService } from '../../shared/services/account/login.service';
import { UserLookupService } from '../shared/services/user-lookup.service';
import { DashboardUser } from '../shared/models/dashboard-user';
import { UserResponseMapper } from '../shared/mappers/user-response-mapper'
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'jclt-user-impersonation',
  templateUrl: './user-impersonation.component.html'
})
export class UserImpersonationComponent implements OnInit {

  public form: FormGroup;
  public userFilterType: string;
  public users: Array<DashboardUser> = [];
  public searchResults = true;
  public isSubmittedError = false;
  public filterData: DataSourceRequestState = {
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public filtersList = [
    { id: 'startswith', value: 'Starts with' },
    { id: 'contains', value: 'Contains' },
    { id: 'eq', value: 'Is equal to' },
  ];

  public selectedEmailFilter = { id: 'startswith', value: 'Starts with' };
  public selectedFirstNameFilter = { id: 'startswith', value: 'Starts with' };
  public selectedLastNameFilter = { id: 'startswith', value: 'Starts with' };

  constructor(private fb: FormBuilder,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private userLookupService: UserLookupService,
    private locationStrategy: LocationStrategy,
    public applicationInsightsService: ApplicationInsightsService) { }

  ngOnInit() {
    this.clearState();
    this.form = this.fb.group({
      userName: [''],
      userFirstName: [''],
      userLastName: ['']
    });
    this.userFilterType = this.route.snapshot.data.role;
  }

  clearState() {
    this.users = [];
    this.userFilterType = this.route.snapshot.data.role;
    this.searchResults = true;
  }

  impersonateUser(user) {
    this.loginByUserName(user.email);
  }

  onSubmit(formData) {
    if (formData.userName || formData.userLastName || formData.userFirstName) {
      this.filterData.filter.filters = [];
      if (formData.userName) {
        this.filterData.filter.filters.push({ field: 'email', operator: this.selectedEmailFilter.id, value: formData.userName });
      }
      if (formData.userLastName) {
        this.filterData.filter.filters.push({ field: 'lastName', operator: this.selectedLastNameFilter.id, value: formData.userLastName });
      }
      if (formData.userFirstName) {
        this.filterData.filter.filters.push({ field: 'firstName', operator: this.selectedFirstNameFilter.id, value: formData.userFirstName });
      }
      this.users = [];
      this.searchResults = true;
      this.isSubmittedError = false;
      this.searchByUserName();
    } else {
      this.isSubmittedError = true;
      this.searchResults = true;
      this.users = [];
    }
  }

  loginByUserName(username) {
    //load only current page on browser back btn click
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    });
    //
    this.loginService.loginByEmail(username)
      .subscribe(() => {
        this.notificationService.addNotification(
          new PopupNotification('Login success', NotificationType.Success, 3000)
        );
        this.loginService.getCurrentUser()
          .subscribe(() => {
            var impersonatedUserId = this.loginService.getUserId();
            var impersonatedUserRoleId = this.loginService.getUserRoleId();
            var impersonatorUserId = this.loginService.getAdminUserId();
            if (impersonatorUserId === null || impersonatorUserId === undefined) {
              impersonatorUserId = 1;
            }
              this.applicationInsightsService.logImpersonateUser(ApplicationInsightsCustomDispositionConstants.SUCCESS,
              ApplicationInsightsCustomSourceConstants.USERIMPERSONATIONCOMPONENT,
              impersonatedUserId.toString(),
              impersonatedUserRoleId.toString(),
              impersonatorUserId.toString());
            this.router.navigate([`/${this.loginService.getUserRole()}/dashboard`]);
          });
      },
        error => {
          this.notificationService.addNotification(
            new PopupNotification((error.errors as Array<string>).join('\n'), NotificationType.Danger, 3000)
          );
          var impersonatedUserId = this.loginService.getUserId();
          var impersonatedUserRoleId = this.loginService.getUserRoleId();
          var impersonatorUserId = this.loginService.getAdminUserId();
          if (impersonatorUserId === null || impersonatorUserId === undefined) {
            impersonatorUserId = 1;
          }
          this.applicationInsightsService.logImpersonateUser(ApplicationInsightsCustomDispositionConstants.FAILURE,
            ApplicationInsightsCustomSourceConstants.USERIMPERSONATIONCOMPONENT,
            impersonatedUserId.toString(),
            impersonatedUserRoleId.toString(),
            impersonatorUserId.toString());
        });
    this.clearState();
  }

  searchByUserName() {
    this.userLookupService.getUserList(this.filterData, this.userFilterType).subscribe(
      (response: Array<any>) => {
        if (response != null && response['result'] != null && response['result'].length > 0 && response['result'][0] != null) {
          this.users = new UserResponseMapper(response['result']).serializedData;
          this.searchResults = true;
        } else {
          this.users = [];
          this.searchResults = false;
        }
      },
      error => {
      }
    );
  }

  public handleFilterChange(event, type) {
    switch (type) {
      case 'email': {
        this.selectedEmailFilter = event;
        break;
      }
      case 'lastName': {
        this.selectedLastNameFilter = event;
        break;
      }
      case 'firstName': {
        this.selectedFirstNameFilter = event;
        break;
      }
    }

  }
}
