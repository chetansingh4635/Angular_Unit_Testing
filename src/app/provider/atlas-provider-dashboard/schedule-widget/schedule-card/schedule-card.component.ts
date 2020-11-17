import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProviderSchedule } from '../../../shared/models/provider-schedule';

@Component({
  selector: 'jclt-provider-schedule-card',
  templateUrl: './schedule-card.component.html'
})
export class ProviderScheduleCardComponent implements OnInit {
  @Input() schedule: ProviderSchedule;
  @Output() resetSchedules = new EventEmitter();

  public address: string;
  public dateFormat = 'MMM\xa0dd,\xa0yyyy';
  public expandScheduleStatus: boolean = false;
  public collapse: boolean = false;
  public isRCMailViewed: Boolean = false;
  public isSCMailViewed: Boolean = false;
  ngOnInit() {
    this.address = this.schedule.address1;
    if (this.address.length > 0 && this.schedule.address2.length + this.schedule.address3.length > 0) {
      this.address += ', &nbsp;';
    }
    this.address += this.schedule.address2;
    if (this.schedule.address2.length > 0 && this.schedule.address3.length > 0) {
      this.address += ', &nbsp;';
    }
    this.address += this.schedule.address3;
  }

  expandSchedule() {
    this.resetSchedules.emit(this.schedule);
    this.schedule['show'] = !this.schedule['show'];
  }
}
