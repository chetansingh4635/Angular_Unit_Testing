import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    /**
     * Variable to hold our setting.
     */
    public navExpanded: boolean;
    public navExpandedMobile: boolean;

    public toggle(): void {
      this.navExpanded = !this.navExpanded;
    }

    public toggleMobile(): void {
      this.navExpandedMobile = !this.navExpandedMobile;
      let body = document.getElementsByTagName('body')[0];
      if (this.navExpandedMobile) {
        body.classList.add('atlas-mobile-overflow-hidden');   //add the class
      } else {
        body.classList.remove('atlas-mobile-overflow-hidden');  //remove the class
      }
    }
}
