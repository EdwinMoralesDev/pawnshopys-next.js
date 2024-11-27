import { useState, useEffect } from 'react';
import { Product, ProductCategory, ProductCondition } from '@/lib/types';
import { storage } from '@/lib/storage';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const storedProducts = storage.getProducts();
    if (storedProducts.length === 0) {
      // Initialize with sample data if empty
      storage.saveProducts(sampleProducts);
      setProducts(sampleProducts);
    } else {
      setProducts(storedProducts);
    }
  }, []);

  const updateProduct = (updatedProduct: Product) => {
    storage.updateProduct(updatedProduct);
    setProducts(prev => prev.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    ));
  };

  const addProduct = (product: Product) => {
    storage.addProduct(product);
    setProducts(storage.getProducts());
  };

  const deleteProduct = (productId: string) => {
    storage.deleteProduct(productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  return {
    products,
    updateProduct,
    addProduct,
    deleteProduct,
  };
}

// Sample products data
const sampleProducts: Product[] = [
  {
    id: '1',
    storeId: '1',
    name: 'Vintage Rolex Datejust',
    description: 'Authentic 1985 Rolex Datejust in excellent condition',
    category: ProductCategory.WATCHES,
    condition: ProductCondition.GOOD,
    price: 4999.99,
    images: [
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1641069775832-f5d3b5efd089?auto=format&fit=crop&w=600&q=80'
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    storeId: '2',
    name: 'Diamond Tennis Bracelet',
    description: '14K White Gold 2.00 CTW Diamond Tennis Bracelet',
    category: ProductCategory.JEWELRY,
    condition: ProductCondition.LIKE_NEW,
    price: 2499.99,
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80'
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    storeId: '3',
    name: 'MacBook Pro 16"',
    description: '2023 MacBook Pro with M2 Pro chip, 16GB RAM, 512GB SSD',
    category: ProductCategory.ELECTRONICS,
    condition: ProductCondition.LIKE_NEW,
    price: 1899.99,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    storeId: '1',
    name: 'Vintage Gibson Les Paul',
    description: '1969 Gibson Les Paul Custom in Sunburst finish',
    category: ProductCategory.MUSICAL_INSTRUMENTS,
    condition: ProductCondition.GOOD,
    price: 5999.99,
    images: [
      'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?auto=format&fit=crop&w=600&q=80'
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    storeId: '2',
    name: 'Canon EOS R5',
    description: 'Professional mirrorless camera with RF 24-105mm lens',
    category: ProductCategory.ELECTRONICS,
    condition: ProductCondition.GOOD,
    price: 3299.99,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80'
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    storeId: '3',
    name: 'Vintage Omega Speedmaster',
    description: '1969 Omega Speedmaster Professional Moonwatch',
    category: ProductCategory.WATCHES,
    condition: ProductCondition.GOOD,
    price: 8999.99,
    images: [
      'https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&w=600&q=80'
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '7',
    storeId: '1',
    name: 'Fender Stratocaster',
    description: '1964 Fender Stratocaster in Olympic White',
    category: ProductCategory.MUSICAL_INSTRUMENTS,
    condition: ProductCondition.FAIR,
    price: 15999.99,
    images: [
      'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&w=600&q=80'
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '8',
    storeId: '2',
    name: 'Sapphire and Diamond Ring',
    description: '18K White Gold Natural Blue Sapphire Ring with Diamonds',
    category: ProductCategory.JEWELRY,
    condition: ProductCondition.LIKE_NEW,
    price: 4299.99,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80'
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '9',
    storeId: '3',
    name: 'Sony PlayStation 5',
    description: 'PS5 Console with Extra Controller and Games',
    category: ProductCategory.ELECTRONICS,
    condition: ProductCondition.LIKE_NEW,
    price: 599.99,
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80'
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '10',
    storeId: '1',
    name: 'Vintage Leica M3',
    description: '1954 Leica M3 Double Stroke with 50mm Summicron',
    category: ProductCategory.ELECTRONICS,
    condition: ProductCondition.GOOD,
    price: 3999.99,
    images: [
      'https://images.unsplash.com/photo-1493799582117-9a58bc07a8de?auto=format&fit=crop&w=600&q=80'
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '11',
    storeId: '2',
    name: 'Pearl Necklace',
    description: 'Authentic South Sea Pearl Necklace with Diamond Clasp',
    category: ProductCategory.JEWELRY,
    condition: ProductCondition.NEW,
    price: 5999.99,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80'
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '12',
    storeId: '3',
    name: 'Vintage Martin D-28',
    description: '1967 Martin D-28 Acoustic Guitar',
    category: ProductCategory.MUSICAL_INSTRUMENTS,
    condition: ProductCondition.GOOD,
    price: 7999.99,
    images: [
      'https://images.unsplash.com/photo-1555638138-012b9b7f4160?auto=format&fit=crop&w=600&q=80'
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];