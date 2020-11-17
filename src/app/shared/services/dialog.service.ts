import {Injectable} from '@angular/core';
import {DialogConfig} from '../models/dialog/dialog-config';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
} as any)
export class DialogService {
  private dialogsSubject: Subject<DialogConfig> = new Subject<DialogConfig>();
  public dialogs$ = this.dialogsSubject.asObservable();

  private closeAllDialogsSubject: Subject<null> = new Subject<null>();
  public closeAllDialogs$ = this.closeAllDialogsSubject.asObservable();

  openDialog(dialogConfig: DialogConfig): void {
    this.dialogsSubject.next(dialogConfig);
  }

  closeAllDialogs(): void {
    this.closeAllDialogsSubject.next(null);
  }
}
