#!/usr/bin/env node
const { seedDatabase, clearDatabase, resetDatabase } = require('./lib/seed.ts');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const command = process.argv[2];

  try {
    switch (command) {
      case 'seed':
        await seedDatabase();
        break;
      case 'clear':
        await clearDatabase();
        break;
      case 'reset':
        await resetDatabase();
        break;
      default:
        console.log('Usage: npm run seed [seed|clear|reset]');
        console.log('  seed  - Add sample data to the database');
        console.log('  clear - Remove all data from the database');
        console.log('  reset - Clear and then seed the database');
        break;
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
