import { stores } from '@/data/stores';
import { products } from '@/data/products';
import { statements } from './index';
import { transaction } from './utils';

export function seedDatabase() {
  try {
    transaction(() => {
      // Migrate stores
      for (const store of stores) {
        const existingStore = statements.getStoreById.get(store.id);
        if (!existingStore) {
          statements.insertStore.run({
            id: store.id,
            name: store.name,
            description: store.description || null,
            address: store.location.address,
            lat: store.location.lat,
            lng: store.location.lng,
            phone: store.contact.phone,
            email: store.contact.email || null,
            website: store.contact.website || null,
            url: store.url || null,
          });
        }
      }

      // Migrate products
      for (const product of products) {
        const existingProduct = statements.getProductById.get(product.id);
        if (!existingProduct) {
          statements.insertProduct.run({
            id: product.id,
            store_id: product.storeId,
            name: product.name,
            description: product.description,
            category: product.category,
            condition: product.condition,
            price: product.price,
            images: JSON.stringify(product.images),
          });
        }
      }
    });

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}