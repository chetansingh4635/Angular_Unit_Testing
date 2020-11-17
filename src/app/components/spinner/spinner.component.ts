import {Component, OnInit, Input} from '@angular/core';
import {LongRequestService} from '../../shared/services/long-request.service';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, Event} from '@angular/router';

@Component({
  selector: 'jclt-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  private navigationInProgress = false;
  @Input() forceShow = false;

  constructor(private longRequestService: LongRequestService,
              private router: Router) {
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.navigationInProgress = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.navigationInProgress = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  ngOnInit() {
  }

  public get show(): boolean {
    return this.longRequestService.longRequestProcessed || this.navigationInProgress || this.forceShow;
  }
}
