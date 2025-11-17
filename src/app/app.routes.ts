import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro').then((m) => m.RegistroComponent),
  },
  {
    path: 'recuperar',
    loadComponent: () => import('./pages/recuperar/recuperar').then((m) => m.RecuperarComponent),
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil').then((m) => m.PerfilComponent),
  },
  {
    path: 'carrito',
    loadComponent: () => import('./pages/carrito/carrito').then((m) => m.CarritoComponent),
  },
  {
    path: 'categoria/:id',
    loadComponent: () => import('./pages/categoria/categoria').then((m) => m.CategoriaComponent),
  },
  // CATEGORÍAS
  {
    path: 'categorias/:slug',
    loadComponent: () => import('./pages/categoria/categoria').then((m) => m.CategoriaComponent),
  },
  {
    path: 'categorias',
    loadChildren: () => import('./pages/categoria/categoria.routes').then((m) => m.categoriaRoutes),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
