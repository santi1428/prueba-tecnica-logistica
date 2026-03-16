import apiClient from "./axiosConfig";

export interface LoginPayload {
  username: string;
  password?: string;
}

export interface EnvioPayload {
  cliente: number;
  tipo_producto: number;
  tipo_logistica: number;
  cantidad_producto: number;
  fecha_entrega: string;
  precio_envio: string;
  bodega_entrega?: number;
  puerto_entrega?: number;
  placa_vehiculo?: string;
  numero_flota?: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password?: string;
}

// Objeto principal con todas las peticiones a la API
export const api = {
  // ----- AUTENTICACIÓN -----
  auth: {
    login: (data: LoginPayload) => apiClient.post("/auth/login/", data),
    registro: (data: RegisterPayload) =>
      apiClient.post("/auth/registro/", data),
  },

  // ----- LOGÍSTICA (CRUDs) -----
  envios: {
    getAll: () => apiClient.get("/logistica/envios/"),
    getById: (id: number) => apiClient.get(`/logistica/envios/${id}/`),
    create: (data: EnvioPayload) => apiClient.post("/logistica/envios/", data),
    update: (id: number, data: Partial<EnvioPayload>) =>
      apiClient.patch(`/logistica/envios/${id}/`, data),
    delete: (id: number) => apiClient.delete(`/logistica/envios/${id}/`),
  },

  clientes: {
    getAll: () => apiClient.get("/logistica/clientes/"),
    getById: (id: number) => apiClient.get(`/logistica/clientes/${id}/`),
    create: (data: any) => apiClient.post("/logistica/clientes/", data),
    delete: (id: number) => apiClient.delete(`/logistica/clientes/${id}/`),
    update: (id: number, data: any) =>
      apiClient.patch(`/logistica/clientes/${id}/`, data),
  },

  productos: {
    getAll: () => apiClient.get("/logistica/productos/"),
    getById: (id: number) => apiClient.get(`/logistica/productos/${id}/`),
    create: (data: any) => apiClient.post("/logistica/productos/", data),
    delete: (id: number) => apiClient.delete(`/logistica/productos/${id}/`),
    update: (id: number, data: any) =>
      apiClient.patch(`/logistica/productos/${id}/`, data),
  },

  bodegas: {
    getAll: () => apiClient.get("/logistica/bodegas/"),
    getById: (id: number) => apiClient.get(`/logistica/bodegas/${id}/`),
    create: (data: any) => apiClient.post("/logistica/bodegas/", data),
    delete: (id: number) => apiClient.delete(`/logistica/bodegas/${id}/`),
    update: (id: number, data: any) =>
      apiClient.patch(`/logistica/bodegas/${id}/`, data),
  },

  puertos: {
    getAll: () => apiClient.get("/logistica/puertos/"),
    getById: (id: number) => apiClient.get(`/logistica/puertos/${id}/`),
    create: (data: any) => apiClient.post("/logistica/puertos/", data),
    delete: (id: number) => apiClient.delete(`/logistica/puertos/${id}/`),
    update: (id: number, data: any) =>
      apiClient.patch(`/logistica/puertos/${id}/`, data),
  },

  tiposDocumento: {
    getAll: () => apiClient.get("/logistica/tipos-documento/"),
  },
};
