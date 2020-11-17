import { Component, Input, OnInit } from '@angular/core';
import { ProviderInfo } from '../../../shared/models/ProviderInfo';
import { TypeOfEditProfile } from '../../../shared/enums/type-of-edit-profile';

@Component({
  selector: 'jclt-edit-user-info-subtitle',
  templateUrl: './edit-user-info-subtitle.component.html'
})
export class EditUserInfoSubtitleComponent implements OnInit {

  @Input() userInfo: ProviderInfo;
  @Input() typeOfEditProfile: TypeOfEditProfile;
  
  ngOnInit() {
  }

  get content(): string {
    switch (this.typeOfEditProfile) {
    case TypeOfEditProfile.ViewProfile:
      return [this.userInfo.salutation, this.userInfo.firstName, this.userInfo.lastName].join(' ');
    case TypeOfEditProfile.EditEmail:
      return `Verify your contact email address`;
    }
  }

  get verifyEmailContent(): string {
    return `Verify your contact email address`;
  }
}
