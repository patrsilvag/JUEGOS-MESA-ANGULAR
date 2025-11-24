import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Usuario } from './auth';
import { AuthErrorService } from './auth-error.service';
import { environment } from '../../environments/environment';

export type LoginResultado = { ok: true; usuario: Usuario } | { ok: false; mensaje: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usuarioActual = new BehaviorSubject<Usuario | null>(null);
  usuarioActual$ = this.usuarioActual.asObservable();

  private baseUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient, private err: AuthErrorService) {
    this.cargarUsuarioActual();
  }

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

  // ✅ login clásico en memoria (por ahora)
  login(correo: string, clave: string): LoginResultado {
    try {
      const email = correo.trim().toLowerCase();
      const pass = clave.trim();

      // ⚠️ Temporal: usuario hardcoded (remplazar con lógica real si aplica)
      const raw = localStorage.getItem('usuarioActual');
      const usuario: Usuario | null = raw ? JSON.parse(raw) : null;

      if (!usuario || usuario.correo !== email || usuario.clave !== pass) {
        return { ok: false, mensaje: this.err.credencialesInvalidas() };
      }

      this.guardarSesion(usuario);
      return { ok: true, usuario };
    } catch (error) {
      console.error('Error en AuthService.login():', error);
      return { ok: false, mensaje: this.err.errorInesperado() };
    }
  }

  // ✅ login con backend
  loginApi(correo: string, clave: string): Observable<LoginResultado> {
    const body = { correo: correo.trim().toLowerCase(), clave: clave.trim() };

    return this.http.post<Usuario>(`${this.baseUrl}/login`, body).pipe(
      map((usuario): LoginResultado => {
        this.guardarSesion(usuario);
        return { ok: true, usuario };
      }),
      catchError((err): Observable<LoginResultado> => {
        let msg = this.err.errorInesperado();
        if (err.status === 401) {
          msg = this.err.credencialesInvalidas();
        }
        return of({ ok: false, mensaje: msg });
      })
    );
  }

  logout() {
    this.guardarSesion(null);
  }
}
