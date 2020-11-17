import {Component, Input} from '@angular/core';
import {DashboardExpense} from '../../../shared/models/dashboard-expense';
import {PopupNotification} from '../../../../shared/models/notification/popup-notification';
import {NotificationType} from '../../../../shared/enums/notification/notification-type';
import {ExpenseService} from '../../../shared/services/expense/expense.service';
import {NotificationService} from '../../../../shared/services/ui/notification.service';
import {Router} from '@angular/router';
import {ExpenseTypes} from '../../../shared/enums/expense/expense-types';
import {ExpenseProviderStatuses} from '../../../shared/enums/expense/expense-provider-statuses'
import {DialogService} from '../../../../shared/services/dialog.service';
import {SimpleDialogContentComponent} from '../../../../components/dialog/simple-dialog-content/simple-dialog-content.component';
import {ActionTypes} from '../../../../shared/enums/action-types.enum';
import { DialogTypes } from '../../../shared/enums/expense/dialog-types.enum'
import { LoginService } from '../../../../shared/services/account/login.service';

@Component({
  selector: 'jclt-provider-expense-card',
  templateUrl: './provider-expense-card.component.html',
})
export class ProviderExpenseCardComponent {

  @Input()
  public expense: DashboardExpense;

  public expenseTypes = ExpenseTypes;
  public expenseProviderStatuses = ExpenseProviderStatuses;

  public dialogTypes = DialogTypes;
  public showDialog: DialogTypes = DialogTypes.None;
  public errorText: string;
  public impersonationSubscription;
  public isImpersonating = false;
  private currentExpenseId: number;

  constructor(
    private expenseService: ExpenseService,
    private notificationService: NotificationService,
    private router: Router,
    private dialogService: DialogService,
    public loginService: LoginService
  ) {
    this.impersonationSubscription = this.loginService.currentlyImpersonating$.subscribe(impersonating => {
      this.isImpersonating = impersonating;
    });
  }

  private validateExpense():boolean {
    let errorMsg = "";
    if (!this.expense.startDate) {
      errorMsg += "Missing from date <br>";
    }
    if (!this.expense.endDate) {
      errorMsg += "Missing to date <br>";
    }
    if (!this.expense.totalAmount || this.expense.totalAmount < 1) {
      errorMsg += "Missing total amount <br>";
    }
    if (this.expense.isReceiptRequired && (!this.expense.documentList || !this.expense.documentList.length)) {
      errorMsg += "Missing receipt <br>";
    }
    if (errorMsg.length > 0) {
      this.dialogService.openDialog({
        title: 'Failed expense submitting',
        component: SimpleDialogContentComponent,
        inputData: {
            text: errorMsg
        },
        actions: [
          {
            actionType: ActionTypes.Yes,
            actionButtonText: 'OK',
            primary: true,
            callbackFn: () => { }
          }
        ],
        closable: true
      });
      return false;
    }
   return true;
  }

  public submitExpenseById(expenseId: number) {
    if (this.validateExpense()) {
      this.currentExpenseId = expenseId;
      this.displayDialog(DialogTypes.Confirm);
    }
  }

  public continueSubmitting() {
    this.expenseService.submitById(this.currentExpenseId).subscribe(
      () => {
        this.notificationService.addNotification(
          new PopupNotification('Your expense was successfully submitted. All expense submittals are subject to approval prior to reimbursement.', NotificationType.Success, 5000)
        );
        setTimeout(() => window.location.reload(), 5000);  // imperfect solution :(
      },
      (resp) => {
        this.errorText = (Object.keys(resp.error).map(e => resp.error[e])).join('<br>');
        this.displayDialog(DialogTypes.Error);
      }
    );
  }

  public get receiptIsRequired(): boolean {
    return this.expense.expenseTypeId !== ExpenseTypes.Mileage;
  }

  public get verboseTotalAmountName(): string {
    return this.expense.expenseTypeId === ExpenseTypes.Mileage ?
      'Total Mileage' :
      'Total Amount';
  }

  public get datesRangeDisplayingValue(): string {
    return this.expense.startDate !== null && this.expense.endDate !== null ?
      `${this.expense.startDate.toLocaleDateString()}-${this.expense.endDate.toLocaleDateString()}` :
      null;
  }

  private displayDialog(type: DialogTypes) {
    this.showDialog = type;
  }
  public closeDialog() {
    this.showDialog = DialogTypes.None;
  }
}
