import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {DaysOfWeek} from '../../shared/enums/days-of-week';
import {TimesheetDetailDay} from '../../shared/models/timesheet-detail-day';

@Component({
  selector: 'jclt-copy-from-another-day',
  templateUrl: './copy-from-another-day.component.html'
})
export class CopyFromAnotherDayComponent implements OnInit, OnChanges {
  @Input()
  timesheetDetailDays: Array<TimesheetDetailDay>;
  @Input()
  selectedDay: DaysOfWeek;

  @Output()
  onCopyDay = new EventEmitter<DaysOfWeek>();

  selectedDayForCopy: {value: DaysOfWeek, name: string};
  daysForCopy: Array<{value: DaysOfWeek, name: string}>;
  expanded = false;

  ngOnInit() {
    this.prepDaysForCopy();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.prepDaysForCopy();
  }

  prepDaysForCopy() {
    this.daysForCopy = this.timesheetDetailDays.map(
      timesheetDetailDay => ({value: timesheetDetailDay.weekDay, name: this.daysOfWeekValueToName(timesheetDetailDay.weekDay)})
    ).filter(
      day => day.value !== this.selectedDay
    );
    this.selectedDayForCopy = null;
    this.expanded = false;
  }

  onCopy() {
    this.onCopyDay.emit(this.selectedDayForCopy.value);
  }

  expand() {
    this.expanded = !this.expanded;
  }

  private daysOfWeekValueToName(day: DaysOfWeek): string {
    switch (day) {
      case DaysOfWeek.Sunday:
        return 'Sunday';
      case DaysOfWeek.Monday:
        return 'Monday';
      case DaysOfWeek.Tuesday:
        return 'Tuesday';
      case DaysOfWeek.Wednesday:
        return 'Wednesday';
      case DaysOfWeek.Thursday:
        return 'Thursday';
      case DaysOfWeek.Friday:
        return 'Friday';
      case DaysOfWeek.Saturday:
        return 'Saturday';
    }
  }
}
