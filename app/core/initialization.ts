import { Application } from '@nativescript/core';
import { firebase } from '@nativescript/firebase-core';
import { AuthService } from '../services/auth.service';
import { LocationService } from '../services/location.service';

export async function initializeApp(): Promise<void> {
  try {
    await firebase.initializeApp();
    await AuthService.initialize();
    await LocationService.initialize();
    
    Application.on(Application.exitEvent, () => {
      firebase.app().delete();
    });
  } catch (error) {
    console.error('Initialization error:', error);
    throw error;
  }
}