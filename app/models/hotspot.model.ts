export interface Hotspot {
  id: string;
  providerId: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  settings: {
    bandwidth: number;
    timeLimit?: number;
    dataLimit?: number;
    password: string;
    price: number;
    priceModel: 'monthly' | 'data';
  };
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface HotspotConnection {
  id: string;
  hotspotId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  dataUsed: number;
  status: 'active' | 'completed' | 'terminated';
}

export interface HotspotStats {
  totalConnections: number;
  totalEarnings: number;
  totalDataUsed: number;
  averageRating: number;
}