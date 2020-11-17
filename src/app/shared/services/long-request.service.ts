import {Injectable} from '@angular/core';
import {LongRequestStatus} from '../models/long-request-status';

@Injectable({
  providedIn: 'root'
})
export class LongRequestService {
  public longRequestProcessed: boolean;

  private longRequestStatuses: Array<LongRequestStatus> = [];
  private readonly ShortRequestMaxTime = 500;

  public addRequestUUID(requestUUID: string, isExceptionImmediatelyURL: boolean) {
    this.longRequestStatuses.push({
      sentTime: isExceptionImmediatelyURL ? 0 : Date.now(),
      UUID: requestUUID,
      isLong: false
    });
    if (isExceptionImmediatelyURL) {
      this.checkLongRequests();
    }
    setTimeout(() => {
      this.checkLongRequests();
    }, this.ShortRequestMaxTime);
  }

  public removeRequestUUID(requestUUID: string) {
    this.longRequestStatuses = this.longRequestStatuses.filter(
      requestStatus => requestStatus.UUID !== requestUUID
    );

    this.updateLongRequestProcessed();
  }

  private checkLongRequests() {
    const currentTime = Date.now();
    this.longRequestStatuses = this.longRequestStatuses.map(requestStatus => {
      if (currentTime - requestStatus.sentTime > this.ShortRequestMaxTime) {
        requestStatus.isLong = true;
      }
      return requestStatus;
    });

    this.updateLongRequestProcessed();
  }

  private updateLongRequestProcessed() {
    this.longRequestProcessed = this.longRequestStatuses.some(e => e.isLong);
  }
}
