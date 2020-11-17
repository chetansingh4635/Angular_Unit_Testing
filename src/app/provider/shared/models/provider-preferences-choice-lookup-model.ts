export class ProviderPreferencesChoiceLookupModel { 
  public providerId: number;
  public daysPerWeek: number;
  public rate: number;
  public jobTypeList: Array<string>;
  public coverageList: Array<string>;
  public scheduleList: Array<string>;
  public shiftList: Array<string>;
  public workSettingList: Array<string>;
  public patientAgeList: Array<providerPatientAge>; 
}
export class providerPatientAge {
  public patientAgeId: number;
  public fromAge: number;
  public toAge: number;

}


