import { Application } from '@nativescript/core';
import { initializeApp } from './core/initialization';

initializeApp()
  .then(() => {
    Application.run({ moduleName: 'app-root' });
  })
  .catch((error) => {
    console.error('Application initialization failed:', error);
    // Show error dialog to user
  });