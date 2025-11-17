import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
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
      codigo: ['', Validators.required],
    });

    this.formClave = this.fb.group({
      clave: ['', [Validators.required, Validators.minLength(6)]],
      clave2: ['', Validators.required],
    });
  }

  enviarCorreo() {
    if (this.formCorreo.invalid) return this.formCorreo.markAllAsTouched();

    const correo = this.formCorreo.value.correo;
    const user = this.auth.buscarPorCorreo(correo);

    if (!user) {
      this.formCorreo.setErrors({ noExiste: true });
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
