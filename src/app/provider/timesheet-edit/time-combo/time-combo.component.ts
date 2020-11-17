import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'jclt-time-combo',
  templateUrl: './time-combo.component.html'
})
export class TimeComboComponent implements OnInit {
  @ViewChild('timeCombo') public timeCombo: any;
  @ViewChild('timeKendo') public timeKendo: any;

  @Input()
  value: Date;
  @Input()
  steps: { minute: number };

  @Output()
  valueChange = new EventEmitter<Date>();

  public isMobile = false;
  public formattedValue: string;
  public initTimeList: Array<string> = [];
  public timeList: Array<string> = []; //current time list

  ngOnInit() {
    this.setInitialFormattedValue();
    this.isMobile = (navigator.userAgent.match(/(Mobi|Android)/) != null);

    if (!this.isMobile) {
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += this.steps.minute) {
          this.initTimeList.push(moment(hour + ':' + minute, 'H:mm').format('h:mm A'));
        }
      }
      this.timeList = this.initTimeList;
    }
  }

  public onKendoChange(value: Date) {
    this.valueChange.emit(value);
  }

  public onOverlayClick() {
    if (this.isMobile && !this.timeKendo.isOpen) {
      this.onKendoOpen();
      this.timeKendo.toggle(true);
    }
  }

  public onFocus() {
    this.timeCombo.toggle(true);
    this.timeCombo.placeholder = 'Start typing or select from list';
  }

  public onBlur() {
    this.timeCombo.placeholder = 'Select Time...';
  }

  public getMoment(val: string) {
    let mom = moment(val, 'h:mm A');
    if (!mom.isValid()) {
      mom = moment(val, 'hmmA');
    }
    return mom;
  }

  public getMomentString(val: string): string {
    let mom = this.getMoment(val);
    return mom.isValid() ? mom.format('h:mm A') : null;
  }

  public onComboChange(val: string) {
    let newMomentValue = this.getMoment(val);
    if (!newMomentValue.isValid()) {
      this.valueChange.emit(null);
      return;
    }

    let absMinDiff = Infinity;
    let closestTime = null;
    this.initTimeList.forEach(timeListItem => {
      const mom = this.getMoment(timeListItem);
      const absDiff = Math.abs(newMomentValue.diff(mom, 'minutes'));
      if (absMinDiff > absDiff) {
        absMinDiff = absDiff;
        closestTime = mom;
      }
    });
    newMomentValue = closestTime;
    this.value = newMomentValue.toDate();
    this.valueChange.emit(this.value);
    setTimeout(() => {
      this.formattedValue = this.getMomentString(newMomentValue.format('h:mm A'));
      this.onFilterChange('');
    }, 100);
  }

  public onFilterChange(filter: string): void {
    if (!filter || filter.length === 0) {
      this.timeList = this.initTimeList;
      return;
    }

    filter = filter.toLocaleLowerCase();

    const isAM = filter.includes('am');
    const isPM = filter.includes('pm');
    const possibleTimeList = this.getPossibleTimeList(filter);

    this.timeList = isPM !== isAM ? possibleTimeList.filter(value => {
      value = value.toLowerCase();
      return isPM === value.includes('pm') && isAM === value.includes('am');
    }) : possibleTimeList;
  }

  private getPossibleTimeList(filterValue: string): Array<string> {
    const countOfColons = (filterValue.match(/:/g) || []).length;
    if (countOfColons > 1) {
      return [];
    }

    if (countOfColons === 1) {
      const parsedTime = this.getMoment(filterValue);
      if (!parsedTime.isValid()) {
        return [];
      } else {
        return this.getFilteredTimeByDisassembledTime(parsedTime.hours(), parsedTime.minutes(), parsedTime.hours() > 12);
      }
    }

    const digitalPart = filterValue.replace(/\D/g, '');

    if (digitalPart.length > 4) {
      return [];
    }

    let result = [];
    for (let i = 0; i < digitalPart.length; i++) {
      const hoursPart = Number.parseInt(digitalPart.slice(0, i + 1));
      const minutesPart = Number.parseInt(digitalPart.slice(i + 1));

      result = result.concat(this.getFilteredTimeByDisassembledTime(hoursPart, minutesPart, hoursPart > 12));
    }
    return result;
  }

  private getFilteredTimeByDisassembledTime(hours: number, minutes: number, isPM: boolean): Array<string> {
    if (hours > 12) {
      hours -= 12;
    }
    if (hours > 12) {
      return [];
    }
    if (minutes >= 60) {
      return [];
    }

    const filterHours = hours ? hours.toString() : '';
    const filterMinutes = minutes ? minutes.toString() : '';

    return this.initTimeList.filter(value => {
      value = value.toLowerCase();
      const splittedValue = value.split(':');
      const valueHours = splittedValue[0];
      const valueMinutes = splittedValue[1];
      return (
        valueHours.startsWith(filterHours) &&
        valueMinutes.startsWith(filterMinutes) &&
        (!isPM || value.includes('pm') === isPM));
    });
  }

  private scrollPos = 0;

  public onKendoOpen() {
    if (this.isMobile && window.matchMedia('(max-width: 619px)').matches) {
      if (navigator.userAgent.match(/(iPod|iPhone)/) && document.documentElement.clientWidth <= window.innerWidth) {
        this.scrollPos = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
        document.body.classList.add('preventTouchScroll');
        document.documentElement.classList.add('preventTouchScroll');
        if (this.scrollPos > 0) {
          document.body.style.top = `-${this.scrollPos}px`;
        }
      } else {
        document.body.classList.add('noScroll');
      }
    }
  }

  public onKendoClose() {
    document.body.classList.remove('preventTouchScroll');
    document.documentElement.classList.remove('preventTouchScroll');
    document.body.classList.remove('noScroll');
    if (this.scrollPos > 0) {
      document.body.style.top = '0';
      document.body.scrollTop = this.scrollPos;
      document.documentElement.scrollTop = this.scrollPos;
      this.scrollPos = 0;
    }

    window.setTimeout(() => {
        this.timeKendo.blur();
      },
      1);
  }

  public onClickKendoShadow() {
    let elements: any = document.querySelectorAll('.timePickerPopup');
    // close pickers if clicked outside
    elements.forEach((el) => {
      el = el.getElementsByClassName('k-time-cancel');
      if (el && el.length > 0) {
        el[0].click();
      }
    });
  }

  private setInitialFormattedValue() {
    const tmpInputValue = moment(this.value);
    if (tmpInputValue.isValid()) {
      this.formattedValue = tmpInputValue.format('h:mm A');
    } else {
      this.formattedValue = '';
    }
  }
}

