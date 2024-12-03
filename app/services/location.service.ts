import { Geolocation, Location } from '@nativescript/geolocation';
import { APP_CONSTANTS } from '../core/constants';

export class LocationService {
  private static hasPermission: boolean = false;

  static async initialize(): Promise<void> {
    try {
      this.hasPermission = await Geolocation.hasPermissions();
      if (!this.hasPermission) {
        this.hasPermission = await Geolocation.requestPermissions();
      }
    } catch (error) {
      console.error('Location permission error:', error);
      throw error;
    }
  }

  static async getCurrentLocation(): Promise<Location> {
    if (!this.hasPermission) {
      throw new Error('Location permission not granted');
    }

    return await Geolocation.getCurrentLocation({
      desiredAccuracy: 3,
      maximumAge: 5000,
      timeout: APP_CONSTANTS.LOCATION_TIMEOUT
    });
  }

  static watchLocation(callback: (location: Location) => void): number {
    return Geolocation.watchLocation(
      callback,
      (error) => console.error('Watch location error:', error),
      {
        desiredAccuracy: 3,
        updateDistance: 10,
        minimumUpdateTime: 1000
      }
    );
  }

  static stopWatching(watchId: number): void {
    Geolocation.clearWatch(watchId);
  }
}