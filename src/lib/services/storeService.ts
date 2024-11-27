import { statements } from '@/lib/db';
import { Store } from '@/lib/types';
import { transaction } from '@/lib/db/utils';

export const storeService = {
  getAll: (): Store[] => {
    const stores = statements.getAllStores.all().map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      location: {
        address: row.address,
        lat: row.lat,
        lng: row.lng,
      },
      contact: {
        phone: row.phone,
        email: row.email,
        website: row.website,
      },
      url: row.url,
    }));
    return stores;
  },

  getById: (id: string): Store | null => {
    const store = statements.getStoreById.get(id);
    if (!store) return null;

    return {
      id: store.id,
      name: store.name,
      description: store.description,
      location: {
        address: store.address,
        lat: store.lat,
        lng: store.lng,
      },
      contact: {
        phone: store.phone,
        email: store.email,
        website: store.website,
      },
      url: store.url,
    };
  },

  create: (data: Omit<Store, 'id'>) => {
    const id = crypto.randomUUID();
    
    transaction(() => {
      statements.insertStore.run({
        id,
        name: data.name,
        description: data.description,
        address: data.location.address,
        lat: data.location.lat,
        lng: data.location.lng,
        phone: data.contact.phone,
        email: data.contact.email,
        website: data.contact.website,
        url: data.url,
      });
    });

    return storeService.getById(id);
  },

  update: (id: string, data: Partial<Store>) => {
    const current = storeService.getById(id);
    if (!current) throw new Error('Store not found');

    transaction(() => {
      statements.updateStore.run({
        id,
        name: data.name || current.name,
        description: data.description || current.description,
        address: data.location?.address || current.location.address,
        lat: data.location?.lat || current.location.lat,
        lng: data.location?.lng || current.location.lng,
        phone: data.contact?.phone || current.contact.phone,
        email: data.contact?.email || current.contact.email,
        website: data.contact?.website || current.contact.website,
        url: data.url || current.url,
      });
    });

    return storeService.getById(id);
  },
};