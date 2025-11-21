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
            Validators.maxLength(18),
            this.uppercaseValidator(),
            this.numberValidator(),
          ],
        ],
        repetirClave: ['', Validators.required],
        fechaNacimiento: [
          '',
          [Validators.required, this.fechaFuturaValidator(), this.edadMinimaValidator(13)],
        ],
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

  fechaFuturaValidator() {
    return (control: AbstractControl) => {
      const valor = control.value;
      if (!valor) return null; // si está vacío, otra validación se encarga

      const fecha = new Date(valor);
      const hoy = new Date();

      // Normalizar horas para comparación exacta
      hoy.setHours(0, 0, 0, 0);
      fecha.setHours(0, 0, 0, 0);

      return fecha > hoy ? { fechaFutura: true } : null;
    };
  }

  edadMinimaValidator(minEdad: number) {
    return (control: AbstractControl) => {
      const valor = control.value;
      if (!valor) return null;

      const fechaNacimiento = new Date(valor);
      const hoy = new Date();

      let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const mes = hoy.getMonth() - fechaNacimiento.getMonth();

      // Ajustar si aún no ha cumplido años este año
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
      }

      return edad < minEdad ? { edadMinima: true } : null;
    };
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
