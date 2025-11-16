import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  // CATEGORÍAS
  {
    path: 'categorias/:slug',
    loadComponent: () => import('./pages/categoria/categoria').then((m) => m.CategoriaComponent),
  },
  {
    path: 'categorias',
    loadChildren: () => import('./pages/categoria/categoria.routes').then((m) => m.categoriaRoutes),
  },

  // CARRITO
  {
    path: 'carrito',
    loadComponent: () => import('./pages/carrito/carrito').then((m) => m.CarritoComponent),
  },

  // REGISTRO
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro').then((m) => m.RegistroComponent),
  },

  // LOGIN
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginComponent),
  },

  // RECUPERAR
  {
    path: 'recuperar',
    loadComponent: () => import('./pages/recuperar/recuperar').then((m) => m.RecuperarComponent),
  },

  // PERFIL
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil').then((m) => m.PerfilComponent),
  },

  // HOME
  { path: '', component: Home },
];
