import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Usuario } from '../../core/auth';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
})
export class AdminComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];

  filtroForm!: FormGroup;
  error: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  ngOnInit() {
    // Formulario reactivo
    this.filtroForm = this.fb.group({
      correo: ['', [Validators.email]],
      rol: [''],
      estado: [''],
    });

    // Cargar usuarios
    this.usuarios = this.auth.listarUsuarios();

    this.usuariosFiltrados = [...this.usuarios];

    // Detectar cambios del formulario
    this.filtroForm.valueChanges.subscribe(() => this.aplicarFiltro());
  }

  aplicarFiltro() {
    const { correo, rol, estado } = this.filtroForm.value;

    this.usuariosFiltrados = this.usuarios.filter((u) => {
      return (
        (!correo || u.correo.includes(correo)) &&
        (!rol || u.rol === rol) &&
        (!estado || u.status === estado)
      );
    });
  }

  toggleEstado(u: Usuario) {
    const nuevoEstado = u.status === 'active' ? 'inactive' : 'active';

    const ok = this.auth.actualizarEstado(u.correo, nuevoEstado);

    if (!ok) {
      this.error = 'No se pudo actualizar el estado.';
      return;
    }

    u.status = nuevoEstado;
    this.aplicarFiltro(); // Para actualizar la vista según el filtro
  }
}
