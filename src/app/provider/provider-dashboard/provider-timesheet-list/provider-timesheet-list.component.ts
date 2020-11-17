import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProviderDashboardTimesheet } from '../../shared/models/provider-dashboard-timesheet';
import {TimesheetLookupService} from "../../shared/services/timesheet/timesheet-lookup.service";
import {QueryPagingResult} from '../../../shared/da/query-paging-result';
import {Title} from '@angular/platform-browser';

interface IDropdownItem {
  text: string,
  value: string,
}

@Component({
  selector: 'jclt-provider-timesheet-list',
  templateUrl: './provider-timesheet-list.component.html'
})
export class ProviderTimesheetListComponent implements OnInit {
  @ViewChild("cardContainer") public cardContainer: any;
  @ViewChild("cardContainer2") public cardContainer2: any;

  status: string;
  listItems: Array<IDropdownItem> = [
    { text: "All", value: "All" },
    { text: "Current", value: "Current" },
    { text: "Declined", value: "Declined" },
    { text: "Past Due", value: "Past" }
  ];

  public today: Date;
  public pastTimesheets: QueryPagingResult<ProviderDashboardTimesheet>;
  public currentTimesheets: QueryPagingResult<ProviderDashboardTimesheet>;
  public declinedTimesheets: QueryPagingResult<ProviderDashboardTimesheet>;

  public fetchDeclinedCallBack: Function;
  public fetchPastCallBack: Function;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private timesheetLookup: TimesheetLookupService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.status = params['timesheetStatus'];
      const statusName = this.listItems.filter(e => e.value === this.status)[0].text;
      setTimeout(
        () => this.titleService.setTitle(statusName + ' | JCLTTime.com'),
        100
      );
    });

    this.pastTimesheets = this.route.snapshot.data.pastTimesheetsArray;
    this.currentTimesheets = this.route.snapshot.data.currentTimesheetsArray;
    this.declinedTimesheets = this.route.snapshot.data.declinedTimesheetsArray;
    this.today = new Date();

    this.fetchDeclinedCallBack = (pageNum: number) => this.timesheetLookup.getProviderTimesheetList(false, true, pageNum);
    this.fetchPastCallBack = (pageNum: number) => this.timesheetLookup.getProviderTimesheetList(false, false, pageNum);
  }

  declinedDataChanged(data: QueryPagingResult<ProviderDashboardTimesheet>) {
    return this.declinedTimesheets = data;
  }

  pastDataChanged(data: QueryPagingResult<ProviderDashboardTimesheet>) {
    return this.pastTimesheets = data;
  }

}
