import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface DashCard {
  titulo: string;
  descricao: string;
  icon: string;
  route: string;
  routeLabel: string;
  cor: string;
  stat: string;
  statLabel: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// Componente de dashboard principal, sempre que tiver um novo precisa ser atualizado aqui e toda a manutenção é aqui.
export class DashboardComponent {
  today: Date = new Date(); 
  readonly cards: DashCard[] = [
    {
      titulo: 'Usuários',
      descricao: 'Gerencie os usuários do sistema, crie novos acessos e defina grupos.',
      icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
      route: '/usuarios',
      routeLabel: 'Gerenciar Usuários',
      cor: '#1565C0',
      stat: '1',
      statLabel: 'usuários cadastrados',
    },
    {
      titulo: 'Grupos de Usuário',
      descricao: 'Configure grupos com permissões específicas para cada perfil de acesso.',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z',
      route: '/grupos',
      routeLabel: 'Gerenciar Grupos',
      cor: '#5C6BC0',
      stat: '3',
      statLabel: 'grupos configurados',
    },
    {
      descricao: 'Gerencie e visualize comunicados enviados aos usuários.',
      titulo: 'Comunicados',
      route: '/comunicados',
      icon: 'M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z',
      cor: '#00897B',
      routeLabel: 'Gerenciar Comunicados',
      statLabel: 'comunicados ativos',
      stat: '5',
    },
    {
      titulo: 'Atendimentos',
      descricao: 'Registre e acompanhe os atendimentos realizados pelo CAE.',
      icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z',
      route: '/atendimentos',
      routeLabel: 'Ver Atendimentos',
      cor: '#6A1B9A',
      stat: '3',
      statLabel: 'atendimentos registrados',
    },
    {
      titulo: 'Prontuário',
      descricao: 'Consulte o histórico completo de atendimentos de cada estudante.',
      icon: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
      route: '/atendimentos/prontuario',
      routeLabel: 'Consultar Prontuário',
      cor: '#00838F',
      stat: '5',
      statLabel: 'estudantes atendidos',
    },
    {
      titulo: 'Agenda CAE',
      descricao: 'Crie, edite e gerencie horários de atendimento da CAE.',
      icon: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H5V8h14v13z',
      route: '/agenda-cae',
      routeLabel: 'Gerenciar Agenda',
      cor: '#FF9800',
      stat: '0',
      statLabel: 'horários cadastrados',
    },
  ];
}
