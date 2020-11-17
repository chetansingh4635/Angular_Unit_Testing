import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'jclt-range-dropdown',
  templateUrl: './range-dropdown.component.html'
})
export class RangeDropdownComponent implements OnInit, OnChanges {
  @Input()
  from: number;
  @Input()
  to: number;
  @Input()
  steps: number;
  @Input()
  disabled: boolean;
  @Input()
  value?: number;

  @Output()
  onDropDownChangeValue = new EventEmitter<number>();

  defaultItem = {text: 'Select hours...', value: null};

  defaultValue: { text: string, value?: number };

  dropdownData: Array<{ text: string, value: number }> = [];

  ngOnInit() {
    if (this.value === null) {
      this.defaultValue = this.defaultItem;
    } else {
      this.defaultValue = {text: this.value.toFixed(2), value: this.value};
    }
    this.updateDropdownData();
  }

  onDropDownChange($event: { text: string, value?: number }) {
    this.onDropDownChangeValue.emit($event.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === 'to' || propName === 'from') {
        this.updateDropdownData();
        return;
      }
    }
  }

  private updateDropdownData() {
    this.dropdownData = [];
    for (let i = this.from; i <= this.to; i += this.steps) {
      this.dropdownData.push({text: i.toFixed(2), value: i});
    }
  }
}
