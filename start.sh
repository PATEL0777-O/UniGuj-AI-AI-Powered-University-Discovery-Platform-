#!/bin/bash
# UniGuj AI - Quick Start Script

echo "🎓 UniGuj AI - Quick Start"
echo "=========================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not found. Please install Docker Compose first."
    exit 1
fi

# Check if .env exists
if [ ! -f backend/.env ]; then
    echo "⚠️  backend/.env not found. Creating from example..."
    cp backend/.env.example backend/.env
    echo "📝 Please edit backend/.env with your configuration"
fi

echo "🚀 Starting UniGuj AI..."
docker-compose up -d

echo ""
echo "✅ UniGuj AI is starting up!"
echo ""
echo "📍 Access points:"
echo "   Frontend:     http://localhost"
echo "   Backend API:  http://localhost:8000"
echo "   API Docs:     http://localhost:8000/docs"
echo "   MongoDB:      localhost:27017"
echo ""
echo "📝 Logs:"
echo "   Backend:  docker-compose logs -f backend"
echo "   Frontend: docker-compose logs -f frontend"
echo ""
echo "🛑 To stop: docker-compose down"
echo ""
