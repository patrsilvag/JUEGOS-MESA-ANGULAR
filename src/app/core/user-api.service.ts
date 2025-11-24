import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario } from './auth';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private baseUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  // POST real al backend
  registrar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl, usuario);
  }

  // opcional: si luego quieres validar existencia
  getByCorreo(correo: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${encodeURIComponent(correo)}`);
  }
}
