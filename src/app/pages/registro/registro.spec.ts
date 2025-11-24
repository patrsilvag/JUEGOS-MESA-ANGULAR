import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegistroComponent } from './registro';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UserService } from '../../core/user.service';
import { AuthErrorService } from '../../core/auth-error.service';
import { ValidatorsService } from '../../core/validators.service';
import { Usuario } from '../../core/auth';
import { of } from 'rxjs';

class FakeValidatorsService {
  uppercaseValidator(): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null =>
      /[A-Z]/.test(c.value || '') ? null : { uppercase: true };
  }

  numberValidator(): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null =>
      /\d/.test(c.value || '') ? null : { number: true };
  }

  specialValidator(): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null =>
      /[^A-Za-z0-9]/.test(c.value || '') ? null : { special: true };
  }

  fechaFuturaValidator(): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
      if (!c.value) return null;
      const input = new Date(c.value);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      return input > hoy ? { fechaFutura: true } : null;
    };
  }

  edadMinimaValidator(min: number): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
      if (!c.value) return null;
      const nacimiento = new Date(c.value);
      const hoy = new Date();
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const m = hoy.getMonth() - nacimiento.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
      return edad < min ? { edadMinima: true } : null;
    };
  }

  coincidenClaves(c1: string, c2: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const fg = group as FormGroup;
      const v1 = fg.get(c1)?.value;
      const v2 = fg.get(c2)?.value;
      return v1 === v2 ? null : { noCoinciden: true };
    };
  }
}

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;
  let userSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userSpy = jasmine.createSpyObj('UserService', ['registrarUsuarioApi']);

    await TestBed.configureTestingModule({
      imports: [RegistroComponent],
      providers: [
        { provide: UserService, useValue: userSpy },
        { provide: ValidatorsService, useClass: FakeValidatorsService },
        { provide: AuthErrorService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente y el formulario', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeTruthy();
    expect(component.form.get('nombre')).toBeTruthy();
    expect(component.form.get('correo')).toBeTruthy();
  });

  it('campo(nombre) debe devolver el control correcto', () => {
    const ctrl = component.campo('usuario');
    expect(ctrl).toBe(component.form.get('usuario')!);
  });

  it('limpiar() debe resetear el formulario', () => {
    component.form.patchValue({ nombre: 'X', correo: 'a@b.com' });
    component.limpiar();
    expect(component.form.get('nombre')!.value).toBeNull();
    expect(component.form.get('correo')!.value).toBeNull();
  });

  it('submit() no debe registrar si el formulario es inválido', () => {
    component.submit();
    expect(userSpy.registrarUsuarioApi).not.toHaveBeenCalled();
    expect(component.form.touched).toBeTrue();
  });

  it('debe marcar error noCoinciden si claves no coinciden', () => {
    component.form.setValue({
      nombre: 'Test User',
      usuario: 'tester',
      correo: 'test@mail.com',
      clave: 'A123456!',
      repetirClave: 'B123456!',
      fechaNacimiento: '2000-01-01',
      direccion: '',
    });

    expect(component.form.errors).toEqual({ noCoinciden: true });
  });

  it('submit() debe llamar registrarUsuarioApi con data correcta si formulario válido', fakeAsync(() => {
    const testUsuario: Usuario = {
      nombre: 'Test User',
      usuario: 'tester',
      correo: 'test@mail.com',
      clave: 'A123456!',
      fechaNacimiento: '2000-01-01',
      direccion: 'Calle 123',
      rol: 'cliente',
      status: 'active',
    };

    userSpy.registrarUsuarioApi.and.returnValue(of(testUsuario));

    component.form.setValue({
      nombre: testUsuario.nombre,
      usuario: testUsuario.usuario,
      correo: testUsuario.correo,
      clave: testUsuario.clave,
      repetirClave: testUsuario.clave,
      fechaNacimiento: testUsuario.fechaNacimiento,
      direccion: testUsuario.direccion,
    });

    component.submit();

    expect(userSpy.registrarUsuarioApi).toHaveBeenCalledWith(testUsuario);
    expect(component.mensajeExito).toBeTrue();

    tick(2500);
    expect(component.mensajeExito).toBeFalse();
  }));
});
