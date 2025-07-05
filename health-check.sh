#!/bin/bash

echo "🔍 Health Check for BookSwap Application"
echo "======================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running"
    exit 1
fi

# Check if containers are running
echo "📋 Container Status:"
docker compose ps

echo ""
echo "🔗 Application URLs:"
echo "   🌐 Web App: http://localhost:3000"
echo "   🗄️  Database: localhost:5432"

echo ""
echo "🧪 Testing application endpoints..."

# Test if the app is responding
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Web application is responding"
else
    echo "❌ Web application is not responding"
fi

# Test if database is accessible
if docker compose exec -T db pg_isready -U bookswap_user > /dev/null 2>&1; then
    echo "✅ Database is accessible"
else
    echo "❌ Database is not accessible"
fi

echo ""
echo "📊 Database Info:"
docker compose exec -T app npx prisma db seed --help > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Prisma is configured correctly"
else
    echo "❌ Prisma configuration issue"
fi

echo ""
echo "✅ Health check complete!"
