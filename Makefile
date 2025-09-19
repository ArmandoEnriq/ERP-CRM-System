# =====================================================
# ERP/CRM System - Makefile para automatizacion de tareas docker (recomendado linux)
# =====================================================

# Variables
DOCKER_COMPOSE = docker compose
DOCKER_COMPOSE_DEV = docker compose -f docker-compose.yml -f docker-compose.dev.yml
DOCKER_COMPOSE_PROD = docker compose -f docker-compose.yml -f docker-compose.prod.yml

# Default target
.DEFAULT_GOAL := help

# Colors
BLUE=\033[0;34m
GREEN=\033[0;32m
YELLOW=\033[1;33m
RED=\033[0;31m
NC=\033[0m

# Help command
.PHONY: help
help: ## Show this help message
	@echo "$(BLUE)ERP/CRM System - Available Commands$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

# Setup commands
.PHONY: setup
setup: ## Initial project setup
	@echo "$(BLUE)Setting up ERP/CRM system...$(NC)"
	@chmod +x scripts/setup.sh
	@./scripts/setup.sh

.PHONY: install
install: ## Install all dependencies
	@echo "$(BLUE)Installing dependencies...$(NC)"
	@cd backend && npm install
	@cd frontend && npm install
	@echo "$(GREEN)Dependencies installed successfully$(NC)"

# Development commands
.PHONY: dev
dev: ## Start development environment
	@echo "$(BLUE)Starting development environment...$(NC)"
	@$(DOCKER_COMPOSE_DEV) up -d
	@echo "$(GREEN)Development environment started$(NC)"
	@echo "$(YELLOW)Frontend: http://localhost:5173$(NC)"
	@echo "$(YELLOW)Backend: http://localhost:3000$(NC)"
	@echo "$(YELLOW)Adminer: http://localhost:8080$(NC)"

.PHONY: dev-build
dev-build: ## Build and start development environment
	@echo "$(BLUE)Building and starting development environment...$(NC)"
	@$(DOCKER_COMPOSE_DEV) up -d --build
	@echo "$(GREEN)Development environment built and started$(NC)"

.PHONY: stop
stop: ## Stop all containers
	@echo "$(BLUE)Stopping containers...$(NC)"
	@$(DOCKER_COMPOSE) down
	@echo "$(GREEN)Containers stopped$(NC)"

.PHONY: restart
restart: stop dev ## Restart development environment

# Database commands
.PHONY: db-up
db-up: ## Start only database services
	@echo "$(BLUE)Starting database services...$(NC)"
	@$(DOCKER_COMPOSE) up -d database redis adminer
	@echo "$(GREEN)Database services started$(NC)"

.PHONY: db-reset
db-reset: ## Reset database (WARNING: destroys all data)
	@echo "$(RED)WARNING: This will destroy all database data!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo "$(BLUE)Resetting database...$(NC)"; \
		$(DOCKER_COMPOSE) down -v; \
		docker volume rm erp-crm-system_postgres_data || true; \
		$(DOCKER_COMPOSE) up -d database redis; \
		echo "$(GREEN)Database reset completed$(NC)"; \
	else \
		echo "$(YELLOW)Database reset cancelled$(NC)"; \
	fi

.PHONY: db-backup
db-backup: ## Create database backup
	@echo "$(BLUE)Creating database backup...$(NC)"
	@$(DOCKER_COMPOSE) exec database /scripts/backup.sh
	@echo "$(GREEN)Database backup completed$(NC)"

.PHONY: db-logs
db-logs: ## Show database logs
	@$(DOCKER_COMPOSE) logs -f database

# Application commands
.PHONY: backend-dev
backend-dev: ## Start backend in development mode
	@echo "$(BLUE)Starting backend development server...$(NC)"
	@cd backend && npm run start:dev

.PHONY: frontend-dev
frontend-dev: ## Start frontend in development mode
	@echo "$(BLUE)Starting frontend development server...$(NC)"
	@cd frontend && npm run dev

.PHONY: build
build: ## Build all applications
	@echo "$(BLUE)Building applications...$(NC)"
	@cd backend && npm run build
	@cd frontend && npm run build
	@echo "$(GREEN)Build completed$(NC)"

# Testing commands
.PHONY: test
test: ## Run all tests
	@echo "$(BLUE)Running tests...$(NC)"
	@cd backend && npm run test
	@cd frontend && npm run test
	@echo "$(GREEN)Tests completed$(NC)"

.PHONY: test-backend
test-backend: ## Run backend tests
	@cd backend && npm run test

.PHONY: test-frontend
test-frontend: ## Run frontend tests
	@cd frontend && npm run test

.PHONY: test-e2e
test-e2e: ## Run end-to-end tests
	@cd backend && npm run test:e2e

# Linting and formatting
.PHONY: lint
lint: ## Run linters
	@echo "$(BLUE)Running linters...$(NC)"
	@cd backend && npm run lint
	@cd frontend && npm run lint
	@echo "$(GREEN)Linting completed$(NC)"

.PHONY: format
format: ## Format code
	@echo "$(BLUE)Formatting code...$(NC)"
	@cd backend && npm run format
	@cd frontend && npm run format
	@echo "$(GREEN)Code formatting completed$(NC)"

# Production commands
.PHONY: prod
prod: ## Start production environment
	@echo "$(BLUE)Starting production environment...$(NC)"
	@$(DOCKER_COMPOSE_PROD) up -d --build
	@echo "$(GREEN)Production environment started$(NC)"

.PHONY: prod-stop
prod-stop: ## Stop production environment
	@echo "$(BLUE)Stopping production environment...$(NC)"
	@$(DOCKER_COMPOSE_PROD) down
	@echo "$(GREEN)Production environment stopped$(NC)"

# Monitoring commands
.PHONY: logs
logs: ## Show all logs
	@$(DOCKER_COMPOSE) logs -f

.PHONY: logs-backend
logs-backend: ## Show backend logs
	@$(DOCKER_COMPOSE) logs -f backend

.PHONY: logs-frontend
logs-frontend: ## Show frontend logs
	@$(DOCKER_COMPOSE) logs -f frontend

.PHONY: status
status: ## Show container status
	@$(DOCKER_COMPOSE) ps

.PHONY: stats
stats: ## Show container resource usage
	@docker stats $(shell docker ps --format "table {{.Names}}" | grep erp-crm | tr '\n' ' ')

# Cleanup commands
.PHONY: clean
clean: ## Clean up containers and images
	@echo "$(BLUE)Cleaning up...$(NC)"
	@$(DOCKER_COMPOSE) down -v
	@docker system prune -f
	@echo "$(GREEN)Cleanup completed$(NC)"

.PHONY: clean-all
clean-all: ## Clean everything including volumes (WARNING: destroys data)
	@echo "$(RED)WARNING: This will destroy all data!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo "$(BLUE)Cleaning everything...$(NC)"; \
		$(DOCKER_COMPOSE) down -v --rmi all; \
		docker system prune -af; \
		echo "$(GREEN)Complete cleanup finished$(NC)"; \
	else \
		echo "$(YELLOW)Cleanup cancelled$(NC)"; \
	fi

# Utility commands
.PHONY: shell-db
shell-db: ## Open database shell
	@$(DOCKER_COMPOSE) exec database psql -U postgres -d erp_crm_db

.PHONY: shell-backend
shell-backend: ## Open backend container shell
	@$(DOCKER_COMPOSE) exec backend sh

.PHONY: shell-redis
shell-redis: ## Open Redis CLI
	@$(DOCKER_COMPOSE) exec redis redis-cli