#!/usr/bin/env node

/**
 * Database seeding script
 * 
 * Usage:
 *   npm run seed        # Seed the database
 *   npm run seed:reset  # Clear and reseed the database
 *   npm run seed:clear  # Clear the database
 */

import { seedDatabase, clearDatabase, resetDatabase } from '../lib/seed';

const command = process.argv[2];

async function main() {
  try {
    switch (command) {
      case 'clear':
        await clearDatabase();
        break;
      case 'reset':
        await resetDatabase();
        break;
      default:
        await seedDatabase();
        break;
    }
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

main();
