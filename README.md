# BookSwap - Peer-to-Peer Book Exchange Platform

A modern web application for book lovers to exchange books with each other, built with Next.js, PostgreSQL, and Docker.

## 📦 Transfer-Ready Setup

**This project is designed to be easily transferable to other developers.**

### For New Developers:
1. **Clone the repository**
2. **Run `./start.sh`** - That's it!
3. **Access the app** at http://localhost:3000

### What You Get:
- ✅ **Complete Docker setup** - No local dependencies needed
- ✅ **Auto database setup** - PostgreSQL with schema and seed data
- ✅ **One-command startup** - `./start.sh` handles everything
- ✅ **Health checks** - `./health-check.sh` verifies everything works
- ✅ **Comprehensive docs** - README.md and .env.example

### Quick Commands:
```bash
./start.sh           # Start everything
./health-check.sh    # Verify it's working
```

## 🚀 Quick Start

**Prerequisites:**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Git (to clone the repository)

**One-Command Setup:**

```bash
git clone <repository-url>
cd bookswap
chmod +x start.sh
./start.sh
```

That's it! The script will automatically:
- ✅ Check Docker is running
- ✅ Check for port conflicts
- ✅ Build and start Docker containers
- ✅ Set up the PostgreSQL database
- ✅ Apply the database schema
- ✅ Seed the database with initial data
- ✅ Start the Next.js application

The application will be available at **http://localhost:3000**

## 🛠️ What's Included

### Sample Data
The application comes pre-loaded with:
- 2 sample users (John and Jane)
- 3 sample books with different genres and conditions
- 1 sample notification

### Test Accounts
You can use these accounts to test the application:
- **User 1**: john@example.com / password123
- **User 2**: jane@example.com / password123

## 🐳 Docker Setup

The project runs entirely in Docker containers:

- **App Container**: Next.js application (Port 3000)
- **Database Container**: PostgreSQL database (Port 5432)

### Manual Docker Commands

If you prefer manual control:

```bash
# Build and start all services
docker compose up --build -d

# Set up database schema
docker compose exec app npx prisma db push

# Seed database with initial data
docker compose exec app npx prisma db seed

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

## 🔧 Development Commands

### View Logs
```bash
docker compose logs -f        # All services
docker compose logs -f app    # Just the app
docker compose logs -f db     # Just the database
```

### Stop the Application
```bash
docker compose down
```

### Restart the Application
```bash
./start.sh
```

### Reset Database (Clean Slate)
```bash
docker compose down -v
./start.sh
```

### Access Database Directly
```bash
docker compose exec db psql -U bookswap_user -d bookswap_db
```

### Access App Container
```bash
docker compose exec app bash
```

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose
- **Authentication**: JWT-based authentication

## 📁 Project Structure

```
bookswap/
├── start.sh              # One-command setup script
├── health-check.sh       # Health check script
├── .env.example          # Environment variables template
├── docker-compose.yml    # Docker services configuration
├── Dockerfile           # App container configuration
├── app/                 # Next.js app directory
│   ├── api/             # API routes
│   ├── components/      # React components
│   └── pages/           # App pages
├── components/          # Reusable UI components
├── lib/                 # Utility functions and services
│   ├── seed.ts          # Database seeding functions
│   └── ...              # Other utility files
├── prisma/              # Database schema and migrations
│   └── schema.prisma    # Database schema
├── scripts/             # Utility scripts
│   └── seed.ts          # Database seeding script
└── README.md           # This file
```

## 🔧 Development

### Database Operations

```bash
# Access the database directly
docker compose exec db psql -U bookswap_user -d bookswap_db

# Seed database with sample data
docker compose exec app npm run seed

# Reset database (clear and reseed)
docker compose exec app npm run seed:reset

# Clear all database data
docker compose exec app npm run seed:clear

# Reset database schema (careful - this deletes all data!)
docker compose exec app npx prisma db push --force-reset

# Generate Prisma client after schema changes
docker compose exec app npx prisma generate
```

### Database Seeding

The application includes a comprehensive seeding system with sample data:

```bash
# Available seeding commands:
npm run seed        # Add sample data to existing database
npm run seed:reset  # Clear database and add fresh sample data  
npm run seed:clear  # Remove all data from database
```

**Sample Data Includes:**
- 4 sample users with different reading preferences
- 8 books across various genres and conditions
- Exchange requests in different states
- Notification examples

**Sample Login Credentials:**
- `john@example.com` / `password123`
- `jane@example.com` / `password123`
- `sarah@example.com` / `password123`
- `mike@example.com` / `password123`

### Useful Commands

```bash
# View app logs
docker compose logs -f app

# View database logs
docker compose logs -f db

# Access app container shell
docker compose exec app bash

# Restart just the app (after code changes)
docker compose restart app
```

## 📋 Health Check

Run the health check script to verify everything is working:
```bash
./health-check.sh
```

## 🌟 Features

- **Book Exchange**: Users can list books for exchange
- **User Authentication**: Secure login and registration
- **Book Browsing**: Search and filter available books
- **Exchange Requests**: Send and manage book exchange requests
- **Notifications**: Real-time notifications for exchange activities
- **User Profiles**: Manage personal information and book collections
- **Responsive Design**: Works on desktop and mobile

## 🚨 Troubleshooting

### Port Conflicts
If you get "port already in use" errors:
```bash
# Check what's using port 3000
lsof -i :3000

# Check what's using port 5432  
lsof -i :5432

# Kill the process using the port
kill -9 <process-id>

# Stop conflicting services before running ./start.sh
```

### Docker Issues
If Docker containers won't start:
```bash
# Clean up everything
docker compose down -v
docker system prune -f

# Try again
./start.sh
```

### Container Issues
```bash
# Remove all containers and rebuild
docker compose down
docker system prune -f
./start.sh
```

### Permission Issues
If you get permission errors:
```bash
chmod +x start.sh
chmod +x health-check.sh
```

### Database Issues
```bash
# Reset everything and start fresh
docker compose down -v
./start.sh
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Make sure the app runs with `./start.sh`
2. Make your changes
3. Test with `./health-check.sh`
4. Create your feature branch (`git checkout -b feature/amazing-feature`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Run `./health-check.sh` to diagnose problems
3. Check container logs with `docker compose logs`
4. Open an issue in the repository

---

**Happy coding! 🎉**
