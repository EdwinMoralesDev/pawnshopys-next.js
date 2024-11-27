import { useState, useEffect } from 'react';
import { Store, UpdateStoreData } from '@/lib/types';
import { storeService } from '@/lib/store';
import { stores as initialStores } from '@/data/stores';
import { toast } from 'sonner';

export function useStores() {
  const [stores, setStores] = useState<Store[]>(initialStores);

  useEffect(() => {
    const storedStores = storeService.getStores();
    setStores(storedStores);
  }, []);

  const updateStore = async (id: string, data: UpdateStoreData) => {
    try {
      const updatedStore = storeService.updateStore(id, data);
      setStores(prev => prev.map(store => 
        store.id === id ? updatedStore : store
      ));
      toast.success('Store updated successfully');
    } catch (error) {
      console.error('Failed to update store:', error);
      toast.error('Failed to update store');
      throw error;
    }
  };

  return {
    stores,
    updateStore,
  };
}