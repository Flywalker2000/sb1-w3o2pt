import { Observable } from '@nativescript/core';
import { LocationService } from '../../../services/location.service';
import { HotspotService } from '../../../services/hotspot.service';
import { NavigationService } from '../../../services/navigation.service';
import { AuthService } from '../../../services/auth.service';
import { Hotspot } from '../../../models/hotspot.model';
import { APP_CONSTANTS } from '../../../core/constants';

export class MapViewModel extends Observable {
  private locationService: LocationService;
  private hotspotService: HotspotService;
  private authService: AuthService;

  public userLatitude: number = 0;
  public userLongitude: number = 0;
  public mapZoom: number = APP_CONSTANTS.DEFAULT_MAP_ZOOM;
  public isLoading: boolean = false;
  public hotspots: Hotspot[] = [];
  public selectedHotspot: Hotspot | null = null;
  public isProvider: boolean = false;

  constructor() {
    super();
    this.locationService = LocationService.getInstance();
    this.hotspotService = HotspotService.getInstance();
    this.authService = AuthService.getInstance();
    this.initialize();
  }

  async initialize() {
    try {
      const user = await this.authService.getCurrentUser();
      this.isProvider = user?.isProvider || false;
      await this.getCurrentLocation();
      await this.loadHotspots();
    } catch (error) {
      console.error('Initialization error:', error);
    }
  }

  async getCurrentLocation() {
    try {
      this.isLoading = true;
      const location = await this.locationService.getCurrentLocation();
      this.userLatitude = location.latitude;
      this.userLongitude = location.longitude;
      this.notifyPropertyChange('userLatitude', this.userLatitude);
      this.notifyPropertyChange('userLongitude', this.userLongitude);
    } catch (error) {
      console.error('Location error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadHotspots() {
    try {
      this.isLoading = true;
      this.hotspots = await this.hotspotService.getNearbyHotspots(
        this.userLatitude,
        this.userLongitude,
        APP_CONSTANTS.DEFAULT_SEARCH_RADIUS
      );
      this.notifyPropertyChange('hotspots', this.hotspots);
    } catch (error) {
      console.error('Load hotspots error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onMapReady(args: any) {
    const mapView = args.object;
    this.hotspots.forEach(hotspot => {
      mapView.addMarker({
        position: {
          latitude: hotspot.location.latitude,
          longitude: hotspot.location.longitude
        },
        title: hotspot.name,
        snippet: `${hotspot.settings.bandwidth}Mbps - ${hotspot.settings.price}€`,
        userData: { id: hotspot.id }
      });
    });
  }

  onMarkerSelect(args: any) {
    const marker = args.marker;
    const hotspot = this.hotspots.find(h => h.id === marker.userData.id);
    if (hotspot) {
      this.selectedHotspot = hotspot;
      this.notifyPropertyChange('selectedHotspot', this.selectedHotspot);
    }
  }

  onConnectTap() {
    if (this.selectedHotspot) {
      NavigationService.navigate('views/hotspot/connect-page', {
        hotspot: this.selectedHotspot
      });
    }
  }

  onFilterTap() {
    NavigationService.navigate('views/main/filter/filter-page');
  }

  onHistoryTap() {
    if (this.isProvider) {
      NavigationService.navigate('views/provider/hotspots-page');
    } else {
      NavigationService.navigate('views/payment/transaction-history-page');
    }
  }
}