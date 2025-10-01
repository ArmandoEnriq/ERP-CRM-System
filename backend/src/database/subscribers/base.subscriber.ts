/* Listener automático para eventos de base de datos

Logs automáticos: Registra todas las operaciones
Timestamps: Establece fechas automáticamente
Valores por defecto: isActive, version, etc.
Auditoría: Prepara datos para audit trail */

import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm'; // Decoradores de TypeORM
import { BaseEntity } from '../base.entity'; // Entidad base
import { Logger } from '@nestjs/common'; // Logger para registrar operaciones

@EventSubscriber() // Decorador para indicar que es un subscriber (clase especial que escucha los eventos de TypeORM)
export class BaseSubscriber implements EntitySubscriberInterface<BaseEntity> {
  // Clase que implementa la interfaz EntitySubscriberInterface (para poder usar los eventos de escucha de TypeORM) usamos la entidad BaseEntity para que cualquiera que use basEntity pueda escuchar estos eventos
  private readonly logger = new Logger(BaseSubscriber.name); // Logger para mensajes de console y baseSubscriber.name es el nombre de la clase que manda el mensaje

  /**
   * Listen to all entities that extend BaseEntity
   */
  listenTo() {
    return BaseEntity; // Escuchar todas las entidades que hereden de BaseEntity
  }

  /**
   * Called before entity insertion
   */
  beforeInsert(event: InsertEvent<BaseEntity>) {
    // Metodo que se ejecuta antes de insertar una entidad
    this.logger.log(`Inserting ${event.metadata.name}: ${event.entity?.id}`);

    // Establecer timestamp
    if (!event.entity.createdAt) {
      // Si createdAt no esta establecido
      event.entity.createdAt = new Date(); // Establecer createdAt
    }
    if (!event.entity.updatedAt) {
      // Si updatedAt no esta establecido
      event.entity.updatedAt = new Date(); // Establecer updatedAt actual
    }

    // Asegurar que isActive esté establecido
    if (event.entity.isActive === undefined) {
      // Si isActive no esta establecido
      event.entity.isActive = true; // Establecer isActive
    }

    // Asegurar que version esté establecido
    if (!event.entity.version) {
      event.entity.version = 1;
    }
  }

  /**
   * Called after entity insertion
   */
  afterInsert(event: InsertEvent<BaseEntity>) {
    this.logger.log(`Inserted ${event.metadata.name}: ${event.entity?.id}`);
  }

  /**
   * Called before entity update
   */
  beforeUpdate(event: UpdateEvent<BaseEntity>) {
    this.logger.log(`Updating ${event.metadata.name}: ${event.entity?.id}`);

    // Actualizar timestamp
    if (event.entity) {
      event.entity.updatedAt = new Date();
    }
  }

  /**
   * Called after entity update
   */
  afterUpdate(event: UpdateEvent<BaseEntity>) {
    this.logger.log(`Updated ${event.metadata.name}: ${event.entity?.id}`);
  }

  /**
   * Called before entity removal
   */
  beforeRemove(event: RemoveEvent<BaseEntity>) {
    this.logger.log(`Removing ${event.metadata.name}: ${event.entity?.id}`);
  }

  /**
   * Called after entity removal
   */
  afterRemove(event: RemoveEvent<BaseEntity>) {
    this.logger.log(`Removed ${event.metadata.name}: ${event.entity?.id}`);
  }
}
