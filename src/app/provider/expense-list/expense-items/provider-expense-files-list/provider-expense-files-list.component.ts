import { Component, Input } from '@angular/core';
import { ExpenseDocument } from '../../../shared/models/expense-document';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'jclt-provider-expense-files-list',
  templateUrl: './provider-expense-files-list.component.html',
})
export class ProviderExpenseFilesListComponent {

  @Input()
  documentList: Array<ExpenseDocument>;

  @Input()
  viewAsSubmitted: boolean = false;

  public showFiles: boolean = false;

  public onShowFiles() {
    this.showFiles = !this.showFiles;
  }
  public getDownloadUrlById(expenseDocumentId: number) {
    return `${environment['host']}/api/provider/expense/download?expenseDocumentId=${expenseDocumentId}`;
  }
}
