import * as React from 'react';
import { ComponentsState, ErrorComponentsState } from 'piral';
import { Navigation, NavigationMenuItem } from './components/navigation';
import { LoadingIndicator } from './components/loading-indicator';
import { NotificationsToast, NotificationsHost } from './components/notification';
import App from './components/app';
import { ModalDialog, ModalDialogHost } from './components/modal';

/**
 * NotFountエラー時などのレイアウト
 */
export const errors: Partial<ErrorComponentsState> = {
  not_found: () => (
    <div>
      <p className="error">Could not find the requested page</p>
    </div>
  ),
};

/**
 * Piralレイアウト
 */
export const layout: Partial<ComponentsState> = {
  Layout: App,
  MenuContainer: Navigation,
  MenuItem: NavigationMenuItem,
  LoadingIndicator: LoadingIndicator,
  NotificationsToast: NotificationsToast,
  NotificationsHost: NotificationsHost,
  ModalsDialog: ModalDialog,
  ModalsHost: ModalDialogHost
};
