import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  mostrarPassword = false;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    // Inicialización correcta del formulario
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // Acceso rápido a controles
  campo(nombre: string) {
    return this.form.get(nombre)!;
  }

  // Toggle para mostrar/ocultar contraseña
  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  // Enviar formulario
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log('Login:', this.form.value);
  }
}
