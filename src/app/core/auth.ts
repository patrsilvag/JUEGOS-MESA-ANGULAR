export interface Usuario {
  nombre: string;
  usuario: string;
  correo: string;
  fechaNacimiento: string;
  direccion?: string;
  clave: string;
  rol: 'admin' | 'cliente';
}

