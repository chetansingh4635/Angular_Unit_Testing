import {BookingWeekRateDetail} from './booking-week-rate-detail';

export class TimesheetDetail {
  public bookingRateDetailId?: number;
  public breakTotalHours?: number;
  public calendarDayId: Date;
  public createdOn: Date;
  public endTime: Date;
  public isCall: boolean;
  public isNoCallBack: boolean;
  public rateTypeId: number;
  public startTime: Date;
  public timesheetId: number;
  public timesheetDetailId: number;
  public totalHours: number;
  public totalCallHours?: number;
  public totalPatientHours?: number;
  public updatedOn?: Date;
  public updateStamp: string;
  public customRateTypeName: string;

  constructor(
    bookingWeekRateDetail: BookingWeekRateDetail,
    timesheetId: number,
    selectedDay: Date,
    guid: number
  ) {
    this.bookingRateDetailId = bookingWeekRateDetail.bookingDetailId === 0 ? null : bookingWeekRateDetail.bookingDetailId;
    this.isCall = bookingWeekRateDetail.isCall;
    this.customRateTypeName = bookingWeekRateDetail.customRateTypeName;
    this.timesheetId = timesheetId;
    this.calendarDayId = selectedDay;
    this.isNoCallBack = bookingWeekRateDetail.isCall;
    this.rateTypeId = bookingWeekRateDetail.rateTypeId;
    this.timesheetDetailId = guid;
    this.totalHours = 0;

    this.breakTotalHours = null;
    this.totalPatientHours = null;
    this.startTime = null;
    this.updatedOn = null;
    this.createdOn = null;
    this.endTime = null;
    this.updateStamp = null;
  }
}
