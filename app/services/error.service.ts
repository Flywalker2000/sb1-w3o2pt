import { Observable } from '@nativescript/core';

export class ErrorService extends Observable {
  private static instance: ErrorService;

  private constructor() {
    super();
  }

  static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  handleError(error: any, context: string): void {
    console.error(`Error in ${context}:`, error);
    
    const errorMessage = this.formatErrorMessage(error);
    this.notifyPropertyChange('lastError', errorMessage);
    
    // Add error tracking/logging here
  }

  private formatErrorMessage(error: any): string {
    if (error.code) {
      switch (error.code) {
        case 'auth/wrong-password':
          return 'Invalid password';
        case 'auth/user-not-found':
          return 'User not found';
        default:
          return error.message || 'An unexpected error occurred';
      }
    }
    return error.message || 'An unexpected error occurred';
  }
}