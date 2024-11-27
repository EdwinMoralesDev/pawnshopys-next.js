import { statements } from '@/lib/db';
import { Product, ProductCategory, ProductCondition } from '@/lib/types';
import { transaction } from '@/lib/db/utils';

export const productService = {
  getAll: (): Product[] => {
    const products = statements.getAllProducts.all().map(row => ({
      ...row,
      images: JSON.parse(row.images),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
    return products;
  },

  getById: (id: string): Product | null => {
    const product = statements.getProductById.get(id);
    if (!product) return null;
    
    return {
      ...product,
      images: JSON.parse(product.images),
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    };
  },

  getByStoreId: (storeId: string): Product[] => {
    const products = statements.getProductsByStoreId.all(storeId).map(row => ({
      ...row,
      images: JSON.parse(row.images),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
    return products;
  },

  getByCategory: (category: ProductCategory): Product[] => {
    const products = statements.getProductsByCategory.all(category).map(row => ({
      ...row,
      images: JSON.parse(row.images),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
    return products;
  },

  create: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = crypto.randomUUID();
    
    transaction(() => {
      statements.insertProduct.run({
        id,
        store_id: data.storeId,
        name: data.name,
        description: data.description,
        category: data.category,
        condition: data.condition,
        price: data.price,
        images: JSON.stringify(data.images),
      });
    });

    return productService.getById(id);
  },

  update: (id: string, data: Partial<Product>) => {
    const current = productService.getById(id);
    if (!current) throw new Error('Product not found');

    transaction(() => {
      statements.updateProduct.run({
        id,
        store_id: data.storeId || current.storeId,
        name: data.name || current.name,
        description: data.description || current.description,
        category: data.category || current.category,
        condition: data.condition || current.condition,
        price: data.price || current.price,
        images: JSON.stringify(data.images || current.images),
      });
    });

    return productService.getById(id);
  },

  delete: (id: string) => {
    transaction(() => {
      statements.deleteProduct.run(id);
    });
  },
};