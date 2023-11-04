export interface UsuarioBanco {
  nombre: string | null;
  apellido: string | null;
  numerotarjeta: string | null;
  fechavencimiento: string | undefined;
  cvv: number | null;
  monto: number | null;
}
