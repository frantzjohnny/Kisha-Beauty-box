import { Service, ShopSettings, INITIAL_SERVICES, INITIAL_SETTINGS } from '../types';

const SERVICES_KEY = 'nail_salon_services';
const SETTINGS_KEY = 'nail_salon_settings';

export const StorageService = {
  getServices: (): Service[] => {
    try {
      const data = localStorage.getItem(SERVICES_KEY);
      return data ? JSON.parse(data) : INITIAL_SERVICES;
    } catch (e) {
      console.error("Error reading services", e);
      return INITIAL_SERVICES;
    }
  },

  saveServices: (services: Service[]) => {
    localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
  },

  getSettings: (): ShopSettings => {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? JSON.parse(data) : INITIAL_SETTINGS;
    } catch (e) {
      console.error("Error reading settings", e);
      return INITIAL_SETTINGS;
    }
  },

  saveSettings: (settings: ShopSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }
};