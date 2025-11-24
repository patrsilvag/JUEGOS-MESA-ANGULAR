import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
} from '@angular/forms';

import { ValidatorsService } from '../../core/validators.service';
import { UserService } from '../../core/user.service';
import { AuthErrorService } from '../../core/auth-error.service';
import { Usuario } from '../../core/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.scss'],
})
export class RegistroComponent implements OnInit {
  form!: FormGroup;
  mensajeExito = false;

  verClave = false;
  verClave2 = false;

  // ✅ mensaje de error centralizado (texto viene de AuthErrorService)
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private validators: ValidatorsService,
    private userSrv: UserService,
    private err: AuthErrorService
  ) {}

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
            this.validators.uppercaseValidator(),
            this.validators.numberValidator(),
          ],
        ],
        repetirClave: ['', Validators.required],
        fechaNacimiento: [
          '',
          [
            Validators.required,
            this.validators.fechaFuturaValidator(),
            this.validators.edadMinimaValidator(13),
          ],
        ],
        direccion: [''], // opcional
      },
      {
        validators: this.validators.coincidenClaves('clave', 'repetirClave'),
      }
    );
    // ✅ Limpia mensaje global cuando el usuario edita el formulario
    this.form.valueChanges.subscribe(() => {
      this.errorMsg = '';
    });

    // ✅ Limpia el error "existe" apenas cambia el correo
    this.campo('correo').valueChanges.subscribe(() => {
      const correoCtrl = this.campo('correo');
      if (correoCtrl.hasError('existe')) {
        const errors = { ...correoCtrl.errors };
        delete errors['existe'];
        correoCtrl.setErrors(Object.keys(errors).length ? errors : null);
      }
    });
  }

  campo(nombre: string): AbstractControl {
    return this.form.get(nombre)!;
  }

  limpiar() {
    this.form.reset();
    this.errorMsg = '';
    this.mensajeExito = false;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data: Usuario = {
      nombre: this.form.value.nombre!,
      usuario: this.form.value.usuario!,
      correo: this.form.value.correo!,
      clave: this.form.value.clave!,
      fechaNacimiento: this.form.value.fechaNacimiento!,
      direccion: this.form.value.direccion ?? null, // ✅ nullable
      rol: 'cliente',
      status: 'active', // ✅ backend alineado a front
    };

    this.errorMsg = '';
    this.mensajeExito = false;

    // ✅ llamar backend (no localStorage)
    this.userSrv.registrarUsuarioApi(data).subscribe({
      next: () => {
        this.mensajeExito = true;
        this.form.reset();
        setTimeout(() => (this.mensajeExito = false), 2500);
      },
      error: (e) => {
        let code = 'ERROR_INESPERADO';

        if (e?.status === 409) {
          // correo duplicado (si backend lo implementa)
          this.form.get('correo')?.setErrors({ existe: true });
          code = 'USUARIO_YA_EXISTE';
        } else if (e?.status === 400) {
          code = 'CAMPOS_INVALIDOS';
        }

        this.errorMsg = this.err.getMensaje(code);
        console.error(e);
      },
    });
  }
}
