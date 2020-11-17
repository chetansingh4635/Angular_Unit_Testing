import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ProviderInterest } from '../../../shared/models/provider-interest';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import * as uuid from 'uuid';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';


@Component({
  selector: 'jclt-provider-interest-card',
  templateUrl: './provider-interest-card.component.html'
})

export class ProviderInterestCardComponent implements OnInit, OnChanges {
  @Input() providerInterest: ProviderInterest;
  public dateFormat = 'MMM\xa0dd,\xa0yyyy';
  @Output() resetInterests = new EventEmitter();
  public isDesktop = true;
  public isRCMailViewed:boolean = false;
  public isCRCMailViewed:boolean = false;
  public presentDataEnableFlag: Boolean;

  constructor(public breakpointObserver: BreakpointObserver, private localStorageService: LocalStorageService){}
  
  ngOnInit() {
    this.breakpointObserver
    .observe(['(min-width: 991.98px)'])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isDesktop = true;
      } else {
        this.isDesktop = false;
      }
    });
    this.presentDataEnableFlag = this.localStorageService.getObject("presentDataFeatureFlag") as boolean;
  }

  ngOnChanges(e) {
    this.providerInterest['temp_id'] = uuid();
  }

  expandInterest() {
    this.resetInterests.emit(this.providerInterest);
    this.providerInterest['show'] = !this.providerInterest['show'];
  }
}
