import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {ProviderInfo} from '../../shared/models/ProviderInfo';
import {ProviderInfoService} from '../../shared/services/provider-info.service';
import {LoginService} from '../../shared/services/account/login.service';
import {Roles} from '../../shared/enums/Roles';
import {LocalStorageService} from '../../shared/services/local-storage.service';
import { StatesLookup } from '../../shared/models/lookups/states-lookup';
import { SpecialtyLookup } from '../../shared/models/lookups/specialty-lookup';

@Component({
  selector: 'jclt-atlas-provider-dashboard',
  templateUrl: './atlas-provider-dashboard.component.html',
})
export class AtlasProviderDashboardComponent implements OnInit {
  public today: Date;
  public userInfo$: Observable<ProviderInfo>;

  constructor(
    private router: Router,
    private userInfoService: ProviderInfoService,
    private loginService: LoginService,
    private localStorageService: LocalStorageService,
    public route: ActivatedRoute
  ) {}

  private init() {
    this.today = new Date();
  }

  ngOnInit() {   
    this.init();
    this.userInfo$ = this.userInfoService.getUserInfo(this.loginService.getUserId(), Roles.Provider);
    
   // Getting States and Specialities Lookup to store it in Localstorage for smooth access.
   let stateLookup:Array<StatesLookup> = this.route.snapshot.data.states;
   let specialtyLookup: Array<SpecialtyLookup> = this.route.snapshot.data.specialities;
   if(!localStorage.getItem('stateLookup'))
   localStorage.setItem('stateLookup', JSON.stringify(stateLookup));
   if(!localStorage.getItem('specialtyLookup'))
   localStorage.setItem('specialtyLookup', JSON.stringify(specialtyLookup));
   }

  getIsImpersonating(): boolean {
    return this.loginService.getIsImpersonating();
  }
  
  getAtlasRpDashboardEnabled(): boolean {
    var atlasRpEnabled = this.localStorageService.getObject('atlasRpEnabled');
    if (atlasRpEnabled != null) {
      return atlasRpEnabled as boolean;
    }
    return false;
  }

  getIsSyncedRpAndSyncedTneBookings(): boolean {
    var isSyncedRpAndSyncedTneBookings = this.localStorageService.getObject('isSyncedRpAndSyncedTneBookings');
    if (isSyncedRpAndSyncedTneBookings != null) {
      return isSyncedRpAndSyncedTneBookings as boolean;
    }
    return false;
  }

  onViewExpenses() {
    this.router.navigate(['/provider/all-expenses']);
  }

  get providerHasWorkLocations() {
    return this.localStorageService.getObject('providerHasWorkLocation') as boolean;
  }
}
