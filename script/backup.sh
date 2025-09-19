#!/bin/bash

# =====================================================
# ERP/CRM System - Database Backup Script
# =====================================================

set -e  # Exit on any error

# Configuration
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30
MAX_BACKUPS=50

# Database connection details from environment
DB_HOST=${POSTGRES_HOST:-database}
DB_PORT=${POSTGRES_PORT:-5432}
DB_NAME=${POSTGRES_DB:-erp_crm_db}
DB_USER=${POSTGRES_USER:-postgres}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create backup directory if it doesn't exist
create_backup_dir() {
    if [[ ! -d "$BACKUP_DIR" ]]; then
        mkdir -p "$BACKUP_DIR"
        print_status "Created backup directory: $BACKUP_DIR"
    fi
}

# Check database connection
check_db_connection() {
    print_status "Checking database connection..."
    
    if ! pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" > /dev/null 2>&1; then
        print_error "Cannot connect to database at $DB_HOST:$DB_PORT"
        exit 1
    fi
    
    print_status "Database connection successful"
}

# Create database backup
create_backup() {
    local backup_file="$BACKUP_DIR/erp_crm_backup_${DATE}.sql"
    local compressed_backup="$backup_file.gz"
    
    print_status "Creating database backup..."
    
    # Create the backup
    pg_dump \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --no-password \
        --verbose \
        --clean \
        --no-acl \
        --no-owner \
        --format=plain \
        --file="$backup_file"
    
    if [[ $? -eq 0 ]]; then
        print_status "Database backup created: $backup_file"
        
        # Compress the backup
        gzip "$backup_file"
        print_status "Backup compressed: $compressed_backup"
        
        # Get file size
        local file_size=$(stat -f%z "$compressed_backup" 2>/dev/null || stat -c%s "$compressed_backup" 2>/dev/null || echo "unknown")
        print_status "Backup size: $(numfmt --to=iec $file_size 2>/dev/null || echo $file_size) bytes"
        
        echo "$compressed_backup"
    else
        print_error "Failed to create database backup"
        exit 1
    fi
}

# Create schemas-only backup
create_schema_backup() {
    local schema_file="$BACKUP_DIR/erp_crm_schema_${DATE}.sql"
    
    print_status "Creating schema-only backup..."
    
    pg_dump \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --no-password \
        --schema-only \
        --clean \
        --no-acl \
        --no-owner \
        --format=plain \
        --file="$schema_file"
    
    if [[ $? -eq 0 ]]; then
        gzip "$schema_file"
        print_status "Schema backup created: $schema_file.gz"
    else
        print_warning "Failed to create schema backup"
    fi
}

# Clean old backups
clean_old_backups() {
    print_status "Cleaning old backups..."
    
    # Remove backups older than retention period
    find "$BACKUP_DIR" -name "erp_crm_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
    find "$BACKUP_DIR" -name "erp_crm_schema_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
    
    # Keep only the latest N backups
    local backup_count=$(ls -1 "$BACKUP_DIR"/erp_crm_backup_*.sql.gz 2>/dev/null | wc -l)
    if [[ $backup_count -gt $MAX_BACKUPS ]]; then
        local excess=$((backup_count - MAX_BACKUPS))
        ls -1t "$BACKUP_DIR"/erp_crm_backup_*.sql.gz | tail -n $excess | xargs rm -f
        print_status "Removed $excess old backups"
    fi
    
    print_status "Cleanup completed"
}

# Create backup manifest
create_manifest() {
    local manifest_file="$BACKUP_DIR/backup_manifest.json"
    local backup_file="$1"
    local backup_name=$(basename "$backup_file")
    
    # Create or update manifest
    if [[ -f "$manifest_file" ]]; then
        # Update existing manifest
        local temp_file=$(mktemp)
        jq --arg date "$DATE" --arg file "$backup_name" --arg size "$(stat -f%z "$backup_file" 2>/dev/null || stat -c%s "$backup_file")" \
            '.backups += [{date: $date, file: $file, size: ($size | tonumber), created_at: now | strftime("%Y-%m-%d %H:%M:%S")}]' \
            "$manifest_file" > "$temp_file" && mv "$temp_file" "$manifest_file"
    else
        # Create new manifest
        jq -n --arg date "$DATE" --arg file "$backup_name" --arg size "$(stat -f%z "$backup_file" 2>/dev/null || stat -c%s "$backup_file")" \
            '{version: "1.0", backups: [{date: $date, file: $file, size: ($size | tonumber), created_at: now | strftime("%Y-%m-%d %H:%M:%S")}]}' \
            > "$manifest_file"
    fi
    
    print_status "Backup manifest updated"
}

# Verify backup
verify_backup() {
    local backup_file="$1"
    
    print_status "Verifying backup integrity..."
    
    # Check if file exists and is not empty
    if [[ ! -f "$backup_file" || ! -s "$backup_file" ]]; then
        print_error "Backup file is empty or does not exist"
        exit 1
    fi
    
    # Check if it's a valid gzip file
    if ! gzip -t "$backup_file" >/dev/null 2>&1; then
        print_error "Backup file is corrupted"
        exit 1
    fi
    
    print_status "Backup verification successful"
}

# Send notification (if configured)
send_notification() {
    local backup_file="$1"
    local status="$2"
    
    if [[ -n "$WEBHOOK_URL" ]]; then
        local message
        if [[ "$status" == "success" ]]; then
            message="✅ Database backup completed successfully: $(basename "$backup_file")"
        else
            message="❌ Database backup failed"
        fi
        
        curl -s -X POST "$WEBHOOK_URL" \
            -H "Content-Type: application/json" \
            -d "{\"text\":\"$message\"}" >/dev/null 2>&1 || true
    fi
}

# Main backup function
main() {
    print_status "Starting ERP/CRM database backup process..."
    print_status "Timestamp: $(date)"
    
    create_backup_dir
    check_db_connection
    
    # Create full backup
    local backup_file=$(create_backup)
    
    # Create schema backup
    create_schema_backup
    
    # Verify backup
    verify_backup "$backup_file"
    
    # Create manifest
    if command -v jq >/dev/null 2>&1; then
        create_manifest "$backup_file"
    else
        print_warning "jq not found, skipping manifest creation"
    fi
    
    # Clean old backups
    clean_old_backups
    
    # Send success notification
    send_notification "$backup_file" "success"
    
    print_status "Backup process completed successfully"
    print_status "Backup file: $backup_file"
    
    # Display backup statistics
    local total_backups=$(ls -1 "$BACKUP_DIR"/erp_crm_backup_*.sql.gz 2>/dev/null | wc -l)
    local total_size=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)
    print_status "Total backups: $total_backups"
    print_status "Total backup size: $total_size"
}

# Handle errors
trap 'print_error "Backup process failed"; send_notification "" "failed"; exit 1' ERR

# Run main function
main "$@"