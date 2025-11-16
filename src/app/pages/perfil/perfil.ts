import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class PerfilComponent {
  // ==============================
  // FORMS
  // ==============================
  perfilForm!: FormGroup;
  passForm!: FormGroup;

  // ==============================
  // STATE
  // ==============================
  mensajePerfilOK = false;
  mensajePassOK = false;

  verPassActual = false;
  verPassNueva = false;
  verPassConfirm = false;

  constructor(private fb: FormBuilder) {
    // ---- PERFIL ----
    this.perfilForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      nombreUsuario: ['', [Validators.required, Validators.minLength(3)]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      fechaNacimiento: ['', [Validators.required, this.fechaFuturaValidator()]],
      direccion: [''],
    });

    // ---- PASSWORD ----
    this.passForm = this.fb.group(
      {
        passActual: ['', Validators.required],
        passNueva: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            this.uppercaseValidator(),
            this.numberValidator(),
            this.specialValidator(),
          ],
        ],
        passConfirm: ['', Validators.required],
      },
      { validators: this.clavesIgualesValidator() }
    );
  }

  // ==============================
  // GETTERS
  // ==============================
  perfilCampo(campo: string): AbstractControl {
    return this.perfilForm.get(campo)!;
  }

  passCampo(campo: string): AbstractControl {
    return this.passForm.get(campo)!;
  }

  // ==============================
  // VALIDADORES
  // ==============================
  fechaFuturaValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = new Date(control.value);
      const hoy = new Date();
      return valor > hoy ? { fechaFutura: true } : null;
    };
  }

  uppercaseValidator() {
    return (c: AbstractControl): ValidationErrors | null =>
      /[A-Z]/.test(c.value || '') ? null : { uppercase: true };
  }

  numberValidator() {
    return (c: AbstractControl): ValidationErrors | null =>
      /[0-9]/.test(c.value || '') ? null : { number: true };
  }

  specialValidator() {
    return (c: AbstractControl): ValidationErrors | null =>
      /[^A-Za-z0-9]/.test(c.value || '') ? null : { special: true };
  }

  clavesIgualesValidator() {
    return (group: AbstractControl): ValidationErrors | null => {
      const p1 = group.get('passNueva')?.value;
      const p2 = group.get('passConfirm')?.value;
      return p1 === p2 ? null : { noCoinciden: true };
    };
  }

  // ==============================
  // ACCIONES PERFIL
  // ==============================
  guardarPerfil() {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    this.mensajePerfilOK = true;
    setTimeout(() => (this.mensajePerfilOK = false), 1800);
  }

  resetPerfil() {
    this.perfilForm.reset({
      nombreCompleto: '',
      nombreUsuario: '',
      email: '',
      fechaNacimiento: '',
      direccion: '',
    });
  }

  // ==============================
  // ACCIONES PASSWORD
  // ==============================
  actualizarPassword() {
    if (this.passForm.invalid) {
      this.passForm.markAllAsTouched();
      return;
    }

    this.mensajePassOK = true;
    setTimeout(() => (this.mensajePassOK = false), 1800);
  }

  resetPass() {
    this.passForm.reset();
  }
}
