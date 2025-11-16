import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  templateUrl: './recuperar.html',
  styleUrls: ['./recuperar.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class RecuperarComponent {
  // ---------------------------
  // CONSTANTE DEL CÓDIGO
  // ---------------------------
  readonly CODIGO_VERIFICACION = '123456';

  // ---------------------------
  // ESTADO DEL FLUJO
  // ---------------------------
  paso: 1 | 2 | 3 = 1;
  mensajeExito = false;
  verClave = false;
  verClave2 = false;

  // ---------------------------
  // FORMULARIO TIPADO
  // ---------------------------
  form!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group(
      {
        correo: ['', [Validators.required, Validators.email]],

        code: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(6),
            Validators.pattern(/^[0-9]+$/),
          ],
        ],

        nuevaClave: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            this.uppercaseValidator(),
            this.numberValidator(),
            this.specialValidator(),
          ],
        ],

        repetirClave: ['', Validators.required],
      },
      { validators: this.clavesIgualesValidator() }
    );
  }

  // ---------------------------
  // GETTER DE CONTROLES
  // ---------------------------
  campo(nombre: string): AbstractControl {
    return this.form.get(nombre)!;
  }

  // ---------------------------
  // VALIDADORES PERSONALIZADOS
  // ---------------------------
  uppercaseValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = control.value || '';
      return /[A-Z]/.test(v) ? null : { uppercase: true };
    };
  }

  numberValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = control.value || '';
      return /[0-9]/.test(v) ? null : { number: true };
    };
  }

  specialValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = control.value || '';
      return /[^A-Za-z0-9]/.test(v) ? null : { special: true };
    };
  }

  clavesIgualesValidator() {
    return (group: AbstractControl): ValidationErrors | null => {
      const c1 = group.get('nuevaClave')?.value;
      const c2 = group.get('repetirClave')?.value;

      if (!c1 || !c2) return null;
      return c1 === c2 ? null : { noCoinciden: true };
    };
  }

  // ---------------------------
  // FLUJO DE PASOS
  // ---------------------------

  enviarCorreo() {
    if (this.campo('correo').invalid) {
      this.campo('correo').markAsTouched();
      return;
    }
    this.paso = 2;
  }

  verificarCodigo() {
    if (this.campo('code').invalid) {
      this.campo('code').markAsTouched();
      return;
    }

    if (this.form.value.code !== this.CODIGO_VERIFICACION) {
      this.campo('code').setErrors({ incorrecto: true });
      return;
    }

    this.paso = 3;
  }

  actualizarClave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.mensajeExito = true;

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
  }
}
