#!/bin/bash

# =====================================================
# ERP/CRM System - Setup Script
# =====================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Check if running on Windows (Git Bash, WSL, etc.)
check_environment() {
    print_header "Checking Environment"
    
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        print_status "Detected Windows environment"
        WINDOWS=true
    else
        WINDOWS=false
    fi
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker Desktop."
        exit 1
    fi
    
    # Check if Docker Compose is available
    if ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not available. Please update Docker Desktop."
        exit 1
    fi
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js LTS."
        exit 1
    fi
    
    print_status "Environment check passed ✓"
}

# Create directory structure
create_directories() {
    print_header "Creating Directory Structure"
    
    # Create main directories
    mkdir -p backend/src/{auth,users,companies,customers,leads,sales,products,inventory,orders,invoices,accounting,reports,notifications,integrations,common,database,config}
    mkdir -p backend/test/{e2e,unit}
    mkdir -p frontend/src/{components,pages,hooks,services,store,types,utils,styles,assets}
    mkdir -p frontend/public
    mkdir -p database/{migrations,seeds,backups}
    mkdir -p docker/{nginx,scripts}
    mkdir -p docs
    mkdir -p tests/{e2e,integration}
    mkdir -p logs
    
    print_status "Directory structure created ✓"
}

# Copy environment files
setup_environment() {
    print_header "Setting up Environment Files"
    
    # Backend environment files
    if [[ ! -f "backend/.env.development" ]]; then
        cp .env.development backend/.env.development
        print_status "Backend development environment file created"
    fi
    
    if [[ ! -f "backend/.env" ]]; then
        cp backend/.env.development backend/.env
        print_status "Backend .env file created"
    fi
    
    # Frontend environment files
    if [[ ! -f "frontend/.env.development" ]]; then
        cat > frontend/.env.development << EOF
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=ERP/CRM System - Dev
VITE_APP_VERSION=1.0.0-dev
VITE_ENVIRONMENT=development
EOF
        print_status "Frontend development environment file created"
    fi
    
    if [[ ! -f "frontend/.env" ]]; then
        cp frontend/.env.development frontend/.env
        print_status "Frontend .env file created"
    fi
    
    print_status "Environment files setup completed ✓"
}

# Install dependencies
install_dependencies() {
    print_header "Installing Dependencies"
    
    # Install backend dependencies
    print_status "Installing backend dependencies..."
    cd backend
    if [[ -f "package.json" ]]; then
        npm install
        print_status "Backend dependencies installed ✓"
    else
        print_warning "Backend package.json not found, skipping backend dependencies"
    fi
    cd ..
    
    # Install frontend dependencies
    print_status "Installing frontend dependencies..."
    cd frontend
    if [[ -f "package.json" ]]; then
        npm install
        print_status "Frontend dependencies installed ✓"
    else
        print_warning "Frontend package.json not found, skipping frontend dependencies"
    fi
    cd ..
    
    # Install root dependencies (if any)
    if [[ -f "package.json" ]]; then
        print_status "Installing root dependencies..."
        npm install
        print_status "Root dependencies installed ✓"
    fi
}

# Setup Docker
setup_docker() {
    print_header "Setting up Docker Environment"
    
    # Create Docker networks
    print_status "Creating Docker network..."
    docker network create erp-crm-network 2>/dev/null || print_status "Network already exists"
    
    # Build and start containers
    print_status "Building and starting Docker containers..."
    docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
    
    # Wait for database to be ready
    print_status "Waiting for database to be ready..."
    sleep 10
    
    # Check database health
    max_attempts=30
    attempt=1
    while [[ $attempt -le $max_attempts ]]; do
        if docker compose exec -T database pg_isready -U postgres > /dev/null 2>&1; then
            print_status "Database is ready ✓"
            break
        fi
        print_status "Waiting for database... (attempt $attempt/$max_attempts)"
        sleep 2
        ((attempt++))
    done
    
    if [[ $attempt -gt $max_attempts ]]; then
        print_error "Database failed to start"
        exit 1
    fi
    
    print_status "Docker environment setup completed ✓"
}

# Verify installation
verify_installation() {
    print_header "Verifying Installation"
    
    # Check if containers are running
    if docker compose ps | grep -q "Up"; then
        print_status "Docker containers are running ✓"
    else
        print_error "Some Docker containers are not running"
        docker compose ps
        exit 1
    fi
    
    # Check database connection
    if docker compose exec -T database psql -U postgres -d erp_crm_db -c "SELECT 1;" > /dev/null 2>&1; then
        print_status "Database connection successful ✓"
    else
        print_error "Database connection failed"
        exit 1
    fi
    
    # Check Redis connection
    if docker compose exec -T redis redis-cli ping > /dev/null 2>&1; then
        print_status "Redis connection successful ✓"
    else
        print_error "Redis connection failed"
        exit 1
    fi
    
    print_status "Installation verification completed ✓"
}

# Display final information
show_final_info() {
    print_header "Setup Completed Successfully!"
    
    echo ""
    echo "🚀 Your ERP/CRM system is now ready!"
    echo ""
    echo "📊 Services:"
    echo "   • Database:  http://localhost:8080 (Adminer)"
    echo "   • PgAdmin:   http://localhost:5050 (user: admin@erpcrm.local, pass: admin)"
    echo "   • Frontend:  http://localhost:5173 (when started)"
    echo "   • Backend:   http://localhost:3000 (when started)"
    echo ""
    echo "🔑 Default Login:"
    echo "   • Email:     admin@democompany.com"
    echo "   • Password:  admin123"
    echo ""
    echo "🛠 Next Steps:"
    echo "   1. Start development servers:"
    echo "      cd backend && npm run start:dev"
    echo "      cd frontend && npm run dev"
    echo ""
    echo "   2. Access the application at http://localhost:5173"
    echo ""
    echo "📚 Documentation:"
    echo "   • API Docs:  http://localhost:3000/docs (when backend is running)"
    echo "   • README:    ./README.md"
    echo ""
    echo "🐳 Docker Commands:"
    echo "   • Stop:      docker compose down"
    echo "   • Start:     docker compose up -d"
    echo "   • Logs:      docker compose logs -f"
    echo ""
}

# Main execution
main() {
    print_header "ERP/CRM System Setup"
    
    check_environment
    create_directories
    setup_environment
    install_dependencies
    setup_docker
    verify_installation
    show_final_info
}

# Run main function
main "$@"