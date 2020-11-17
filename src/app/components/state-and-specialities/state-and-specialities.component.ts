import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StatesLookup } from '../../shared/models/lookups/states-lookup';
import { SpecialtyLookup } from '../../shared/models/lookups/specialty-lookup';
import { GridDataResult, FilterService, DataStateChangeEvent, RowClassArgs } from '@progress/kendo-angular-grid';
import { FilterDescriptor, CompositeFilterDescriptor, DataSourceRequestState } from '@progress/kendo-data-query';
import { DropDownFilterSettings } from "@progress/kendo-angular-dropdowns";

@Component({
  selector: 'jclt-state-and-specialities',
  templateUrl: './state-and-specialities.component.html'
})
export class StateAndSpecialitiesComponent implements OnInit {

  public stateLookup: Array<StatesLookup>;
  public specialtyLookup: Array<SpecialtyLookup>;
  @Input() stateVisibility:Boolean;
  @Input() specialitiesVisibility:Boolean;
  @Input() selectedStateData:Array<any> = [];
  @Input() selectedSpecialityData:Array<any> = [];
  @Output() onStateChanged = new EventEmitter();
  @Output() onSpecialityChanged = new EventEmitter();
  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: "contains"
  };

  constructor() { }

  ngOnInit() {
    this.stateLookup = JSON.parse(localStorage.getItem('stateLookup'));
    this.specialtyLookup = JSON.parse(localStorage.getItem('specialtyLookup'));    
  }
  

public specialtyChange(values: any[]): void {
  this.onSpecialityChanged.emit(values)
}

public stateChange(values: any[]): void {
  this.onStateChanged.emit(values)  
}
}
