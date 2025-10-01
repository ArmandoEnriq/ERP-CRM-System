/* Datos iniciales para desarrollo

Empresas demo: Datos de prueba
Usuarios básicos: Admin, manager, user
Configuraciones: Valores por defecto del sistema*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      // Aquí se agregarán las entidades cuando las creemos
    ]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
