import { Observable, Timer } from '@nativescript/core';
import { HotspotService } from '../../services/hotspot.service';
import { NavigationService } from '../../services/navigation.service';

export class ConnectionStatusViewModel extends Observable {
  private hotspotService: HotspotService;
  private updateTimer: Timer;
  private connectionStartTime: Date;

  public hotspot: any;
  public connectionDuration: number = 0;
  public dataUsed: number = 0;
  public currentSpeed: number = 0;
  public isLoading: boolean = false;

  constructor(hotspotId: string) {
    super();
    this.hotspotService = HotspotService.getInstance();
    this.loadHotspotDetails(hotspotId);
    this.startMonitoring();
  }

  async loadHotspotDetails(hotspotId: string) {
    try {
      this.isLoading = true;
      this.hotspot = await this.hotspotService.getHotspotById(hotspotId);
      this.connectionStartTime = new Date();
    } catch (error) {
      console.error('Load hotspot details error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private startMonitoring() {
    this.updateTimer = new Timer(1000, () => this.updateStats());
  }

  private updateStats() {
    // Update connection duration
    this.connectionDuration = (new Date().getTime() - this.connectionStartTime.getTime()) / 1000;
    
    // Simulate data usage and speed (in a real app, these would come from actual measurements)
    this.dataUsed += Math.random() * 0.1; // MB per second
    this.currentSpeed = this.hotspot.settings.bandwidth * (0.8 + Math.random() * 0.2);

    this.notifyPropertyChange('connectionDuration', this.connectionDuration);
    this.notifyPropertyChange('dataUsed', this.dataUsed);
    this.notifyPropertyChange('currentSpeed', this.currentSpeed);
  }

  async onDisconnect() {
    try {
      this.isLoading = true;
      await this.hotspotService.stopConnection(this.hotspot.id);
      this.updateTimer.stop();
      NavigationService.goBack();
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  formatData(mb: number): string {
    if (mb >= 1000) {
      return `${(mb / 1000).toFixed(2)} GB`;
    }
    return `${mb.toFixed(2)} MB`;
  }
}