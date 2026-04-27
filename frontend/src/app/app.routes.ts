import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redireciona raiz para login/dashboard
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  // Shell principal — contém navbar e <router-outlet> interno
  {
    path: '',
    loadComponent: () =>
      import('./layout/shell/shell.component').then(m => m.ShellComponent),
    children: [

      // ── Dashboard ─────────────────────────────────────────────
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
          import('./features/usuarios/pages/edit-usuario/edit-usuario.component').then(m => m.EditUsuarioComponent),
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

      // ── Comunicados ───────────────────────────────────────────
      {
        path: 'comunicados',
        loadComponent: () =>
          import('./features/comunicados/pages/list-comunicados/list-comunicados.component').then(m => m.ListComunicadosComponent),
      },
      {
        path: 'comunicados/criar',
        loadComponent: () =>
          import('./features/comunicados/pages/create-comunicado/create-comunicado.component').then(m => m.CreateComunicadoComponent),
      },
      {
        path: 'comunicados/editar/:id',
        loadComponent: () =>
          import('./features/comunicados/pages/create-comunicado/create-comunicado.component').then(m => m.CreateComunicadoComponent),
      },
      {
        path: 'comunicados/:id',
        loadComponent: () =>
          import('./features/comunicados/pages/view-comunicado/view-comunicado.component').then(m => m.ViewComunicadoComponent),
      },

      // ── Agenda CAE ────────────────────────────────────────────
      {
        path: 'agenda-cae',
        loadComponent: () =>
          import('./features/agenda-cae/pages/agenda-list/agenda-list.component').then(m => m.AgendaListComponent),
      },
      {
        path: 'agenda-cae/novo',
        loadComponent: () =>
          import('./features/agenda-cae/pages/agenda-form/agenda-form.component').then(m => m.AgendaFormComponent),
      },
      {
        path: 'agenda-cae/editar/:id',
        loadComponent: () =>
          import('./features/agenda-cae/pages/agenda-form/agenda-form.component').then(m => m.AgendaFormComponent),
      },
      {
        path: 'agenda-cae/detalhes',
        loadComponent: () =>
          import('./features/agenda-cae/pages/agenda-detalhe/agenda-detalhe.component').then(m => m.AgendaDetalheComponent),
      },

      // ── Atendimentos ──────────────────────────────────────────
      {
        path: 'atendimentos',
        loadComponent: () =>
          import('./features/atendimentos/pages/list-atendimentos/list-atendimentos.component').then(m => m.ListAtendimentosComponent),
      },
      {
        path: 'atendimentos/novo',
        loadComponent: () =>
          import('./features/atendimentos/pages/create-atendimento/create-atendimento.component').then(m => m.CreateAtendimentoComponent),
      },
      {
        path: 'atendimentos/editar/:id',
        loadComponent: () =>
          import('./features/atendimentos/pages/create-atendimento/create-atendimento.component').then(m => m.CreateAtendimentoComponent),
      },
      {
        path: 'atendimentos/prontuario',
        loadComponent: () =>
          import('./features/atendimentos/pages/prontuario/prontuario.component').then(m => m.ProntuarioComponent),
      },
    ],
  },

  // Fallback — redireciona qualquer rota desconhecida para o dashboard
  { path: '**', redirectTo: 'dashboard' },
];
