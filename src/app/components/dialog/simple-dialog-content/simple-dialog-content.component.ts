import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IDialogContentComponent} from '../../../shared/interfaces/components/i-dialog-content-component';

@Component({
  selector: 'jclt-simple-dialog-content',
  templateUrl: './simple-dialog-content.component.html'
})
export class SimpleDialogContentComponent implements OnInit, IDialogContentComponent {

  @Input()
  public inputData: any;

  @Output()
  public outputData = new EventEmitter<boolean>();

  ngOnInit() {
  }
}
