export class ApplicationInsightsCustomPageConstants
{
  public static readonly DASHBOARD = 'Dashboard';
  public static readonly ALL = 'All';
  public static readonly CURRENT = 'Current';
  public static readonly DECLINED = 'Declined';
  public static readonly PAST_DUE = 'Past Due';
  public static readonly SUBMITTED = 'Submitted';
  public static readonly EDIT_EXPENSE = 'Edit Expense';
  public static readonly ALL_EXPENSES = 'All Expenses';
  public static readonly UNSUBMITTED_EXPENSES = 'Unsubmitted Expenses';
  public static readonly SUBMITTED_EXPENSES = 'Submitted Expenses';
  public static readonly ALL_SCHEDULE = 'All Schedule';
  public static readonly MY_INTERESTS = 'My Interests';
  public static readonly MY_OPPORTUNITIES = 'My Opportunities';
  public static readonly RESET_PASSWORD = 'Reset Password';
  public static readonly PREFERENCES = 'Preferences';
  public static readonly FAQ = 'FAQ';
  public static readonly UNAPPROVED_TIMESHEETS = 'Unapproved Timesheets';
  public static readonly APPROVED_TIMESHEETS = 'Approved Timesheets';
  public static readonly DECLINED_TIMESHEETS = 'Declined Timesheets';
  public static readonly LOGIN = 'Login';
  public static readonly RESEND_PDF = 'Resend PDF';
  public static readonly CONTACT_IMPERSONATION = 'Contact Impersonation';
  public static readonly PROVIDER_IMPERSONATION = 'Provider Impersonation';
  public static readonly FORGOT_PASSWORD = 'Forgot Password';
  public static readonly FORGOT_PASSWORD_COMPLETE = 'Forgot Password Complete';
  public static readonly EDIT_TIMESHEET = 'Edit Timesheet';
}

export class ApplicationInsightsCustomEventConstants {
  public static readonly JOBAPPLY = 'JobApply';
  public static readonly JOBVIEW = 'JobView';
  public static readonly CHANGEPASSWORD = 'ChangePassword';
  public static readonly REQUESTCHANGEPASSWORD = 'RequestChangePassword';
  public static readonly RESETPASSWORD = 'ResetPassword';
  public static readonly EXPANDCARDDETAILS = 'ExpandCardDetails';
  public static readonly CLICKPASTTAB = 'ClickPastTab';
  public static readonly EXPANDFAQLISTITEM = 'ExpandFaqListItem';
  public static readonly CREATEADMINUSER = 'CreateAdminUser';
  public static readonly RESENDPDF = 'ResendPdf';
  public static readonly IMPERSONATECONTACT = 'ImpersonateContact';
  public static readonly IMPERSONATEPROVIDER = 'ImpersonateProvider';
  public static readonly STOPIMPERSONATECONTACT = 'StopImpersonateContact';
  public static readonly STOPIMPERSONATEPROVIDER = 'StopImpersonateProvider';
  public static readonly DECLINETIMESHEET = 'DeclineTimesheet';
  public static readonly APPROVETIMESHEET = 'ApproveTimesheet';
  public static readonly UPDATETIMESHEET = 'UpdateTimesheet';
  public static readonly SUBMITTIMESHEET = 'SubmitTimesheet';
}

export class ApplicationInsightsCustomPropertyConstants {
  public static readonly USERID = 'UserId';
  public static readonly USERROLEID = 'UserRoleId';
  public static readonly CUSTOMPAGENAME = 'CustomPageName';
  public static readonly CUSTOMEVENTNAME = 'CustomEventName';
  public static readonly CUSTOMSOURCENAME = 'CustomSourceName';
  public static readonly CUSTOMDISPOSITION = 'CustomDisposition';
  public static readonly JOBOPPORTUNITY = 'JobOpportunity';
  public static readonly ATTEMPTEDEMAIL = 'AttemptedEmail';
  public static readonly QUESTION = 'Question';
  public static readonly IMPERSONATORUSERID = 'ImpersonatorUserId';
  public static readonly EXTERNALBOOKINGID = 'ExternalBookingId';
  public static readonly TIMESHEETDATE = 'TimesheetDate';
  public static readonly IMPERSONATEDUSERID = 'ImpersonatedUserId';
  public static readonly IMPERSONATEDUSERROLEID = 'ImpersonatedUserRoleId';
  public static readonly CLIENTSTATUSID = 'ClientStatusId';
  public static readonly REVIEWCOMMENT = 'ReviewComment';
  public static readonly TIMESHEETID = 'TimesheetId';
  public static readonly IMPERSONATIONREASON = 'ImpersonationReason';
}

export class ApplicationInsightsCustomSourceConstants {
  public static readonly JOBAPPLYBUTTON = 'JobApplyButton';
  public static readonly OPPORTUNITYLISTITEM = 'OpportunityListItem';
  public static readonly FORGOTPASSWORDLINK = 'ForgotPasswordLink';
  public static readonly RESETPASSWORDBUTTON = 'ResetPasswordButton';
  public static readonly FORGOTPASSWORDEMAIL = 'ForgotPasswordEmail';
  public static readonly SCHEDULELISTITEM = 'ScheduleListItem';
  public static readonly SCHEDULELIST = 'ScheduleList';
  public static readonly FAQLIST = 'FaqList';
  public static readonly CREATEADMINUSERCOMPONENT = 'CreateAdminUserComponent';
  public static readonly RESENDPDFCOMPONENT = 'ResendPdfComponent';
  public static readonly USERIMPERSONATIONCOMPONENT = 'UserImpersonationComponent';
  public static readonly SCHEDULEWIDGETCOMPONENT = 'ScheduleWidgetComponent';
  public static readonly PROVIDERINTERESTWIDGETCOMPONENT = 'ProviderInterestWidgetComponent';
  public static readonly PROVIDERINTERESTLIST = 'ProviderInterestList';
  public static readonly ATLASHEADERCOMPONENT = 'AtlasHeaderComponent';
  public static readonly SESSIONWARNINGDIALOGCOMPONENT = 'SessionWarningDialogComponent';
  public static readonly ADMINNAVIGATIONCOMPONENT = 'AdminNavigationComponent';
  public static readonly ATLASNAVIGATIONCOMPONENT = 'AtlasNavigationComponent';
  public static readonly CLIENTNAVIGATIONCOMPONENT = 'ClientNavigationComponent';
  public static readonly PROVIDERNAVIGATIONCOMPONENT = 'ProviderNavigationComponent';
  public static readonly HEADERCOMPONENT = 'HeaderComponent';
}

export class ApplicationInsightsCustomDispositionConstants {
  public static readonly SUCCESS = 'Success';
  public static readonly FAILURE = 'Failure';
}
