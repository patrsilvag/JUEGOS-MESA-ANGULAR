import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.scss'],
})
export class RegistroComponent {
  form!: FormGroup;
  mensajeExito = false;

  verClave = false;
  verClave2 = false;

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  ngOnInit() {
    this.form = this.fb.group(
      {
        nombre: ['', Validators.required],
        usuario: ['', [Validators.required, Validators.minLength(3)]],
        correo: ['', [Validators.required, Validators.email]],
        clave: [
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
        fechaNacimiento: ['', Validators.required],
        direccion: [''],
      },
      { validators: this.coincidenClaves() }
    );
  }

  campo(nombre: string): AbstractControl {
    return this.form.get(nombre)!;
  }

  // Validadores personalizados
  uppercaseValidator() {
    return (c: AbstractControl) => (/[A-Z]/.test(c.value || '') ? null : { uppercase: true });
  }
  numberValidator() {
    return (c: AbstractControl) => (/[0-9]/.test(c.value || '') ? null : { number: true });
  }
  specialValidator() {
    return (c: AbstractControl) => (/[^A-Za-z0-9]/.test(c.value || '') ? null : { special: true });
  }

  coincidenClaves() {
    return (group: AbstractControl) =>
      group.get('clave')?.value === group.get('repetirClave')?.value ? null : { noCoinciden: true };
  }

  limpiar() {
    this.form.reset();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data = {
      nombre: this.form.value.nombre!,
      usuario: this.form.value.usuario!,
      correo: this.form.value.correo!,
      clave: this.form.value.clave!,
      fechaNacimiento: this.form.value.fechaNacimiento!,
      direccion: this.form.value.direccion || '',
      rol: 'cliente' as const,
    };

    const ok = this.auth.registrar(data);

    if (!ok) {
      this.form.get('correo')?.setErrors({ existe: true });
      return;
    }

    this.mensajeExito = true;
    this.form.reset();

    setTimeout(() => (this.mensajeExito = false), 2500);
  }
}
