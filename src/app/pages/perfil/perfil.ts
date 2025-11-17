import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class PerfilComponent implements OnInit {
  usuario: any = null;
  mensajeExito = false;

  verActual = false;
  verNueva = false;
  verRepetir = false;

  formDatos!: FormGroup;
  formClave!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  ngOnInit(): void {
    // Ahora sí puedes usar this.auth
    this.usuario = this.auth.getUsuarioActual();

    // ================
    // FORM DATOS
    // ================
    this.formDatos = this.fb.group({
      nombre: [this.usuario?.nombre ?? '', Validators.required],
      usuario: [this.usuario?.usuario ?? '', Validators.required],
      correo: [{ value: this.usuario?.correo ?? '', disabled: true }],
      fechaNacimiento: [this.usuario?.fechaNacimiento ?? '', Validators.required],
      direccion: [this.usuario?.direccion ?? ''],
    });

    // ================
    // FORM CLAVE
    // ================
    this.formClave = this.fb.group(
      {
        claveActual: ['', Validators.required],
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
      { validators: this.coincidenClaves() }
    );
  }

  // ================================
  // GETTERS
  // ================================
  fcDatos(nombre: string): AbstractControl {
    return this.formDatos.get(nombre)!;
  }

  fcClave(nombre: string): AbstractControl {
    return this.formClave.get(nombre)!;
  }

  // ================================
  // VALIDADORES
  // ================================
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
    return (group: AbstractControl) => {
      const c1 = group.get('nuevaClave')?.value;
      const c2 = group.get('repetirClave')?.value;
      return c1 === c2 ? null : { noCoinciden: true };
    };
  }

  // ================================
  // GUARDAR DATOS PERSONALES
  // ================================
  guardarDatos() {
    if (this.formDatos.invalid) return this.formDatos.markAllAsTouched();

    const data = {
      ...this.usuario,
      ...this.formDatos.getRawValue(), // correo incluido aunque disabled
    };

    this.auth.actualizarUsuario(data);
    this.usuario = data;

    this.mensajeExito = true;
    setTimeout(() => (this.mensajeExito = false), 2500);
  }

  // ================================
  // CAMBIAR CONTRASEÑA
  // ================================
  actualizarClave() {
    if (this.formClave.invalid) {
      this.formClave.markAllAsTouched();
      return;
    }

    // 1) Validar coincidencia
    if (this.formClave.value.nuevaClave !== this.formClave.value.repetirClave) {
      this.formClave.setErrors({ noCoinciden: true });
      return;
    }

    // 2) Validar contraseña actual manualmente
    if (this.formClave.value.claveActual !== this.usuario!.clave) {
      this.formClave.setErrors({ incorrecta: true });
      return;
    }

    // 3) Llamada correcta (solo 2 parámetros)
    const ok = this.auth.cambiarClave(this.usuario!.correo, this.formClave.value.nuevaClave!);

    if (!ok) {
      this.formClave.setErrors({ error: true });
      return;
    }

    this.mensajeExito = true;
    this.formClave.reset();
    setTimeout(() => (this.mensajeExito = false), 2500);
  }
}
