export interface TipoDocumento {
  id: number;
  nombre: string;
  abreviatura: string | null;
}

export interface Cliente {
  id: number;
  nombre: string;
  documento: string;
  tipo_documento: number; // ID del tipo de documento asociado
  correo_electronico?: string;
  telefono?: string;
  direccion?: string;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Bodega {
  id: number;
  nombre: string;
  ubicacion: string;
}

export interface Puerto {
  id: number;
  nombre: string;
  pais: string;
}

export interface Envio {
  id: number;
  cantidad_producto: number;
  fecha_registro: string;
  fecha_entrega: string;
  precio_envio: string;
  numero_guia: string;
  placa_vehiculo: string | null;
  numero_flota: string | null;
  precio_final: string;
  cliente: number; // ID del cliente
  tipo_producto: number; // ID del producto
  tipo_logistica: number; // 1 = Terrestre, 2 = Marítima
  bodega_entrega: number | null;
  puerto_entrega: number | null;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password?: string;
}
