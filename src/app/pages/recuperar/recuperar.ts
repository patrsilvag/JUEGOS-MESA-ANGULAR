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

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  ngOnInit() {
    this.formCorreo = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
    });

    this.formCodigo = this.fb.group({
      codigo: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]+$/), // solo números
          Validators.minLength(6), // mínimo 6 dígitos
          Validators.maxLength(6), // máximo 6 dígitos
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
            this.uppercaseValidator(),
            this.numberValidator(),
          ],
        ],
        clave2: ['', Validators.required],
      },
      { validators: this.coincidenClaves() }
    );
 }
  

  // =======================
  //  VALIDADORES PERSONALIZADOS
  // =======================

  uppercaseValidator() {
    return (control: AbstractControl) => {
      const value = control.value || '';
      return /[A-Z]/.test(value) ? null : { uppercase: true };
    };
  }

  numberValidator() {
    return (control: AbstractControl) => {
      const value = control.value || '';
      return /[0-9]/.test(value) ? null : { number: true };
    };
  }

  coincidenClaves() {
    return (group: AbstractControl) => {
      const c1 = group.get('clave')?.value;
      const c2 = group.get('clave2')?.value;
      return c1 === c2 ? null : { noCoinciden: true };
    };
  }

   // =======================
  //  PASO 1
  // =======================

  enviarCorreo() {
    if (this.formCorreo.invalid) return this.formCorreo.markAllAsTouched();

    const correo = this.formCorreo.value.correo;
    const user = this.auth.buscarPorCorreo(correo);

    if (!user) {
      this.formCorreo.get('correo')?.setErrors({ noExiste: true });
      return;
    }

    this.correoValidado = correo;
    this.codigoGenerado = '123456';

    console.log('Código enviado:', this.codigoGenerado);

    this.paso = 2;
  }

  verificarCodigo() {
    if (this.formCodigo.invalid) return this.formCodigo.markAllAsTouched();

    if (this.formCodigo.value.codigo !== this.codigoGenerado) {
      this.formCodigo.setErrors({ incorrecto: true });
      return;
    }

    this.paso = 3;
  }

  actualizarClave() {
    if (this.formClave.invalid) return this.formClave.markAllAsTouched();

    if (this.formClave.value.clave !== this.formClave.value.clave2) {
      this.formClave.setErrors({ noCoinciden: true });
      return;
    }

    const ok = this.auth.cambiarClave(this.correoValidado, this.formClave.value.clave);

    if (!ok) {
      this.formClave.setErrors({ error: true });
      return;
    }

    this.mensajeExito = true;

    setTimeout(() => (this.mensajeExito = false), 2500);

    this.paso = 1;
    this.formCorreo.reset();
    this.formCodigo.reset();
    this.formClave.reset();
  }
}
