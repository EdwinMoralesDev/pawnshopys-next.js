import { db, statements } from './index';
import { Product, Store, UserRole } from '@/lib/types';

export async function createUser({
  email,
  name,
  role,
  storeId,
  avatar,
  phone,
}: {
  email: string;
  name: string;
  role: UserRole;
  storeId?: string;
  avatar?: string;
  phone?: string;
}) {
  const id = crypto.randomUUID();
  
  try {
    statements.insertUser.run({
      id,
      email,
      name,
      role,
      store_id: storeId,
      avatar,
      phone,
    });
    
    return statements.getUserById.get(id);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function createStore(store: Omit<Store, 'id'>) {
  const id = crypto.randomUUID();
  
  try {
    statements.insertStore.run({
      id,
      name: store.name,
      description: store.description,
      address: store.location.address,
      lat: store.location.lat,
      lng: store.location.lng,
      phone: store.contact.phone,
      email: store.contact.email,
      website: store.contact.website,
      url: store.url,
    });
    
    return statements.getStoreById.get(id);
  } catch (error) {
    console.error('Error creating store:', error);
    throw error;
  }
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
  const id = crypto.randomUUID();
  
  try {
    statements.insertProduct.run({
      id,
      store_id: product.storeId,
      name: product.name,
      description: product.description,
      category: product.category,
      condition: product.condition,
      price: product.price,
      images: JSON.stringify(product.images),
    });
    
    return statements.getProductById.get(id);
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function toggleFavorite(userId: string, itemId: string, type: 'store' | 'product') {
  try {
    statements.toggleFavorite.run({
      user_id: userId,
      item_id: itemId,
      type,
    });
    
    return true;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
}

// Transaction helper
export function transaction<T>(callback: () => T): T {
  const result = db.transaction(callback)();
  return result;
}