import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  FormGroup,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.scss'],
})
export class RegistroComponent {
  form!: FormGroup;

  verClave = false;
  verClave2 = false;

  // Mensaje de éxito
  mensajeExito = false;

  constructor(private fb: FormBuilder) {
    this.crearFormulario(); // Inicialización correcta
  }

  // =====================================
  // FORMULARIO TIPADO
  // =====================================
  crearFormulario() {
    this.form = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        usuario: ['', [Validators.required, Validators.minLength(3)]],
        correo: ['', [Validators.required, Validators.email]],
        clave: ['', [Validators.required, this.passwordValidator]],
        repetirClave: ['', Validators.required],
        fechaNacimiento: ['', [Validators.required, this.fechaNoFutura]],
        direccion: [''],
      },
      { validators: this.clavesIguales }
    );
  }

  campo(c: string): AbstractControl {
    return this.form.get(c)!;
  }

  // =====================================
  // VALIDADORES PERSONALIZADOS
  // =====================================

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const v = control.value || '';
    const errors: any = {};

    if (v.length < 6) errors['minLength'] = true;
    if (!/[A-Z]/.test(v)) errors['uppercase'] = true;
    if (!/[0-9]/.test(v)) errors['number'] = true;
    if (!/[^A-Za-z0-9]/.test(v)) errors['special'] = true;

    return Object.keys(errors).length ? errors : null;
  }

  fechaNoFutura(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const hoy = new Date();
    const fecha = new Date(control.value);
    return fecha > hoy ? { fechaFutura: true } : null;
  }

  clavesIguales(group: AbstractControl): ValidationErrors | null {
    const c1 = group.get('clave')?.value;
    const c2 = group.get('repetirClave')?.value;

    return c1 && c2 && c1 !== c2 ? { noCoinciden: true } : null;
  }

  // =====================================
  // ACCIONES
  // =====================================

  limpiar() {
    this.form.reset();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Mostrar mensaje de éxito
    this.mensajeExito = true;

    // Ocultar luego de 3 segundos
    setTimeout(() => {
      this.mensajeExito = false;
    }, 3000);

    // Reset del formulario
    this.form.reset();
  }
}
