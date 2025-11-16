import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class LoginComponent {
  form!: FormGroup;
  verClave = false;
  errorLogin: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      usuario: ['', Validators.required],
      clave: ['', Validators.required],
    });
  }

  campo(nombre: string) {
    return this.form.get(nombre)!;
  }

  submit() {
    this.errorLogin = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Por ahora solo navegamos si es válido.
    // Aquí luego podrás conectar AuthService / localStorage según lo que diga el profe.
    this.router.navigate(['/home']);
  }
}
