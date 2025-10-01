export interface PaginationOptions {
  // interface para la paginación (molde que se usara para la paginación)
  page?: number; // numero de pagina
  limit?: number; // cantidad de elementos por pagina
  sortBy?: string; // campo por el cual se va a ordenar
  sortOrder?: 'ASC' | 'DESC'; // orden ascendente o descendente
  search?: string; // texto de busqueda
  searchFields?: string[]; // campos de busqueda
}

export interface PaginationMeta {
  // interface para la meta de la paginación (información que necesitaremos para la paginación)
  total: number; // cantidad total de elementos
  page: number; // pagina actual
  limit: number; // cantidad de elementos por pagina
  totalPages: number; // cantidad de paginas
  hasNextPage: boolean; // indica si hay una pagina siguiente
  hasPreviousPage: boolean; // indica si hay una pagina anterior
  nextPage?: number; // pagina siguiente
  previousPage?: number; // pagina anterior
}

export interface PaginatedResult<T> {
  // interface para el resultado de la paginación (con <T> indicamos que es un generico user, product, etc)
  data: T[]; // datos de la paginación
  meta: PaginationMeta; // meta de la paginación
}
