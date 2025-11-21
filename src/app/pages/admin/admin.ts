import { Component, OnInit } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
  standalone: true,
  imports: [
    CommonModule, // Necesario para *ngIf y *ngFor
    ReactiveFormsModule, // Necesario para formGroup, formControlName
    JsonPipe, // Necesario para | json
  ],
})
export class AdminComponent implements OnInit {
  filtroForm!: FormGroup;
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  error: string | null = null;
  debug = false; // Mostrar estado del formulario solo si está en true
  
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.filtroForm = this.fb.group({
      correo: ['', [Validators.email]],
      rol: [''],
      estado: [''],
    });

    this.filtroForm.valueChanges.subscribe(() => this.filtrar());

    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarios = [
      { correo: 'admin@site.com', usuario: 'Admin', rol: 'admin', status: 'active' },
      { correo: 'user@site.com', usuario: 'User', rol: 'cliente', status: 'inactive' },
    ];
    this.usuariosFiltrados = [...this.usuarios];
  }

  filtrar() {
    const { correo, rol, estado } = this.filtroForm.value;

    this.usuariosFiltrados = this.usuarios.filter(
      (u) =>
        (correo ? u.correo.includes(correo) : true) &&
        (rol ? u.rol === rol : true) &&
        (estado ? u.status === estado : true)
    );
  }

  resetFiltro() {
    this.filtroForm.reset();
  }

  toggleEstado(u: any) {
    u.status = u.status === 'active' ? 'inactive' : 'active';
    this.filtrar();
  }
}
