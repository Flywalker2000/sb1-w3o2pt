export const APP_CONSTANTS = {
  MIN_PRICE: 1,
  MAX_PRICE: 20,
  DEFAULT_MAP_ZOOM: 15,
  DEFAULT_SEARCH_RADIUS: 5000, // meters
  MIN_PASSWORD_LENGTH: 8,
  MAX_BANDWIDTH: 100, // Mbps
  LOCATION_TIMEOUT: 10000 // ms
};

export const FIREBASE_CONFIG = {
  collections: {
    USERS: 'users',
    HOTSPOTS: 'hotspots',
    TRANSACTIONS: 'transactions'
  }
};