export interface Cliente {
  idcliente: number,
  nombre: string,
  correoelectronico: string,
  numerotelefono: number,
  contrasena: string
}

export interface DireccionBack {
  direccion: Direccion
}

export interface Direccion {
  codigo_postal: number | null,
  estado: string | null,
  municipio: string | null,
  calle: string | null,
  colonia: string | null,
  numero_exterior: number | null,
  numero_interior: number | null,
  referencia: string | null,
  id_cliente: number | null
}
