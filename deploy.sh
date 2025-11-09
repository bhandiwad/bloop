#!/bin/bash

# Bloop Deployment Script
# This script helps you deploy Bloop on a server with Docker

set -e  # Exit on error

echo "================================"
echo "  Bloop Docker Deployment"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    echo "Please install Docker first:"
    echo "  curl -fsSL https://get.docker.com -o get-docker.sh"
    echo "  sudo sh get-docker.sh"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed${NC}"
    echo "Please install Docker Compose first:"
    echo "  sudo curl -L \"https://github.com/docker/compose/releases/latest/download/docker-compose-\$(uname -s)-\$(uname -m)\" -o /usr/local/bin/docker-compose"
    echo "  sudo chmod +x /usr/local/bin/docker-compose"
    exit 1
fi

echo -e "${GREEN}✓ Docker and Docker Compose are installed${NC}"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠ .env file not found${NC}"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    
    # Generate SESSION_SECRET
    echo ""
    echo -e "${YELLOW}Generating secure SESSION_SECRET...${NC}"
    SESSION_SECRET=$(openssl rand -hex 32)
    
    # Replace placeholder in .env
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/CHANGE_THIS_GENERATE_WITH_OPENSSL_RAND_HEX_32/${SESSION_SECRET}/" .env
    else
        # Linux
        sed -i "s/CHANGE_THIS_GENERATE_WITH_OPENSSL_RAND_HEX_32/${SESSION_SECRET}/" .env
    fi
    
    echo -e "${GREEN}✓ Generated SESSION_SECRET${NC}"
    echo ""
    echo -e "${YELLOW}IMPORTANT: Please edit .env file and add your OpenAI API key if needed${NC}"
    echo "  nano .env"
    echo ""
    
    read -p "Press Enter to continue after editing .env (or Ctrl+C to exit)..."
fi

# Validate SESSION_SECRET
SESSION_SECRET=$(grep "^SESSION_SECRET=" .env | cut -d '=' -f2)
if [ -z "$SESSION_SECRET" ] || [ "$SESSION_SECRET" = "CHANGE_THIS_GENERATE_WITH_OPENSSL_RAND_HEX_32" ]; then
    echo -e "${RED}Error: SESSION_SECRET is not set properly in .env${NC}"
    echo "Please edit .env and set a secure SESSION_SECRET"
    echo "Generate one with: openssl rand -hex 32"
    exit 1
fi

echo -e "${GREEN}✓ .env file configured${NC}"
echo ""

# Ask user what to do
echo "What would you like to do?"
echo "1) Build and start services (fresh deployment)"
echo "2) Restart services"
echo "3) Stop services"
echo "4) View logs"
echo "5) Rebuild and restart (after code changes)"
echo "6) Database backup"
echo "7) Show status"
echo ""
read -p "Enter choice [1-7]: " choice

case $choice in
    1)
        echo ""
        echo -e "${GREEN}Building and starting services...${NC}"
        docker-compose build
        docker-compose up -d
        echo ""
        echo -e "${GREEN}✓ Services started successfully!${NC}"
        echo ""
        echo "Your application is running at:"
        echo "  http://localhost:5000"
        echo "  http://$(hostname -I | awk '{print $1}'):5000"
        echo ""
        echo "To view logs: docker-compose logs -f"
        ;;
    2)
        echo ""
        echo -e "${GREEN}Restarting services...${NC}"
        docker-compose restart
        echo -e "${GREEN}✓ Services restarted${NC}"
        ;;
    3)
        echo ""
        echo -e "${YELLOW}Stopping services...${NC}"
        docker-compose down
        echo -e "${GREEN}✓ Services stopped${NC}"
        ;;
    4)
        echo ""
        echo "Showing logs (Ctrl+C to exit)..."
        docker-compose logs -f
        ;;
    5)
        echo ""
        echo -e "${GREEN}Pulling latest code and rebuilding...${NC}"
        git pull
        docker-compose down
        docker-compose build
        docker-compose up -d
        echo -e "${GREEN}✓ Services rebuilt and restarted${NC}"
        ;;
    6)
        echo ""
        BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
        echo -e "${GREEN}Creating database backup: $BACKUP_FILE${NC}"
        docker exec bloop-postgres pg_dump -U bloop bloop > "$BACKUP_FILE"
        echo -e "${GREEN}✓ Backup created: $BACKUP_FILE${NC}"
        ;;
    7)
        echo ""
        echo "Service Status:"
        docker-compose ps
        echo ""
        echo "Resource Usage:"
        docker stats --no-stream
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo "================================"
echo "  Deployment Complete"
echo "================================"
