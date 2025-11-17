import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from './auth';
import { AuthRepository } from './auth.repository';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usuarioActual = new BehaviorSubject<Usuario | null>(null);

  usuarioActual$ = this.usuarioActual.asObservable();

  constructor(private repo: AuthRepository) {
    this.cargarUsuarioActual();
  }

  private cargarUsuarioActual() {
    const raw = localStorage.getItem('usuarioActual');
    this.usuarioActual.next(raw ? JSON.parse(raw) : null);
  }

  private guardarSesion(u: Usuario | null) {
    if (u) localStorage.setItem('usuarioActual', JSON.stringify(u));
    else localStorage.removeItem('usuarioActual');

    this.usuarioActual.next(u);
  }

  getUsuarioActual(): Usuario | null {
    return this.usuarioActual.value;
  }

  // ==========================================
  // AUTH PUBLICA
  // ==========================================
  registrar(data: Usuario): boolean {
    return this.repo.registrar(data);
  }

  login(correo: string, clave: string): Usuario | null {
    const usuario = this.repo.login(correo, clave);
    if (usuario) this.guardarSesion(usuario);
    return usuario;
  }

  logout() {
    this.guardarSesion(null);
  }

  actualizarUsuario(data: Usuario): boolean {
    const ok = this.repo.actualizar(data);
    if (ok) this.guardarSesion(data);
    return ok;
  }

  cambiarClave(correo: string, nueva: string): boolean {
    const ok = this.repo.cambiarClave(correo, nueva);
    return ok;
  }

  buscarPorCorreo(correo: string): Usuario | null {
    const lista = JSON.parse(localStorage.getItem('usuarios') ?? '[]');
    return lista.find((u: Usuario) => u.correo === correo) ?? null;
  }
}
