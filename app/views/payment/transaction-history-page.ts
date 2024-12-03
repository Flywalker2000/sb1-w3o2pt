import { NavigatedData, Page } from '@nativescript/core';
import { TransactionHistoryViewModel } from './transaction-history-view-model';

export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object;
  page.bindingContext = new TransactionHistoryViewModel();
}