import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { RecuperarComponent } from './recuperar';
import { AuthService } from '../../core/auth.service';
import { Usuario } from '../../core/auth';

describe('RecuperarComponent (Angular 20)', () => {
  let component: RecuperarComponent;
  let fixture: ComponentFixture<RecuperarComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  const usuarioMock: Usuario = {
    nombre: 'Test User',
    usuario: 'tester',
    correo: 'test@mail.com',
    fechaNacimiento: '2000-01-01',
    clave: 'A123456',
    rol: 'cliente',
  };

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['buscarPorCorreo', 'cambiarClave']);

    await TestBed.configureTestingModule({
      imports: [RecuperarComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),

        { provide: AuthService, useValue: authSpy },

        // Evita error NG0201 en RouterLink
        { provide: ActivatedRoute, useValue: { snapshot: { root: {} } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  // -------------------------------------------------------
  //                  PRUEBAS
  // -------------------------------------------------------

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  // ----------------- PASO 1: CORREO -----------------------

  it('debe marcar error si el correo NO está registrado', () => {
    authSpy.buscarPorCorreo.and.returnValue(null); // correo no existe

    component.formCorreo.setValue({ correo: 'inexistente@mail.com' });
    component.enviarCorreo();

    expect(component.formCorreo.get('correo')?.errors?.['noExiste']).toBeTrue();
    expect(component.paso).toBe(1);
  });

  it('debe avanzar al paso 2 si el correo existe', () => {
    authSpy.buscarPorCorreo.and.returnValue(usuarioMock);

    component.formCorreo.setValue({ correo: 'test@mail.com' });
    component.enviarCorreo();

    expect(component.paso).toBe(2);
    expect(component.correoValidado).toBe('test@mail.com');
  });

  // ----------------- PASO 2: CÓDIGO -----------------------

  it('debe rechazar un código incorrecto', () => {
    component.paso = 2;
    component.codigoGenerado = '123456';

    component.formCodigo.setValue({ codigo: '000000' });
    component.verificarCodigo();

    expect(component.formCodigo.errors?.['incorrecto']).toBeTrue();
    expect(component.paso).toBe(2);
  });

  it('debe avanzar al paso 3 si el código es correcto', () => {
    component.paso = 2;
    component.codigoGenerado = '123456';

    component.formCodigo.setValue({ codigo: '123456' });
    component.verificarCodigo();

    expect(component.paso).toBe(3);
  });

  // ----------------- PASO 3: NUEVA CLAVE -----------------------

  it('debe marcar error si las claves NO coinciden', () => {
    component.paso = 3;

    component.formClave.setValue({
      clave: 'A123456',
      clave2: 'ZZZZZZZ',
    });

    component.actualizarClave();

    expect(component.formClave.errors?.['noCoinciden']).toBeTrue();
  });

  it('debe actualizar la contraseña correctamente', () => {
    component.paso = 3;
    component.correoValidado = 'user@mail.com';

    authSpy.cambiarClave.and.returnValue(true);

    component.formClave.setValue({
      clave: 'A123456',
      clave2: 'A123456',
    });

    component.actualizarClave();

    expect(authSpy.cambiarClave).toHaveBeenCalledWith('user@mail.com', 'A123456');
    // No se exige cambio de paso, pero se puede validar éxito si lo deseas
  });
});
