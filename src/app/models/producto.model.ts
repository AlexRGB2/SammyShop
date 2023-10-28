import { Categoria } from "./categoria.model";
import { Cliente } from "./cliente.model";

export interface Mensaje {
  codigo: string;
  mensaje: string;
  info: ProductoResponse[];
}

export interface ProductoResponse {
  producto: Producto;
  categoria: Categoria;
  usuario: Cliente;
}

export interface Producto {
  id_producto: number;
  clave: string;
  nombre: string;
  precio: number;
  descripcion: string;
  stock: number;
  fecha_alta: string;
  fecha_modificacion: string | null;
  baja_logica: boolean;
  marca: string;
  id_categoria: number;
  cantidad: number
}
