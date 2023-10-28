export interface Categoria {
  categoria: {
    id_categoria: number;
    nombre: string;
    descripcion: string;
    fecha_alta: string;
    fecha_modificacion: string | null;
    clave: string;
  }
}
