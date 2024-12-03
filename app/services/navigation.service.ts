import { Frame } from '@nativescript/core';

export class NavigationService {
  static navigate(page: string, context?: any): void {
    const frame = Frame.topmost();
    frame.navigate({
      moduleName: page,
      context: context,
      clearHistory: false
    });
  }

  static navigateWithClearHistory(page: string, context?: any): void {
    const frame = Frame.topmost();
    frame.navigate({
      moduleName: page,
      context: context,
      clearHistory: true
    });
  }

  static goBack(): void {
    const frame = Frame.topmost();
    if (frame.canGoBack()) {
      frame.goBack();
    }
  }
}