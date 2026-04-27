import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendaCaeService } from '../../../../core/services/agenda-cae.service';
import { AgendamentoEstudante } from '../../../../core/models/atendimento.model';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agenda-detalhe.component.html',
  styleUrls: ['./agenda-detalhe.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgendaDetalheComponent implements OnInit {
  agendamentos: AgendamentoEstudante[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private readonly service: AgendaCaeService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.service.listarAgendamentos().subscribe({
      next: (agendamentos) => {
        this.agendamentos = agendamentos;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar agendamentos.';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }
}
