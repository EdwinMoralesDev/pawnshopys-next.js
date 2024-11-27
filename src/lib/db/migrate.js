import { seedDatabase } from './seed.js';

// Run migrations and seed data
try {
  seedDatabase();
  console.log('Migration completed successfully');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}