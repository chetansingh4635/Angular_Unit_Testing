import { Component, OnInit, HostListener } from '@angular/core';
import { IComponentCanDeactivate } from '../shared/guards/can-deactivate-guard.service';
import { PopupNotification } from '../../shared/models/notification/popup-notification';
import { NotificationType } from '../../shared/enums/notification/notification-type';
import { NotificationService } from '../../shared/services/ui/notification.service';
import { DialogService } from '../../shared/services/dialog.service';
import { SimpleDialogContentComponent } from '../../components/dialog/simple-dialog-content/simple-dialog-content.component';
import { ActionTypes } from '../../shared/enums/action-types.enum';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../../shared/services/account/login.service';
import { ProviderLookupService } from '../shared/services/provider-lookup.service';

@Component({
  selector: 'jclt-provider-profile',
  templateUrl: './provider-profile.component.html'
})
export class ProviderProfileComponent implements OnInit, IComponentCanDeactivate {

  public stateData: Array<number> = [];
  public specialityData: Array<number> = [];
  public isSubmitted = false;
  public isLookupChanged: Boolean = false;
  public stateAndSpeciality: any;
  public stateLicenseTypeId: number = 1;
  constructor(
    private notificationService: NotificationService,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private providerLookupService: ProviderLookupService
  ) { }

  ngOnInit() {
    this.stateAndSpeciality = this.route.snapshot.data.stateAndSpeciality;
    this.stateAndSpeciality[0].licenses.forEach(element => {
      element.licenseTypeId = this.stateLicenseTypeId;
      this.stateData.push(element.stateId);
    });
    this.stateAndSpeciality[0].specialties.forEach(element => {
      this.specialityData.push(element.specialtyId);
    });
  }

  @HostListener('window:beforeunload')
  canDeactivate(): boolean {
    return !this.isLookupChanged;
  }

  public onStateChanged(event) {
    this.isLookupChanged = true;
    this.stateData = event;
  }

  public onSpecialityChanged(event) {
    this.isLookupChanged = true;
    this.specialityData = event;
  }

  public saveLookups() {
    this.isSubmitted = true;
    let payload = {
      Specialties: [],
      Licenses: []
    }
    let tempObject;
    this.stateData.forEach(element => {
      tempObject = this.stateAndSpeciality[0].licenses.find(obj => obj.stateId === element)
      if (tempObject)
        payload.Licenses.push(tempObject);
      else
        payload.Licenses.push({ licenseTypeId: this.stateLicenseTypeId, providerLicenseId: "", stateId: element });
    })

    this.specialityData.forEach(element => {
      tempObject = this.stateAndSpeciality[0].specialties.find(obj => obj.specialtyId === element)
      if (tempObject)
        payload.Specialties.push(tempObject);
      else
        payload.Specialties.push({ providerSpecialtyId: "", specialtyId: element });
    })

    this.providerLookupService.saveProviderLookup(payload)
      .subscribe(
        (data) => {
          this.notificationService.addNotification(
            new PopupNotification('Licenses and Specialities have been saved successfully', NotificationType.Success, 3000)
          );
          this.isLookupChanged = false;
        },
        (err) => {
          console.log("err", err);
          this.dialogService.openDialog({
            title: 'Invalid Data!',
            inputData: {
              text: ('err' ? [] : []).join('\n')
            },
            closable: false,
            component: SimpleDialogContentComponent,
            actions: [
              {
                actionButtonText: 'Ok',
                primary: true,
                callbackFn: () => {
                },
                actionType: ActionTypes.Yes
              }
            ]
          });
        })
  }
}
