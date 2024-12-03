import { Observable } from '@nativescript/core';
import { firebase } from '@nativescript/firebase-core';
import { collection, doc, addDoc, updateDoc, query, where, getDocs, getDoc } from '@nativescript/firebase-firestore';
import { Hotspot, HotspotConnection } from '../models/hotspot.model';
import { FIREBASE_CONFIG } from '../core/constants';
import { AuthService } from './auth.service';

export class HotspotService extends Observable {
  private static instance: HotspotService;
  private db = firebase.firestore();
  private authService = AuthService.getInstance();

  private constructor() {
    super();
  }

  static getInstance(): HotspotService {
    if (!HotspotService.instance) {
      HotspotService.instance = new HotspotService();
    }
    return HotspotService.instance;
  }

  async createHotspot(hotspot: Omit<Hotspot, 'id' | 'providerId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const user = this.authService.currentUser;
      if (!user) throw new Error('User not authenticated');

      const hotspotData: Hotspot = {
        ...hotspot,
        id: '',
        providerId: user.uid,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(this.db, FIREBASE_CONFIG.collections.HOTSPOTS), hotspotData);
      return docRef.id;
    } catch (error) {
      console.error('Create hotspot error:', error);
      throw error;
    }
  }

  async getHotspotById(hotspotId: string): Promise<Hotspot | null> {
    try {
      const hotspotRef = doc(this.db, FIREBASE_CONFIG.collections.HOTSPOTS, hotspotId);
      const hotspotDoc = await getDoc(hotspotRef);
      return hotspotDoc.exists() ? { id: hotspotDoc.id, ...hotspotDoc.data() } as Hotspot : null;
    } catch (error) {
      console.error('Get hotspot error:', error);
      throw error;
    }
  }

  async getNearbyHotspots(latitude: number, longitude: number, radius: number): Promise<Hotspot[]> {
    try {
      // In a real app, we'd use geohashing or a specialized geo query
      // For now, we'll get all hotspots and filter client-side
      const hotspotsRef = collection(this.db, FIREBASE_CONFIG.collections.HOTSPOTS);
      const q = query(hotspotsRef, where('status', '==', 'active'));
      const querySnapshot = await getDocs(q);
      
      const hotspots: Hotspot[] = [];
      querySnapshot.forEach(doc => {
        const hotspot = doc.data() as Hotspot;
        const distance = this.calculateDistance(
          latitude,
          longitude,
          hotspot.location.latitude,
          hotspot.location.longitude
        );
        
        if (distance <= radius) {
          hotspots.push(hotspot);
        }
      });
      
      return hotspots;
    } catch (error) {
      console.error('Get nearby hotspots error:', error);
      throw error;
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  async updateHotspotStatus(hotspotId: string, status: 'active' | 'inactive'): Promise<void> {
    try {
      const hotspotRef = doc(this.db, FIREBASE_CONFIG.collections.HOTSPOTS, hotspotId);
      await updateDoc(hotspotRef, {
        status,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Update hotspot status error:', error);
      throw error;
    }
  }
}