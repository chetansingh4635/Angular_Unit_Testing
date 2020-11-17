export class ProviderPreferencesLookupModel {  
  public jobTypes: Array<{ jobTypeId: number, jobTypeName: string }>;
  public schedules: Array<{ scheduleId: number, scheduleDay: string }>;
  public shifts: Array<{ shiftId: number, shiftName: string }>;
  public workSettings: Array<{ workSettingId: number, workSettingName: string }>;
  public patientAge: Array<{ patientAgeId: number, patientAgeName: string }>;
  public coverages: Array<{ coverageId: number, coverageName:string}>;

}
