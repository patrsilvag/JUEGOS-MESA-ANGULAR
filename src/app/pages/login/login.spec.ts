import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { AuthService } from '../../core/auth.service';
import { ActivatedRoute, provideRouter, Router, RouterLink } from '@angular/router';

describe('LoginComponent (Angular 20)', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterLink],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authSpy },

        // evitar error rootRoute
        { provide: ActivatedRoute, useValue: { snapshot: { root: {} } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate'); // ← EL SPY CORRECTO

    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe tener el formulario inválido cuando los campos están vacíos', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('debe iniciar sesión y navegar si credenciales válidas', () => {
    const usuarioMock = {
      id: 1,
      nombre: 'Test',
      usuario: 'tester',
      correo: 'test@mail.com',
      fechaNacimiento: '2000-01-01',
      clave: 'A123456',
      rol: 'cliente',
    } as const;

    authSpy.login.and.returnValue(usuarioMock);

    component.form.setValue({
      correo: 'test@mail.com',
      clave: 'A123456',
    });

    component.submit();

    expect(authSpy.login).toHaveBeenCalledWith('test@mail.com', 'A123456');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('debe mostrar error si credenciales inválidas', () => {
    authSpy.login.and.returnValue(null);

    component.form.setValue({
      correo: 'test@mail.com',
      clave: 'incorrecta',
    });

    component.submit();

    expect(authSpy.login).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.errorLogin).toBe('Correo o contraseña incorrecta');
  });

  it('no debe llamar login si formulario inválido', () => {
    component.submit();
    expect(authSpy.login).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
