import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'noticias', loadComponent: () => import('./pages/noticias/noticias').then(m => m.Noticias) },
  { path: 'noticias/:slug', loadComponent: () => import('./pages/noticia-detalle/noticia-detalle').then(m => m.NoticiaDetalle) },
  { path: 'funciones', loadComponent: () => import('./pages/funciones/funciones').then(m => m.Funciones) },
  { path: 'obras/:id', loadComponent: () => import('./pages/obra-detalle/obra-detalle').then(m => m.ObraDetalle) },
  { path: 'elenco', loadComponent: () => import('./pages/elenco/elenco').then(m => m.Elenco) },
  { path: 'convocatorias', loadComponent: () => import('./pages/convocatorias/convocatorias').then(m => m.Convocatorias) },
  { path: 'reservas', loadComponent: () => import('./pages/reservas/reservas').then(m => m.Reservas) },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'registro', loadComponent: () => import('./pages/register/register').then(m => m.Register) },
  { path: 'perfil', canActivate: [authGuard], loadComponent: () => import('./pages/perfil/perfil').then(m => m.Perfil) },
  { path: '**', redirectTo: '' }
];
