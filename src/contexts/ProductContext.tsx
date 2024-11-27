import { createContext, useContext, ReactNode } from 'react';
import { Product } from '@/lib/types';
import { useProducts } from '@/hooks/useProducts';

interface ProductContextType {
  products: Product[];
  updateProduct: (product: Product) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const productUtils = useProducts();

  return (
    <ProductContext.Provider value={productUtils}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductContext() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
}