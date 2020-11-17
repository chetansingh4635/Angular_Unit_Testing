import { IRouteInfo } from "../i-route-info";
import { ISubRouteInfo } from "../i-subroute-info";

export interface INavigationComponent {
  navExpanded: boolean;
  navExpandedMobile: boolean;
  isMobile: boolean;
  width: number;
  height: number;
  mobileWidth: number;
  faqPath: string;
  menuItems: IRouteInfo[];
  subMenuItems: ISubRouteInfo[];
  initializeMenuItems();
  showByContext(menuItemTitle: string): boolean;
  getSubMenuItemById(subMenuId: string): ISubRouteInfo[];
  getMenuItemVisibility(menuItemTitle: string): boolean;
  onWindowResize(event);
  navLink();
}
