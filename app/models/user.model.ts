export interface User {
  id: string;
  email: string;
  name: string;
  isProvider: boolean;
  balance: number;
  createdAt: Date;
}

export interface HotspotSettings {
  bandwidth: number;
  timeLimit?: number;
  dataLimit?: number;
  password: string;
  price: number;
  priceModel: 'monthly' | 'data';
}