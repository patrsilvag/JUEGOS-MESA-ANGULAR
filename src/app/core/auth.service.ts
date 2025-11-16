import { Injectable } from '@angular/core';
import {
  addUser,
  findUserByEmail,
  findUserByUsername,
  getCurrentUser,
  setCurrentUser,
  sha256,
  User,
  ROLES,
  ensureAdminSeed,
  updateUser,
  getResetCode,
  setResetCode,
  clearResetCode,
} from './auth.repository';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {
    // Crear el admin inicial si no existe
    ensureAdminSeed();
  }

  // =======================================================
  // REGISTRO
  // =======================================================
  async registrar(data: {
    email: string;
    nombreUsuario: string;
    nombreCompleto: string;
    fechaNacimiento?: string;
    direccion?: string;
    password: string;
  }): Promise<{ ok: true } | { ok: false; error: string }> {
    if (findUserByEmail(data.email)) {
      return { ok: false, error: 'El correo ya está registrado.' };
    }

    if (findUserByUsername(data.nombreUsuario)) {
      return { ok: false, error: 'El nombre de usuario ya existe.' };
    }

    const passwordHash = await sha256(data.password);

    const nuevo: User = {
      email: data.email,
      nombreUsuario: data.nombreUsuario,
      nombreCompleto: data.nombreCompleto,
      fechaNacimiento: data.fechaNacimiento,
      direccion: data.direccion,
      passwordHash,
      role: ROLES.CLIENTE,
      status: 'active',
    };

    addUser(nuevo);

    return { ok: true };
  }

  // =======================================================
  // LOGIN
  // =======================================================
  async login(
    email: string,
    password: string
  ): Promise<{ ok: true } | { ok: false; error: string }> {
    const user = findUserByEmail(email);

    if (!user) {
      return { ok: false, error: 'Credenciales incorrectas.' };
    }

    if (user.status !== 'active') {
      return { ok: false, error: 'La cuenta está desactivada.' };
    }

    const passwordHash = await sha256(password);

    if (passwordHash !== user.passwordHash) {
      return { ok: false, error: 'Credenciales incorrectas.' };
    }

    setCurrentUser(user);
    return { ok: true };
  }

  // =======================================================
  // LOGOUT
  // =======================================================
  logout() {
    setCurrentUser(null);
  }

  // =======================================================
  // GET USUARIO ACTUAL
  // =======================================================
  getUsuarioActual(): User | null {
    return getCurrentUser();
  }

  estaLogueado(): boolean {
    return getCurrentUser() !== null;
  }

  esAdmin(): boolean {
    const u = getCurrentUser();
    return u?.role === ROLES.ADMIN;
  }

  // =======================================================
  // RECUPERAR CONTRASEÑA — Paso 1 (Solicitar código)
  // =======================================================
  generarCodigoReset(email: string): { ok: true } | { ok: false; error: string } {
    const user = findUserByEmail(email);
    if (!user) return { ok: false, error: 'El correo no existe.' };

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setResetCode(email, code);

    // Aquí podrías "enviar" el código, por ahora se guarda y se validará
    console.log('Código de verificación:', code);

    return { ok: true };
  }

  // =======================================================
  // RECUPERAR CONTRASEÑA — Paso 2 (Validar código)
  // =======================================================
  validarCodigo(email: string, codeIngresado: string): { ok: true } | { ok: false; error: string } {
    const code = getResetCode(email);
    if (!code || code !== codeIngresado) return { ok: false, error: 'Código incorrecto.' };

    return { ok: true };
  }

  // =======================================================
  // RECUPERAR CONTRASEÑA — Paso 3 (Actualizar clave)
  // =======================================================
  async actualizarClave(email: string, nuevaClave: string): Promise<{ ok: true }> {
    const user = findUserByEmail(email);
    if (!user) throw new Error('Usuario no encontrado');

    user.passwordHash = await sha256(nuevaClave);
    updateUser(user);
    clearResetCode(email);

    return { ok: true };
  }
}
