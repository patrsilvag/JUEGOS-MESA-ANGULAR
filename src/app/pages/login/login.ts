import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, LoginResultado } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
})
export class LoginComponent {
  form!: FormGroup;
  verClave = false;
  errorLogin = '';

  constructor(private fb: FormBuilder, private authSrv: AuthService, private router: Router) {
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required]],
    });
  }

  campo(nombre: string) {
    return this.form.get(nombre)!;
  }

  submit() {
    if (this.form.invalid) return;

    const { correo, clave } = this.form.value;

    // Tipo explícito para evitar errores de TS
    const resultado: LoginResultado = this.authSrv.login(correo, clave);

    // Caso de error (ok: false)
    if (resultado.ok === false) {
      this.errorLogin = resultado.mensaje;
      return;
    }

    // Caso de éxito (ok: true)
    this.router.navigate(['/']);
  }
}
