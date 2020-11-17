import { Component, OnInit } from '@angular/core';
import { LoginService } from "../../shared/services/account/login.service";

@Component({
  selector: 'jclt-atlas-footer',
  templateUrl: './atlas-footer.component.html'
})
export class AtlasFooterComponent implements OnInit {
  public isUserLoggedIn: boolean = false;

  constructor(public loginService: LoginService) {

  }

  ngOnInit() {
    this.loginService.currentUser$.subscribe(u => {
      this.isUserLoggedIn = !!u;
    });
  }

 

}
