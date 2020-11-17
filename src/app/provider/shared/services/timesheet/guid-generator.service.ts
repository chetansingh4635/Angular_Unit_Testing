import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GUIdGeneratorService {
  private guidCounter = 100;

  public getNextGUId(makeNegative: boolean) {
    return this.guidCounter++ * (makeNegative ? -1 : 1);
  }
}
