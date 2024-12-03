import { NavigatedData, Page } from '@nativescript/core';
import { ConnectViewModel } from './connect-view-model';

export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object;
  const hotspot = page.navigationContext.hotspot;
  page.bindingContext = new ConnectViewModel(hotspot);
}