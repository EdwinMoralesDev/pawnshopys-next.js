import { createContext, useContext, ReactNode } from 'react';
import { Store, UpdateStoreData } from '@/lib/types';
import { useStores } from '@/hooks/useStores';

interface StoreContextType {
  stores: Store[];
  updateStore: (id: string, data: UpdateStoreData) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const storeUtils = useStores();

  return (
    <StoreContext.Provider value={storeUtils}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStoreContext() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStoreContext must be used within a StoreProvider');
  }
  return context;
}