import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redireciona raiz para dashboard
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  // Shell principal com navbar (contém o <router-outlet> interno)
  {
    path: '',
    loadComponent: () =>
      import('./layout/shell/shell.component').then(m => m.ShellComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },

      // ── Usuários ──────────────────────────────────────────────
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/usuarios/pages/list-usuario/list-usuario.component').then(m => m.ListUsuarioComponent),
      },
      {
        path: 'usuarios/novo',
        loadComponent: () =>
          import('./features/usuarios/pages/create-usuario/create-usuario.component').then(m => m.CreateUsuarioComponent),
      },
      {
        path: 'usuarios/editar/:id',
        loadComponent: () =>
          import('./features/usuarios/pages/create-usuario/create-usuario.component').then(m => m.CreateUsuarioComponent),
      },

      // ── Grupos ────────────────────────────────────────────────
      {
        path: 'grupos',
        loadComponent: () =>
          import('./features/grupos-usuario/pages/list-grupo/list-grupo.component').then(m => m.ListGrupoComponent),
      },
      {
        path: 'grupos/novo',
        loadComponent: () =>
          import('./features/grupos-usuario/pages/create-grupo/create-grupo.component').then(m => m.CreateGrupoComponent),
      },
      {
        path: 'grupos/editar/:id',
        loadComponent: () =>
          import('./features/grupos-usuario/pages/create-grupo/create-grupo.component').then(m => m.CreateGrupoComponent),
      },
    ],
  },

  // Fallback
  { path: '**', redirectTo: 'dashboard' },
];
