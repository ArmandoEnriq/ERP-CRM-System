/* Scripts de migración de base de datos

Extensiones PostgreSQL: UUID, full-text search
Funciones: Para timestamps y audit trail automático
Triggers: Actualizaciones automáticas
Índices: Para optimización de consultas */

import { MigrationInterface, QueryRunner } from 'typeorm'; // Decoradores de TypeORM

export class InitialMigration1700000000000 implements MigrationInterface {
  // creamos una clase que implementa la interface MigrationInterface (uso de up y down para ejecutar las migraciones)
  name = 'InitialMigration1700000000000'; // Nombre de la migración

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Función para ejecutar la migración la cual recibe un QueryRunner (para interactuar con la base de datos y ejecutar consultas) y devuelve una promesa de void
    // Crear extensiones necesarias
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`); // Extension para generar UUIDs
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pg_trgm"`); // Extension para hacer búsqueda por similitud de texto

    // Crear función para actualizar timestamp
    // Función para actualizar timestamp desde trigger
    await queryRunner.query(` 
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $ language 'plpgsql';
    `);

    // Crear función para generar audit trail
    // Función para generar audit trail (registrar cambios en la base de datos mediante triggers (insert, update, delete))
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION create_audit_trail()
      RETURNS TRIGGER AS $
      BEGIN
        INSERT INTO audit_logs (
          table_name,
          record_id,
          action,
          old_values,
          new_values,
          user_id,
          created_at
        ) VALUES (
          TG_TABLE_NAME,
          COALESCE(NEW.id, OLD.id),
          TG_OP,
          CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
          CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN row_to_json(NEW) ELSE NULL END,
          COALESCE(NEW.updated_by, OLD.updated_by),
          CURRENT_TIMESTAMP
        );
        RETURN COALESCE(NEW, OLD);
      END;
      $ language 'plpgsql';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Función para deshacer la migración
    await queryRunner.query(`DROP FUNCTION IF EXISTS create_audit_trail()`); // Elimina la función si existe
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS update_updated_at_column()`,
    ); // Elimina la función si existe
    await queryRunner.query(`DROP EXTENSION IF EXISTS "pg_trgm"`); // Elimina la extension si existe
    await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`); // Elimina la extension si existe
  }
}
