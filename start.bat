@echo off
echo 🐳 Starting BookSwap application with Docker Compose...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Check if port 5432 is already in use
netstat -an | findstr :5432 >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Port 5432 is already in use.
    echo ❌ Cannot start Docker containers while port 5432 is in use.
    echo Please stop the conflicting service and try again.
    pause
    exit /b 1
)

REM Check if port 3000 is already in use
netstat -an | findstr :3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Port 3000 is already in use.
    echo ❌ Cannot start Docker containers while port 3000 is in use.
    echo Please stop the conflicting service and try again.
    pause
    exit /b 1
)

echo 🔨 Building and starting services...
docker compose up --build -d

echo ⏳ Waiting for database to be ready...
timeout /t 10 /nobreak >nul

REM Check if the database is ready
docker compose ps db | findstr "Up" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ PostgreSQL is running!
) else (
    echo ❌ Failed to start PostgreSQL
    pause
    exit /b 1
)

echo 🔧 Setting up database schema...
docker compose exec -T app npx prisma db push --accept-data-loss

if %errorlevel% neq 0 (
    echo ❌ Failed to set up database schema
    echo 📋 App logs:
    docker compose logs app
    pause
    exit /b 1
)

echo 🌱 Seeding database with initial data...
docker compose exec -T app npx prisma db seed

if %errorlevel% neq 0 (
    echo ❌ Failed to seed database
    echo 📋 App logs:
    docker compose logs app
    pause
    exit /b 1
)

echo ⏳ Waiting for Next.js app to be ready...
timeout /t 5 /nobreak >nul

REM Check if the app is ready
docker compose ps app | findstr "Up" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Next.js app is running!
) else (
    echo ❌ Failed to start Next.js app
    pause
    exit /b 1
)

echo.
echo 🎉 BookSwap application is now running!
echo 📋 Service details:
echo    🌐 Web App: http://localhost:3000
echo    🗄️ Database: localhost:5432 (Docker port mapping)
echo    📊 Database Name: bookswap_db
echo    👤 Database User: bookswap_user
echo.
echo 📋 Quick Start Guide:
echo    👤 Try logging in with sample accounts:
echo       • Email: john@example.com, Password: password123
echo       • Email: jane@example.com, Password: password123
echo       • Email: bob@example.com, Password: password123
echo       • Email: alice@example.com, Password: password123
echo.
echo 🔧 Useful commands:
echo    View logs: docker compose logs -f
echo    Stop services: docker compose down
echo    Access app container: docker compose exec app bash
echo    Access database: docker compose exec db psql -U bookswap_user -d bookswap_db
echo.
echo ✨ Database has been automatically set up and seeded with initial data!
echo 🚀 You can now access the application at http://localhost:3000
echo.
echo Press any key to exit...
pause >nul