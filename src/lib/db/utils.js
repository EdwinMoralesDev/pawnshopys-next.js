import { db, statements } from './index.js';

export function transaction(callback) {
  return db.transaction(callback)();
}