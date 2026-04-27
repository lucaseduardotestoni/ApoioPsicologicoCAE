import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AgendaCaeService } from '../../../../core/services/agenda-cae.service';
import { HorarioAtendimento } from '../../../../core/models/atendimento.model';

@Component({
  selector: 'app-agenda-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agenda-list.component.html',
  styleUrls: ['./agenda-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgendaListComponent implements OnInit {
  horarios: HorarioAtendimento[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private readonly service: AgendaCaeService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarHorarios();
  }

  novo(): void {
    this.router.navigate(['/agenda-cae/novo']);
  }

  editar(id: number): void {
    this.router.navigate(['/agenda-cae/editar', id]);
  }

  excluir(id: number): void {
    this.service.removerHorario(id).subscribe({
      next: () => this.carregarHorarios(),
      error: () => {
        this.errorMessage = 'Erro ao excluir horário.';
        this.cdr.markForCheck();
      },
    });
  }

  private carregarHorarios(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.service.listarHorarios().subscribe({
      next: (horarios) => {
        this.horarios = horarios;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.horarios = [];
        this.errorMessage = 'Erro ao carregar horários da agenda.';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }
}
