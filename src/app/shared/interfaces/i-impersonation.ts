export interface IImpersonation {
  isUserLoggedIn: boolean;
  userRole: string;
  stopImpersonating(): void;
  logOut(): void;
}
