import { Product, Store } from './types';

class LocalStorage {
  private static instance: LocalStorage;
  private readonly PRODUCTS_KEY = 'pawnhub_products';
  private readonly STORES_KEY = 'pawnhub_stores';

  private constructor() {
    this.initializeStorage();
  }

  static getInstance(): LocalStorage {
    if (!LocalStorage.instance) {
      LocalStorage.instance = new LocalStorage();
    }
    return LocalStorage.instance;
  }

  private initializeStorage(): void {
    if (!localStorage.getItem(this.PRODUCTS_KEY)) {
      localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.STORES_KEY)) {
      localStorage.setItem(this.STORES_KEY, JSON.stringify([]));
    }
  }

  getProducts(): Product[] {
    const data = localStorage.getItem(this.PRODUCTS_KEY);
    return data ? JSON.parse(data) : [];
  }

  getStores(): Store[] {
    const data = localStorage.getItem(this.STORES_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveProducts(products: Product[]): void {
    localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
  }

  saveStores(stores: Store[]): void {
    localStorage.setItem(this.STORES_KEY, JSON.stringify(stores));
  }

  updateProduct(updatedProduct: Product): void {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === updatedProduct.id);
    
    if (index !== -1) {
      products[index] = {
        ...products[index],
        ...updatedProduct,
        updatedAt: new Date().toISOString()
      };
      this.saveProducts(products);
    }
  }

  addProduct(product: Product): void {
    const products = this.getProducts();
    products.push({
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    this.saveProducts(products);
  }

  deleteProduct(productId: string): void {
    const products = this.getProducts();
    const filteredProducts = products.filter(p => p.id !== productId);
    this.saveProducts(filteredProducts);
  }
}

export const storage = LocalStorage.getInstance();