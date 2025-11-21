import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';

import { ValidatorsService } from '../../core/validators.service';
import { UserService } from '../../core/user.service';
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

  constructor(
    private fb: FormBuilder,
    private validators: ValidatorsService,
    private userSrv: UserService,
    private authSrv: AuthService
  ) {}

  ngOnInit(): void {
    this.usuario = this.authSrv.getUsuarioActual();

    // FORMULARIO DE DATOS
    this.formDatos = this.fb.group({
      nombre: [this.usuario?.nombre ?? '', Validators.required],
      usuario: [this.usuario?.usuario ?? '', Validators.required],
      correo: [{ value: this.usuario?.correo ?? '', disabled: true }],
      fechaNacimiento: [this.usuario?.fechaNacimiento ?? '', Validators.required],
      direccion: [this.usuario?.direccion ?? ''],
    });

    // FORMULARIO DE CLAVES
    this.formClave = this.fb.group(
      {
        claveActual: ['', Validators.required],
        nuevaClave: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            this.validators.uppercaseValidator(),
            this.validators.numberValidator(),
            this.validators.specialValidator(),
          ],
        ],
        repetirClave: ['', Validators.required],
      },
      {
        validators: this.validators.coincidenClaves('nuevaClave', 'repetirClave'),
      }
    );
  }

  fcDatos(nombre: string): AbstractControl {
    return this.formDatos.get(nombre)!;
  }

  fcClave(nombre: string): AbstractControl {
    return this.formClave.get(nombre)!;
  }

  // ==============================================
  //   GUARDAR DATOS PERSONALES
  // ==============================================
  guardarDatos() {
    if (this.formDatos.invalid) {
      this.formDatos.markAllAsTouched();
      return;
    }

    const data = {
      ...this.usuario,
      ...this.formDatos.getRawValue(),
    };

    const ok = this.userSrv.actualizarPerfil(data);

    if (ok) {
      this.usuario = data;
      this.mensajeExito = true;
      setTimeout(() => (this.mensajeExito = false), 2500);
    }
  }

  // ==============================================
  //   CAMBIAR CONTRASEÑA
  // ==============================================
  actualizarClave() {
    if (this.formClave.invalid) {
      this.formClave.markAllAsTouched();
      return;
    }

    // Validar clave actual desde UserService
    const esCorrecta = this.userSrv.validarClaveActual(
      this.usuario!.correo,
      this.formClave.value.claveActual
    );

    if (!esCorrecta) {
      this.formClave.setErrors({ incorrecta: true });
      return;
    }

    // Cambiar clave
    const ok = this.userSrv.cambiarClave(this.usuario!.correo, this.formClave.value.nuevaClave);

    if (!ok) {
      this.formClave.setErrors({ error: true });
      return;
    }

    this.mensajeExito = true;
    this.formClave.reset();

    setTimeout(() => (this.mensajeExito = false), 2500);
  }
}
