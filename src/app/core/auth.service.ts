import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from './auth';
import { AuthRepository } from './auth.repository';

// ==========================================
//   TIPO SEGURO PARA EL LOGIN
// ==========================================
export type LoginResultado = { ok: true; usuario: Usuario } | { ok: false; mensaje: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Estado centralizado del usuario autenticado
  private usuarioActual = new BehaviorSubject<Usuario | null>(null);

  // Observable público
  usuarioActual$ = this.usuarioActual.asObservable();

  constructor(private repo: AuthRepository) {
    this.cargarUsuarioActual();
  }

  // ==========================================
  //   SESIÓN LOCAL
  // ==========================================
  private cargarUsuarioActual() {
    const raw = localStorage.getItem('usuarioActual');
    this.usuarioActual.next(raw ? JSON.parse(raw) : null);
  }

  private guardarSesion(u: Usuario | null) {
    if (u) {
      localStorage.setItem('usuarioActual', JSON.stringify(u));
    } else {
      localStorage.removeItem('usuarioActual');
    }
    this.usuarioActual.next(u);
  }

  getUsuarioActual(): Usuario | null {
    return this.usuarioActual.value;
  }

  // ==========================================
  //   MÉTODOS PÚBLICOS DE AUTENTICACIÓN
  // ==========================================
  registrar(data: Usuario): boolean {
    return this.repo.registrar(data);
  }

  // 🔥 LOGIN REFACTORIZADO y TIPADO
  login(correo: string, clave: string): LoginResultado {
    const email = correo.trim().toLowerCase();
    const pass = clave.trim();

    const usuario = this.repo.login(email, pass);

    if (!usuario) {
      return { ok: false, mensaje: 'Correo o contraseña incorrecta' };
    }

    // Guardar sesión si es válido
    this.guardarSesion(usuario);

    return { ok: true, usuario };
  }

  logout() {
    this.guardarSesion(null);
  }

  // ==========================================
  //   PERFIL / DATOS DEL USUARIO
  // ==========================================
  actualizarUsuario(data: Usuario): boolean {
    const ok = this.repo.actualizar(data);
    if (ok) {
      this.guardarSesion(data);
    }
    return ok;
  }

  cambiarClave(correo: string, nueva: string): boolean {
    return this.repo.cambiarClave(correo, nueva);
  }

  // ==========================================
  //   ADMINISTRACIÓN
  // ==========================================
  buscarPorCorreo(correo: string): Usuario | null {
    const lista = JSON.parse(localStorage.getItem('usuarios') ?? '[]');
    return lista.find((u: Usuario) => u.correo === correo) ?? null;
  }

  listarUsuarios() {
    return this.repo.listarUsuarios();
  }

  actualizarEstado(correo: string, estado: 'active' | 'inactive') {
    return this.repo.actualizarEstado(correo, estado);
  }
}
