import {Component, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {Router} from '@angular/router';
import {LoginService} from '../../../shared/services/account/login.service';
import {catchError, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {Roles} from '../../../shared/enums/Roles';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { LocalStorageService } from '../../../shared/services/local-storage.service';

@Component({
  selector: 'jclt-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errors = [];
  loginAttempted = false;
  public showPassDescriptor: Boolean = false;
  public hide: Boolean = false;
  public mouseOnSubmitButton: Boolean = false;
  public isDesktop = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public breakpointObserver: BreakpointObserver,
    private loginService: LoginService,
    private localStorageService: LocalStorageService
  ) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(this.loginService.emailRegex)]],
      password: ['', [Validators.required]]
    });

    this.breakpointObserver
    .observe(['(min-width: 991.98px)'])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isDesktop = true;
      } else {
        this.isDesktop = false;
      }
    });
  }

  onSubmitForm(formData) {
    this.loginAttempted = true;

    if (this.loginForm.valid) {
      this.errors = [];

      this.loginService.login(formData)
        .pipe(
          catchError((error: HttpErrorResponse) => this.onFailureLogin(error)),
          tap(() => this.onSuccessLogin())
        )
        .subscribe();
    }
  }

  private onSuccessLogin() {
    this.loginService.getCurrentUser()
      .subscribe(() => {
        this.router.navigate([`/${this.loginService.getUserRole()}/dashboard`]);
      });
  }

  private onFailureLogin(error: HttpErrorResponse) {
    if (!error.error || !error.error.errors) {
      this.errors = ['The server is not responding'];
    } else {
      this.errors = error.error.errors;
    }
    return throwError('Error occurred');
  }
}
