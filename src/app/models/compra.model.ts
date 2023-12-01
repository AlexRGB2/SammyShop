import { Producto } from "./producto.model";

export interface Compra {
  idcliente: number;
  fechapedido: string;
  id_direccion: number | null;
  monto: number;
  numerotarjeta: string | null;
  productos: Producto[]
}
