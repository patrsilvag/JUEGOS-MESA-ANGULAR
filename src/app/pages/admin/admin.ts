import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { Usuario } from '../../core/auth';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
})
export class AdminComponent {
  usuarios: Usuario[] = [];
  error: string | null = null;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    try {
      this.usuarios = this.auth.listarUsuarios(); // usa el servicio, no repo directo
    } catch (e) {
      this.error = 'Error cargando usuarios';
    }
  }

  toggleEstado(u: Usuario) {
    const nuevoEstado = u.status === 'active' ? 'inactive' : 'active';

    const ok = this.auth.actualizarEstado(u.correo, nuevoEstado);

    if (!ok) {
      this.error = 'No se pudo actualizar el estado.';
      return;
    }

    u.status = nuevoEstado; // reflejar en UI
  }
}
