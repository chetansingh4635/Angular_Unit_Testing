import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'jclt-schedule-list',
  templateUrl: './schedule-list.component.html'
})

export class ScheduleListComponent implements OnInit {

  public isDesktop = true;

  constructor(public breakpointObserver: BreakpointObserver) { }

  public ngOnInit() {
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
}
