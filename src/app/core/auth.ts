export interface Usuario {
  nombre: string;
  usuario: string;
  correo: string;
  fechaNacimiento: string;
  direccion?: string | null;
  clave: string;
  rol: 'admin' | 'cliente';
  status?: 'active' | 'inactive' /** Indicador de si el usuario está activo o desactivado */;
}
