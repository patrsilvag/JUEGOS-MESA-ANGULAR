import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { AuthErrorService } from '../../core/auth-error.service';

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

  // Cambiar a true para usar login contra el backend
  usarApi = true;

  constructor(
    private fb: FormBuilder,
    private authSrv: AuthService,
    private err: AuthErrorService,
    private router: Router
  ) {
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
    this.errorLogin = '';

    if (this.usarApi) {
      // Login contra backend
      this.authSrv.loginApi(correo, clave).subscribe({
        next: (resultado) => {
          if (resultado.ok) {
            this.router.navigate(['/']);
          } else {
            this.errorLogin = resultado.mensaje;
          }
        },
        error: (e) => {
          console.error(e);
          this.errorLogin = this.err.errorInesperado();
        },
      });
    } else {
      // Login local (in-memory)
      const resultado = this.authSrv.login(correo, clave);
      if (resultado.ok) {
        this.router.navigate(['/']);
      } else {
        this.errorLogin = resultado.mensaje;
      }
    }
  }
}
