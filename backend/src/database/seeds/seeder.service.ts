import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(private readonly dataSource: DataSource) {}

  /**
   * Ejecutar todos los seeders
   */
  async runAllSeeders(): Promise<void> {
    this.logger.log('Starting database seeding...');

    try {
      await this.seedBasicData();
      this.logger.log('Database seeding completed successfully');
    } catch (error) {
      this.logger.error('Database seeding failed:', error);
      throw error;
    }
  }

  /**
   * Seed de datos básicos
   */
  private async seedBasicData(): Promise<void> {
    // Implementar cuando tengamos las entidades
    this.logger.log('Basic data seeding completed');
  }

  /**
   * Limpiar datos de prueba
   */
  async clearTestData(): Promise<void> {
    this.logger.log('Clearing test data...');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // Deshabilitar foreign key checks temporalmente
      await queryRunner.query('SET session_replication_role = replica;');

      // Limpiar tablas (implementar cuando tengamos entidades)

      // Rehabilitar foreign key checks
      await queryRunner.query('SET session_replication_role = DEFAULT;');

      this.logger.log('Test data cleared successfully');
    } catch (error) {
      this.logger.error('Failed to clear test data:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
