import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { stores } from '../src/data/stores.js';
import { products } from '../src/data/products.js';
import Database from 'better-sqlite3';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_DIR = join(__dirname, '../data');
const DB_PATH = join(DB_DIR, 'pawnshop.db');

// Initialize database
const db = new Database(DB_PATH, {
  verbose: console.log,
  fileMustExist: false,
});

// Enable WAL mode and foreign keys
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS stores (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    website TEXT,
    url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    store_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    condition TEXT NOT NULL,
    price REAL NOT NULL,
    images TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
  );
`);

// Prepare statements
const insertStore = db.prepare(`
  INSERT OR REPLACE INTO stores (id, name, description, address, lat, lng, phone, email, website, url)
  VALUES (@id, @name, @description, @address, @lat, @lng, @phone, @email, @website, @url)
`);

const insertProduct = db.prepare(`
  INSERT OR REPLACE INTO products (id, store_id, name, description, category, condition, price, images)
  VALUES (@id, @store_id, @name, @description, @category, @condition, @price, @images)
`);

// Run migrations in a transaction
const migrate = db.transaction(() => {
  // Migrate stores
  for (const store of stores) {
    insertStore.run({
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

  // Migrate products
  for (const product of products) {
    insertProduct.run({
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
});

try {
  migrate();
  console.log('Migration completed successfully');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}