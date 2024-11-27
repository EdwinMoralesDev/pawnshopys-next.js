import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '../../../data/pawnshop.db');

// Initialize database with better-sqlite3
const db = new Database(DB_PATH, {
  verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
  fileMustExist: false,
});

// Enable WAL mode for better concurrent access
db.pragma('journal_mode = WAL');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    store_id TEXT,
    avatar TEXT,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

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

  CREATE TABLE IF NOT EXISTS favorites (
    user_id TEXT NOT NULL,
    item_id TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, item_id, type),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
  CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
`);

// Prepare commonly used statements
const statements = {
  // Users
  getUserById: db.prepare('SELECT * FROM users WHERE id = ?'),
  getUserByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  insertUser: db.prepare(`
    INSERT INTO users (id, email, name, role, store_id, avatar, phone)
    VALUES (@id, @email, @name, @role, @store_id, @avatar, @phone)
  `),
  updateUser: db.prepare(`
    UPDATE users
    SET name = @name, email = @email, avatar = @avatar, phone = @phone, updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `),

  // Stores
  getStoreById: db.prepare('SELECT * FROM stores WHERE id = ?'),
  getAllStores: db.prepare('SELECT * FROM stores ORDER BY name'),
  insertStore: db.prepare(`
    INSERT INTO stores (id, name, description, address, lat, lng, phone, email, website, url)
    VALUES (@id, @name, @description, @address, @lat, @lng, @phone, @email, @website, @url)
  `),
  updateStore: db.prepare(`
    UPDATE stores
    SET name = @name, description = @description, address = @address, lat = @lat, lng = @lng,
        phone = @phone, email = @email, website = @website, url = @url, updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `),

  // Products
  getProductById: db.prepare('SELECT * FROM products WHERE id = ?'),
  getAllProducts: db.prepare('SELECT * FROM products ORDER BY created_at DESC'),
  getProductsByStoreId: db.prepare('SELECT * FROM products WHERE store_id = ? ORDER BY created_at DESC'),
  getProductsByCategory: db.prepare('SELECT * FROM products WHERE category = ? ORDER BY created_at DESC'),
  insertProduct: db.prepare(`
    INSERT INTO products (id, store_id, name, description, category, condition, price, images)
    VALUES (@id, @store_id, @name, @description, @category, @condition, @price, @images)
  `),
  updateProduct: db.prepare(`
    UPDATE products
    SET name = @name, description = @description, category = @category,
        condition = @condition, price = @price, images = @images, updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `),
  deleteProduct: db.prepare('DELETE FROM products WHERE id = ?'),

  // Favorites
  getFavoritesByUserId: db.prepare('SELECT * FROM favorites WHERE user_id = ?'),
  toggleFavorite: db.prepare(`
    INSERT INTO favorites (user_id, item_id, type)
    VALUES (@user_id, @item_id, @type)
    ON CONFLICT (user_id, item_id, type) DO DELETE
  `),
};

export { db, statements };