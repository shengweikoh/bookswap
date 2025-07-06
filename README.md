# BookSwap - Peer-to-Peer Book Exchange Platform

A modern web application for book lovers to exchange books with each other, built with Next.js, PostgreSQL, and Docker.

## 🚀 Quick Start

**Prerequisites:**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Git (to clone the repository)

**One-Command Setup:**

### Windows Users
```cmd
git clone <repository-url>
cd bookswap
start.bat
```

### macOS/Linux Users
```bash
git clone <repository-url>
cd bookswap
chmod +x start.sh
./start.sh
```

### What the Setup Script Does

Both scripts will automatically:
- ✅ Check Docker is running
- ✅ Check for port conflicts (3000, 5432)
- ✅ Build and start Docker containers
- ✅ Set up the PostgreSQL database
- ✅ Apply the database schema
- ✅ Seed the database with initial data
- ✅ Start the Next.js application

The application will be available at **http://localhost:3000**

### Cross-Platform Support

The project includes setup scripts for both platforms:
- **Windows**: `start.bat` - Double-click to run or execute from Command Prompt
- **Unix/Linux/macOS**: `start.sh` - Run from terminal

Both scripts provide the same functionality:
- Port conflict detection
- Docker service management
- Database setup and seeding
- Error handling and user feedback
- Sample login credentials display

### After Setup

Once either script completes, you can:
- 🌐 **Open your browser** and go to: http://localhost:3000
- 👤 **Login with sample accounts**:
  - Email: `john@example.com`, Password: `password123`
  - Email: `jane@example.com`, Password: `password123`
  - Email: `bob@example.com`, Password: `password123`
  - Email: `alice@example.com`, Password: `password123`

### Troubleshooting

**Port Conflicts:**
- If port 3000 is in use: Stop any local development servers
- If port 5432 is in use: Stop any local PostgreSQL instances

**Docker Issues:**
- Make sure Docker Desktop is running
- Try restarting Docker Desktop if you encounter issues

**Windows-specific:**
- If you get "execution policy" errors, run Command Prompt as Administrator
- Make sure Docker Desktop is set to use Windows containers if needed

**Unix/Linux/macOS-specific:**
```bash
chmod +x start.sh
```

## 🌟 Features

### 📚 Book Management
- **Add Books**: List your books for exchange with photos, descriptions, and condition ratings
- **Book Catalog**: Browse available books with search and filtering capabilities
- **Book Details**: View detailed information including condition, genre, and owner details
- **Availability Status**: Books automatically marked as unavailable when exchanged

### 🔄 Exchange System
- **Exchange Requests**: Send and receive book exchange requests
- **Request Management**: Accept, reject, or cancel exchange requests
- **Exchange History**: Track all past and current exchanges
- **Smart Matching**: See personalized book recommendations based on your interests

### 💬 Communication
- **Real-time Chat**: Built-in messaging system for coordinating exchanges
- **Exchange-specific Conversations**: Separate chat threads for each exchange request
- **Message History**: Persistent chat history for all conversations

### 🔔 Notifications
- **Real-time Notifications**: Instant alerts for new messages and exchange activities
- **Notification Center**: Centralized view of all notifications
- **Activity Tracking**: Get notified when books are requested, accepted, or rejected

### 👤 User Profiles
- **Profile Management**: Update personal information, bio, and reading preferences
- **User Libraries**: View other users' available books
- **Reading Interests**: Specify favorite genres and authors for better recommendations

### 🎨 User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS
- **Fast Loading**: Optimized performance with Next.js and efficient data fetching
- **Secure Authentication**: JWT-based authentication with password hashing

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
├── start.sh                    # One-command setup script
├── health-check.sh             # Health check script
├── docker-compose.yml          # Docker services configuration
├── Dockerfile                  # App container configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── next.config.mjs             # Next.js configuration
├── components.json             # shadcn/ui components configuration
├── app/                        # Next.js app directory (App Router)
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Global styles
│   ├── ClientLayout.tsx        # Client-side layout wrapper
│   ├── api/                    # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   │   ├── login/
│   │   │   ├── logout/
│   │   │   ├── register/
│   │   │   └── me/
│   │   ├── books/              # Book management endpoints
│   │   │   ├── route.ts        # GET (list), POST (create)
│   │   │   ├── [id]/route.ts   # GET, PUT, DELETE specific book
│   │   │   └── user/[userId]/  # Get user's books
│   │   ├── chats/              # Chat system endpoints
│   │   │   ├── route.ts        # GET (list), POST (create)
│   │   │   └── [threadId]/     # Chat messages
│   │   ├── exchanges/          # Exchange management
│   │   │   ├── request/
│   │   │   ├── requests/
│   │   │   └── history/
│   │   ├── notifications/      # Notification system
│   │   │   ├── route.ts
│   │   │   ├── [id]/read/
│   │   │   └── read-all/
│   │   └── users/              # User management
│   │       ├── [id]/
│   │       └── profile/
│   ├── add-book/               # Add new book page
│   ├── browse/                 # Browse books page
│   ├── edit-book/[id]/         # Edit book page
│   ├── home/                   # User dashboard
│   ├── listing/[id]/           # Book details page
│   ├── login/                  # Login page
│   ├── signup/                 # Registration page
│   ├── profile/                # User profile page
│   ├── my-chats/               # Chat interface
│   ├── my-listings/            # User's book listings
│   ├── notifications/          # Notifications page
│   └── users/[id]/             # User profile view
├── components/                 # Reusable UI components
│   ├── AuthWrapper.tsx         # Authentication wrapper
│   ├── AuthenticatedHeader.tsx # Main navigation
│   ├── Header.tsx              # Public header
│   ├── BookCard.tsx            # Book display component
│   ├── ChatModal.tsx           # Chat modal component
│   ├── ChatDropdown.tsx        # Chat notifications dropdown
│   ├── NotificationDropdown.tsx # Notification dropdown
│   ├── EditProfileModal.tsx    # Profile editing modal
│   ├── PasswordInput.tsx       # Password input with toggle
│   ├── LatestPostings.tsx      # Recent book listings
│   ├── RecentSwaps.tsx         # Recent exchanges
│   └── YouMayLike.tsx          # Book recommendations
├── contexts/                   # React contexts
│   └── AuthContext.tsx         # Authentication context
├── lib/                        # Utility functions and services
│   ├── api.ts                  # API service functions
│   ├── databaseService.ts      # Database operations
│   ├── prisma.ts               # Prisma client setup
│   ├── jwt.ts                  # JWT utilities
│   ├── middleware.ts           # API middleware
│   ├── types.ts                # TypeScript type definitions
│   ├── utils.ts                # General utilities
│   └── seed.ts                 # Database seeding functions
├── prisma/                     # Database schema and migrations
│   └── schema.prisma           # Database schema
├── scripts/                    # Utility scripts
│   └── seed.ts                 # Database seeding script
├── public/                     # Static assets
│   └── images/                 # Image assets
└── README.md                   # This file
```

## 🔧 Development

### Database Operations

```bash
# Access the database directly
docker compose exec db psql -U bookswap_user -d bookswap_db

# Reset database schema (careful - this deletes all data!)
docker compose exec app npx prisma db push --force-reset

# Generate Prisma client after schema changes
docker compose exec app npx prisma generate
```

### Database Seeding with Docker

The application includes Docker-specific seeding commands for easy database management:

```bash
# Seed database with sample data
docker compose exec app npm run seed

# Reset database (clear and reseed) - RECOMMENDED
docker compose exec app npm run seed:reset

# Clear all database data
docker compose exec app npm run seed:clear
```

**Docker-specific seeding commands:**
```bash
# Alternative Docker seeding methods
npm run seed:docker        # Seed using Docker
npm run seed:reset:docker   # Reset seed using Docker  
npm run seed:clear:docker   # Clear seed using Docker
```

**Note:** The Docker seeding commands automatically use the environment variables configured in `docker-compose.yml`, so no additional configuration is needed.

### Database Seeding

The application includes a comprehensive seeding system with sample data:

```bash
# Available seeding commands:
npm run seed        # Add sample data to existing database
npm run seed:reset  # Clear database and add fresh sample data  
npm run seed:clear  # Remove all data from database
```

**Sample Data Includes:**

### Sample Users (All with password: `password123`)
- **John Smith** (`john@example.com`) - San Francisco, CA
  - Interests: Science Fiction, Fantasy, Mystery
  - Books: The Great Gatsby, Dune, Harry Potter (exchanged)
  
- **Jane Doe** (`jane@example.com`) - New York, NY
  - Interests: Classic Literature, Romance
  - Books: To Kill a Mockingbird, 1984, Lord of the Rings (exchanged)
  
- **Sarah Wilson** (`sarah@example.com`) - Los Angeles, CA
  - Interests: Contemporary Fiction, Self-Help
  - Books: The Seven Husbands of Evelyn Hugo, The Midnight Library, Pride and Prejudice (exchanged)
  
- **Mike Johnson** (`mike@example.com`) - Chicago, IL
  - Interests: Biography, History
  - Books: Atomic Habits, Educated, The Catcher in the Rye (exchanged)

### Sample Books (12 total)
**Available Books:**
- The Great Gatsby (John) - Good condition, San Francisco
- To Kill a Mockingbird (Jane) - New condition, New York
- Dune (John) - Good condition, San Francisco
- The Seven Husbands of Evelyn Hugo (Sarah) - New condition, Los Angeles
- Atomic Habits (Mike) - Good condition, Chicago
- The Midnight Library (Sarah) - Good condition, Los Angeles
- Educated (Mike) - Worn condition, Chicago

**Previously Exchanged Books:**
- 1984 (Jane) - Exchanged to Sarah
- Pride and Prejudice (Sarah) - Exchanged to John
- The Catcher in the Rye (Mike) - Exchanged to Jane
- Harry Potter (John) - Exchanged to Sarah
- Lord of the Rings (Jane) - Exchanged to Mike

### Exchange Scenarios
**Active Exchange Requests:**
- Jane → John: Requesting "The Great Gatsby" (Pending)
- Sarah → Jane: Requesting "1984" (Accepted)
- John: Offering "Dune" for exchange (Pending)
- Sarah: Offering "The Seven Husbands of Evelyn Hugo" (Pending)

**Completed Exchange History:**
- John ↔ Sarah: Pride and Prejudice (Nov 28, 2024)
- Jane ↔ Mike: The Catcher in the Rye (Nov 20, 2024)
- Sarah ↔ John: Harry Potter (Nov 15, 2024)
- Mike ↔ Jane: Lord of the Rings (Nov 8, 2024)

### Chat Conversations (8 active threads)
- **With Exchange Requests:**
  - John & Jane: Discussing "The Great Gatsby" trade
  - John & Sarah: Discussing "Dune" for "Seven Husbands" exchange
  - Jane & John: About "To Kill a Mockingbird"
  - Sarah & John: About "The Seven Husbands of Evelyn Hugo"
  - Mike & John: About "Atomic Habits"

- **General Conversations (No Exchange Requests):**
  - Sarah & Jane: Discussing "The Midnight Library"
  - Mike & Sarah: About "Educated"
  - Mike & Jane: Different conversation about "Atomic Habits"

### Notifications
- Welcome messages for new users
- Exchange request notifications
- Exchange acceptance notifications
- Exchange offer notifications

### Chat Messages (32 total)
Each conversation includes 3-4 realistic messages between users discussing books, sharing recommendations, and coordinating exchanges. Messages include timestamps and read status.

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
