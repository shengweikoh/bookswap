# Database Seeding

This directory contains the database seeding system for the BookSwap application.

## Files

- **`seed.ts`** - Main seeding functions and data
- **`../scripts/seed.ts`** - Command-line script for running seeds

## Usage

### Via npm scripts (recommended):

```bash
npm run seed        # Seed the database with sample data
npm run seed:reset  # Clear database and reseed with fresh data
npm run seed:clear  # Clear all data from database
```

### Via Prisma (automatic during setup):

```bash
npx prisma db seed  # Uses the prisma.seed configuration
```

## Sample Data

The seeding system creates:

### Users (4 total)
- **John Smith** (`john@example.com`) - Science Fiction, Fantasy, Mystery
- **Jane Doe** (`jane@example.com`) - Classic Literature, Romance  
- **Sarah Wilson** (`sarah@example.com`) - Contemporary Fiction, Self-Help
- **Mike Johnson** (`mike@example.com`) - Biography, History

All users have password: `password123`

### Books (8 total)
- The Great Gatsby
- To Kill a Mockingbird  
- Dune
- The Seven Husbands of Evelyn Hugo
- Atomic Habits
- The Midnight Library
- Educated
- 1984

Books are distributed across users with various conditions (New, Good, Worn).

### Exchange Requests (2 total)
- Pending request for "The Great Gatsby"
- Accepted request for "1984"

### Notifications (4 total)
- Welcome messages
- Exchange notifications
- Status updates

## Functions

### `seedDatabase()`
Populates the database with sample data. Uses upsert operations to avoid conflicts.

### `clearDatabase()`
Removes all data from the database in correct order (respecting foreign key constraints).

### `resetDatabase()`
Combination of clear + seed for fresh start.

## Development

When adding new sample data:

1. Add data definitions to the arrays in `seed.ts`
2. Ensure IDs are unique
3. Test with `npm run seed:reset`
4. Update this README if needed

## Error Handling

The seeding functions include proper error handling and will:
- Log progress during execution
- Display helpful error messages
- Exit with appropriate codes for CI/CD
