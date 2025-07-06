#!/bin/bash

echo "🐳 Starting BookSwap application with Docker Compose..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Check if port 5432 is already in use (our Docker port)
if lsof -Pi :5432 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 5432 is already in use. Checking what's using it..."
    lsof -Pi :5432 -sTCP:LISTEN
    echo ""
    echo "❌ Cannot start Docker containers while port 5432 is in use."
    echo "Please stop the conflicting service and try again."
    exit 1
fi

# Check if port 3000 is already in use (Next.js app port)
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is already in use. Checking what's using it..."
    lsof -Pi :3000 -sTCP:LISTEN
    echo ""
    echo "❌ Cannot start Docker containers while port 3000 is in use."
    echo "Please stop the conflicting service and try again."
    exit 1
fi

# Build and start all services (database + app)
echo "🔨 Building and starting services..."
docker compose up --build -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Check if the database is ready
if docker compose ps db | grep -q "Up"; then
    echo "✅ PostgreSQL is running!"
else
    echo "❌ Failed to start PostgreSQL"
    exit 1
fi

# Initialize database schema
echo "🔧 Setting up database schema..."
docker compose exec app npx prisma db push --accept-data-loss

# Seed the database
echo "🌱 Seeding database with initial data..."
docker compose exec app npx prisma db seed

# Wait a bit more for the app to be fully ready
echo "⏳ Waiting for Next.js app to be ready..."
sleep 5

# Check if the database is ready
if docker compose ps db | grep -q "Up"; then
    echo "✅ PostgreSQL is running!"
else
    echo "❌ Failed to start PostgreSQL"
    exit 1
fi

# Check if the app is ready
if docker compose ps app | grep -q "Up"; then
    echo "✅ Next.js app is running!"
else
    echo "❌ Failed to start Next.js app"
    exit 1
fi

echo ""
echo "🎉 BookSwap application is now running!"
echo "📋 Service details:"
echo "   🌐 Web App: http://localhost:3000"
echo "   🗄️ Database: localhost:5432 (Docker port mapping)"
echo "   📊 Database Name: bookswap_db"
echo "   👤 Database User: bookswap_user"
echo ""
echo "🔧 Useful commands:"
echo "   View logs: docker compose logs -f"
echo "   Stop services: docker compose down"
echo "   Access app container: docker compose exec app bash"
echo "   Access database: docker compose exec db psql -U bookswap_user -d bookswap_db"
echo ""
echo "✨ Database has been automatically set up and seeded with initial data!"
echo "🚀 You can now access the application at http://localhost:3000"
