import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import('./pages/registro/registro/registro');

export const routes: Routes = [
  {
    path: 'categorias/:slug',
    loadComponent: () => import('./pages/categoria/categoria').then((m) => m.CategoriaComponent),
  },
  {
    path: 'categorias',
    loadChildren: () => import('./pages/categoria/categoria.routes').then((m) => m.categoriaRoutes),
  },
  {
    path: 'carrito',
    loadComponent: () => import('./pages/carrito/carrito').then((m) => m.CarritoComponent),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro/registro').then((m) => m.RegistroComponent),
  },
  { path: '', component: Home },
];
