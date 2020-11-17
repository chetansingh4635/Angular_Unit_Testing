import { Component, OnInit, Renderer2 } from '@angular/core';
import { Queue } from '../../shared/data-structures/queue';
import { DialogConfig } from '../../shared/models/dialog/dialog-config';
import { DialogRef, DialogService as KendoDialogService } from '@progress/kendo-angular-dialog';
import { DialogService } from '../../shared/services/dialog.service';

@Component({
  selector: 'jclt-dialog',
  templateUrl: './dialog.component.html'
})
export class DialogComponent implements OnInit {
  private dialogQueue = new Queue<DialogConfig>();
  private dialogRef: DialogRef = null;

  constructor(
    private kendoDialogService: KendoDialogService,
    private dialogService: DialogService,
    private renderer: Renderer2
  ) {
  }

  ngOnInit() {
    this.dialogService.dialogs$.subscribe(
      (dialogConfig: DialogConfig) => {
        this.dialogQueue.push(dialogConfig);
        this.syncDialog();
      }
    );

    this.dialogService.closeAllDialogs$.subscribe(() => {
      this.closeAllDialogs();
    });
  }

  closeAllDialogs() {
    while (!this.dialogQueue.empty()) {
      this.dialogRef.close();
    }
  }

  public onClose() {
    this.dialogQueue.pop();
    this.syncDialog();
  }

  private syncDialog() {
    if (!this.dialogQueue.empty()) {
      this.openDialog(this.dialogQueue.front());
    }
  }

  private openDialog(dialogConfig: DialogConfig): void {
    this.dialogRef = this.kendoDialogService.open({
      content: dialogConfig.component,
      title: dialogConfig.title,
      actions: dialogConfig.actions.map(action => ({
        text: action.actionButtonText,
        primary: action.primary
      })),
      preventAction: dialogConfig.preventAction
    });

    const dialogInnerComponent = this.dialogRef.content.instance;
    dialogInnerComponent.inputData = dialogConfig.inputData;

    let returnedData = null;
    dialogInnerComponent.outputData.subscribe((value) => {
      returnedData = value;
    });

    this.dialogRef.result.subscribe((value) => {
      const userAction = dialogConfig.actions.find(action => action.actionButtonText === value['text']);
      this.onClose();
      if (userAction) {
        userAction.callbackFn(returnedData);
      } else if (dialogConfig.onClose) {
        dialogConfig.onClose();
      }
    });

    if (dialogConfig.additionalClasses) {
      dialogConfig.additionalClasses.forEach(additionalClass => {
        this.renderer.addClass(this.dialogRef.dialog.location.nativeElement, additionalClass);
      });
    }
  }
}
