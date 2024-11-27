import { Store, UpdateStoreData } from './types';
import { stores as initialStores } from '@/data/stores';

class StoreService {
  private static instance: StoreService;
  private readonly STORES_KEY = 'pawnhub_stores';
  private stores: Store[];

  private constructor() {
    this.stores = this.initializeStorage();
  }

  static getInstance(): StoreService {
    if (!StoreService.instance) {
      StoreService.instance = new StoreService();
    }
    return StoreService.instance;
  }

  private initializeStorage(): Store[] {
    const storedData = localStorage.getItem(this.STORES_KEY);
    if (!storedData) {
      localStorage.setItem(this.STORES_KEY, JSON.stringify(initialStores));
      return initialStores;
    }
    return JSON.parse(storedData);
  }

  getStores(): Store[] {
    return this.stores;
  }

  getStoreById(id: string): Store | null {
    return this.stores.find(store => store.id === id) || null;
  }

  updateStore(id: string, data: UpdateStoreData): Store {
    const index = this.stores.findIndex(store => store.id === id);
    
    if (index === -1) {
      throw new Error('Store not found');
    }

    const updatedStore = {
      ...this.stores[index],
      ...data,
      location: {
        ...this.stores[index].location,
        ...data.location,
      },
      contact: {
        ...this.stores[index].contact,
        ...data.contact,
      },
    };

    this.stores[index] = updatedStore;
    localStorage.setItem(this.STORES_KEY, JSON.stringify(this.stores));
    
    return updatedStore;
  }
}

export const storeService = StoreService.getInstance();