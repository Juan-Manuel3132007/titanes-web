export interface Paginacion {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Mismo formato que responde la API: { pagination, data }
export interface Paginado<T> {
  pagination: Paginacion;
  data: T[];
}