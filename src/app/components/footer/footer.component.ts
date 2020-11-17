import { Component, OnInit } from '@angular/core';
import {LoginService} from '../../shared/services/account/login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'jclt-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
  public year: number;
  public isUserLoggedIn: boolean;

  constructor(
    private loginService: LoginService,
    public router: Router
  ) {
  }

  ngOnInit() {
    this.year = new Date().getFullYear();
    this.loginService.currentUser$.subscribe(u => {
      this.isUserLoggedIn = !!u;
    });
  }

  public preventDrag(event): void {
    event.preventDefault();
  }
}
