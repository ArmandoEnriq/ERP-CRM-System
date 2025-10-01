/* Servicio base con operaciones CRUD reutilizables

CRUD completo: Create, Read, Update, Delete
Paginación avanzada: Con búsqueda y filtros
Soft delete: Eliminación lógica por defecto
Búsqueda inteligente: Por múltiples campos
Ordenamiento: Configurable por cualquier campo
Query builder: Para consultas complejas personalizadas */

import {
  Repository,
  FindOptionsWhere,
  FindManyOptions,
  DeepPartial,
  FindOneOptions,
  SelectQueryBuilder,
} from 'typeorm'; // Decoradores de TypeORM
import { BaseEntity } from '../base.entity'; // Entidad base
import {
  PaginationOptions,
  PaginatedResult,
  PaginationMeta,
} from '../interfaces/pagination.interface'; // Interfaz de paginación
import { array } from 'joi'; // Biblioteca de validación

export abstract class BaseRepositoryService<T extends BaseEntity> {
  // cramos una clase abstracta (no se puede instanciar) llamada BaseRepositoryService que recibe un parámetro T (del tipo generico user, order, product,etc) que extiende la clase BaseEntity (sera entidad validada por TypeORM)
  constructor(protected readonly repository: Repository<T>) {} // Constructor que recibe un parámetro repository (del tipo Repository<T>) que es la base que usaremos (user, order, product,etc)

  /**
   * Crear una nueva entidad
   */
  async create(createData: DeepPartial<T>, userId?: string): Promise<T> {
    // creamos un metodo asincrono que recibe un dato (createData) del tipo DeepPartial<T> (puedes pasar un objeto que tenga algunas (o todas) las propiedades de T) y un parámetro userId (opcional) de tipo string que devuelve un promesa de tipo T
    const entity = this.repository.create({
      // Creamos una instancia de la entidad con los datos recibidos
      ...createData,
      createdBy: userId,
      updatedBy: userId,
    } as DeepPartial<T>); // le decimos que es del tipo DeepPartial<T>

    return await this.repository.save(entity); // Guardamos la entidad
  }

  /**
   * Buscar todas las entidades
   */
  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    // creamos un metodo asincrono que recibe un parámetro options (opcional) de tipo FindManyOptions<T> (filtros de busqueda ) y devuelve un promesa de tipo array T[]
    return await this.repository.find({
      // Buscamos todas las entidades
      where: { isActive: true } as FindOptionsWhere<T>, // donde el isActive sea true y con FindOptionsWhere<T> le decimos que si tiene esa propiedad
      ...options, // podemos agregar otros filtros
    });
  }

  /**
   * Buscar entidades con paginación
   */
  async findWithPagination(
    paginationOptions: PaginationOptions,
    findOptions?: FindManyOptions<T>,
  ): Promise<PaginatedResult<T>> {
    // función asincrona que recibe un parámetro (paginationOptions) del tipo PaginationOptions (objeto con opciones de paginación) y un parámetro (findOptions) de tipo FindManyOptions<T> (filtros de busqueda) y devuelve un promesa de tipo PaginatedResult<T> (que es un objeto con datos y metadatos de paginación)
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      search,
      searchFields = [],
    } = paginationOptions; // extraemos los valores de paginationOptions o usamos los valores por defecto

    const queryBuilder = this.repository.createQueryBuilder('entity'); // Creamos un query builder (constructor de consultas complejas) con el alias 'entity' (es como usar una consulta el select * from user as 'entity')

    // Aplicar filtro de activos
    queryBuilder.where('entity.isActive = :isActive', { isActive: true }); // le anexamos el where isActive = true

    // Aplicar búsqueda si está definida
    if (search && searchFields.length > 0) {
      // si search y searchFields tienen datos
      const searchConditions = searchFields
        .map((field, index) => `entity.${field} ILIKE :search${index}`)
        .join(' OR '); // creamos la condición de busqueda que buscar (search) en los campos (searchFields) con el operador ILIKE (ignorar mayúsculas y minúsculas) uniendo los campos con OR (entity.name ILIKE '%Armando%' OR entity.email ILIKE '%Armando%')

      queryBuilder.andWhere(`(${searchConditions})`); // lo agregamos a la consulta where con and

      // Agregar parámetros de búsqueda
      searchFields.forEach((_, index) => {
        // volvemos a recorrer los campos perosin el contenido _ solo usaremos el index
        queryBuilder.setParameter(`search${index}`, `%${search}%`); // con setParameter le decimos que search0 es igual a lo que buscamos ejem %Armando%
      });
    }

    // Aplicar filtros adicionales de findOptions
    if (findOptions?.where) {
      // si findOptions tiene where
      Object.entries(findOptions.where as object).forEach(([key, value]) => {
        // el objeto findOptions lo pasamos a object de clave y valor (key, value)
        if (key !== 'isActive') {
          // si la clave no es isActive
          queryBuilder.andWhere(`entity.${key} = :${key}`, { [key]: value }); // entonces en la consulta agregamos al where algo como AND entity.name = :name donde :name es el value
        }
      });
    }

    // Aplicar relaciones
    if (findOptions?.relations) {
      // si findOptions tiene relaciones
      if (Array.isArray(findOptions.relations)) {
        // si las relaciones son un array
        (findOptions.relations as string[]).forEach((relation: string) => {
          queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
        }); // entonces por cada relacion en el array lo unimos con leftJoinAndSelect
      }
    }

    // Aplicar ordenamiento
    queryBuilder.orderBy(`entity.${sortBy}`, sortOrder); // ordenamos por sortBy

    // Aplicar paginación
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    const meta: PaginationMeta = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
      nextPage: page < Math.ceil(total / limit) ? page + 1 : undefined,
      previousPage: page > 1 ? page - 1 : undefined,
    };

    return { data, meta };
  }

  /**
   * Buscar una entidad por ID
   */
  async findById(id: string, options?: FindOneOptions<T>): Promise<T | null> {
    // Creamos un metodo findById que recibe un parámetro id (de tipo string) y un parámetro options (de tipo FindOneOptions<T>) y devuelve un promesa de tipo T | null
    return await this.repository.findOne({
      // usamos el repository para buscar una entidad por id
      where: { id, isActive: true } as FindOptionsWhere<T>, // donde el id sea igual al parámetro id y el isActive sea true y con FindOptionsWhere<T> le decimos que si tiene esa propiedad
      ...options, // podemos agregar otros filtros
    });
  }

  /**
   * Buscar una entidad por criterios específicos
   */
  async findOne(
    where: FindOptionsWhere<T>,
    options?: FindOneOptions<T>,
  ): Promise<T | null> {
    // Creamos un metodo findOne que recibe un parámetro where (de tipo FindOptionsWhere<T>) y un parámetro options (de tipo FindOneOptions<T>) y devuelve un promesa de tipo T | null
    return await this.repository.findOne({
      // usamos el repository para buscar una entidad por criterios especificos
      where: { ...where, isActive: true } as FindOptionsWhere<T>, // donde el where sea igual al parámetro where y el isActive sea true
      ...options, // podemos agregar otros filtros
    });
  }

  /**
   * Actualizar una entidad por ID
   */
  async update(
    id: string,
    updateData: DeepPartial<T>,
    userId?: string,
  ): Promise<T | null> {
    const entity = await this.findById(id);
    if (!entity) {
      return null;
    }

    // Verificar versión para control de concurrencia optimista
    if (updateData.version && entity.version !== updateData.version) {
      throw new Error(
        'Concurrent modification detected. Please refresh and try again.',
      );
    }

    const updatedEntity = this.repository.merge(entity, {
      ...updateData,
      updatedBy: userId,
      version: entity.version + 1,
    } as DeepPartial<T>);

    return await this.repository.save(updatedEntity);
  }

  /**
   * Eliminación lógica (soft delete) No lo borramos fisicamente solo lo desactivamos
   */
  async softDelete(id: string, userId?: string): Promise<boolean> {
    const entity = await this.findById(id);
    if (!entity) {
      return false;
    }

    await this.repository.update(id, {
      isActive: false,
      deletedAt: new Date(),
      deletedBy: userId,
    } as any);

    return true;
  }

  /**
   * Restaurar una entidad eliminada lógicamente la entidad que le hicimos soft delete lo volvemos a activar
   */
  async restore(id: string, userId?: string): Promise<boolean> {
    const entity = await this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
      withDeleted: true,
    });

    if (!entity) {
      return false;
    }

    await this.repository.update(id, {
      isActive: true,
      deletedAt: null,
      updatedBy: userId,
    } as any);

    return true;
  }

  /**
   * Eliminación física (hard delete) eliminamos fisicamente de la base
   */
  async hardDelete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }

  /**
   * Contar entidades
   */
  async count(where?: FindOptionsWhere<T>): Promise<number> {
    return await this.repository.count({
      where: { ...where, isActive: true } as FindOptionsWhere<T>, // donde el where sea igual al parámetro where y el isActive sea true
    });
  }

  /**
   * Verificar si existe una entidad
   */
  async exists(where: FindOptionsWhere<T>): Promise<boolean> {
    const count = await this.repository.count({
      where: { ...where, isActive: true } as FindOptionsWhere<T>,
    });
    return count > 0; // si el count es mayor a 0 entonces existe
  }

  /**
   * Crear múltiples entidades (es cmo el create pero con un array)
   */
  async createMany(
    createData: DeepPartial<T>[],
    userId?: string,
  ): Promise<T[]> {
    const entities = createData.map(data =>
      this.repository.create({
        ...data,
        createdBy: userId,
        updatedBy: userId,
      } as DeepPartial<T>),
    );

    return await this.repository.save(entities);
  }

  /**
   * Obtener query builder personalizado
   */
  createQueryBuilder(alias?: string): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder(alias);
  }

  /**
   * Ejecutar query raw (sql nativo)
   */
  async query(query: string, parameters?: any[]): Promise<any> {
    return await this.repository.query(query, parameters);
  }
}
