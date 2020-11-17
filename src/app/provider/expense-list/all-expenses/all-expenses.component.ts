import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LocalStorageService} from '../../../shared/services/local-storage.service';
import { LoginService } from '../../../shared/services/account/login.service';

@Component({
  selector: 'jclt-all-expenses',
  templateUrl: './all-expenses.component.html'
})
export class AllExpensesComponent implements OnInit {

  public impersonationSubscription;
  public isImpersonating = false;

  constructor(private router: Router,
              private localStorageService: LocalStorageService,
              public loginService: LoginService) { }

  ngOnInit() {
    this.impersonationSubscription = this.loginService.currentlyImpersonating$.subscribe(impersonating => {
      this.isImpersonating = impersonating;
    });
  }

  onCreateNewExpense() {
    this.router.navigate(['/provider/expense/0']);
  }

  get providerHasWorkLocations() {
    return this.localStorageService.getObject('providerHasWorkLocation') as boolean;
  }
}
