import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent {
  form!: FormGroup;
  verClave = false;
  errorLogin = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', Validators.required],
    });
  }

  campo(c: string) {
    return this.form.get(c)!;
  }

  submit() {
    if (this.form.invalid) return;

    const correo = this.campo('correo').value!;
    const clave = this.campo('clave').value!;

    const usuario = this.auth.login(correo, clave);

    if (!usuario) {
      this.errorLogin = 'Correo o contraseña incorrecta';
      return;
    }

    this.router.navigate(['/']);
  }
}
