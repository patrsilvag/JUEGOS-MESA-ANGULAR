import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
} from '@angular/forms';

import { UserService } from '../../core/user.service';
import { ValidatorsService } from '../../core/validators.service';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recuperar.html',
  styleUrls: ['./recuperar.scss'],
})
export class RecuperarComponent {
  paso = 1;
  mensajeExito = false;
  codigoGenerado = '';
  correoValidado = '';

  verClave = false;
  verClave2 = false;

  formCorreo!: FormGroup;
  formCodigo!: FormGroup;
  formClave!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userSrv: UserService,
    private validators: ValidatorsService
  ) {}

  ngOnInit() {
    this.formCorreo = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
    });

    this.formCodigo = this.fb.group({
      codigo: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
          Validators.minLength(6),
          Validators.maxLength(6),
        ],
      ],
    });

    this.formClave = this.fb.group(
      {
        clave: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(18),
            this.validators.uppercaseValidator(),
            this.validators.numberValidator(),
            this.validators.specialValidator(),
          ],
        ],
        clave2: ['', Validators.required],
      },
      { validators: this.validators.coincidenClaves('clave', 'clave2') }
    );
  }

  // === GETTERS ===
  fc(c: string): AbstractControl {
    return this.formClave.get(c)!;
  }

  // =======================
  // PASO 1 → Validar correo
  // =======================
  enviarCorreo() {
    if (this.formCorreo.invalid) return this.formCorreo.markAllAsTouched();

    const correo = this.formCorreo.value.correo;
    const user = this.userSrv.buscarPorCorreo(correo);

    if (!user) {
      this.formCorreo.get('correo')?.setErrors({ noExiste: true });
      return;
    }

    this.correoValidado = correo;
    this.codigoGenerado = '123456'; // Simulado

    console.log('Código enviado:', this.codigoGenerado);

    this.paso = 2;
  }

  // =======================
  // PASO 2 → Validar código
  // =======================
  verificarCodigo() {
    if (this.formCodigo.invalid) return this.formCodigo.markAllAsTouched();

    if (this.formCodigo.value.codigo !== this.codigoGenerado) {
      this.formCodigo.setErrors({ incorrecto: true });
      return;
    }

    this.paso = 3;
  }

  // =======================
  // PASO 3 → Cambiar clave
  // =======================
  actualizarClave() {
    if (this.formClave.invalid) return this.formClave.markAllAsTouched();

    const ok = this.userSrv.cambiarClave(this.correoValidado, this.formClave.value.clave);

    if (!ok) {
      this.formClave.setErrors({ error: true });
      return;
    }

    this.mensajeExito = true;

    setTimeout(() => (this.mensajeExito = false), 2500);

    // Reiniciar flujo
    this.paso = 1;
    this.formCorreo.reset();
    this.formCodigo.reset();
    this.formClave.reset();
  }
}
