import { Observable } from '@nativescript/core';
import { Geolocation } from '@nativescript/geolocation';

export class MapViewModel extends Observable {
  public userLatitude: number = 0;
  public userLongitude: number = 0;
  public isLoading: boolean = false;

  constructor() {
    super();
    this.getCurrentLocation();
  }

  async getCurrentLocation() {
    try {
      this.isLoading = true;
      const location = await Geolocation.getCurrentLocation({
        desiredAccuracy: 3,
        maximumAge: 5000,
        timeout: 10000
      });
      
      this.userLatitude = location.latitude;
      this.userLongitude = location.longitude;
    } catch (error) {
      console.error('Location error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onMapReady(args: any) {
    // TODO: Initialize map and add markers for available hotspots
  }

  onFilterTap() {
    // TODO: Show filter dialog
  }
}