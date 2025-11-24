import { ApplicationConfig, provideZoneChangeDetection, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { GlobalErrorHandler } from './core/global-error-handler';
import { provideHttpClient } from '@angular/common/http'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // ✅ habilita HttpClient en toda la app
    provideHttpClient(),
    // ⬇️ Registro del manejador global de errores
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
