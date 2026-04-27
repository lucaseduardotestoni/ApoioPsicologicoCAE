import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AtendimentoService } from '../../../../core/services/atendimento.service';
import { RegistroAtendimento, TipoAtendimento } from '../../../../core/models/atendimento.model';

@Component({
  selector: 'app-list-atendimentos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list-atendimentos.component.html',
  styleUrls: ['./list-atendimentos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListAtendimentosComponent implements OnInit {
  atendimentos: RegistroAtendimento[] = [];
  filtrados: RegistroAtendimento[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  busca = '';
  filtroTipo: TipoAtendimento | '' = '';

  readonly tipoLabels: Record<TipoAtendimento, string> = {
    PSICOLOGICO: 'Psicológico',
    SOCIAL:      'Social',
    PEDAGOGICO:  'Pedagógico',
    ORIENTACAO:  'Orientação',
    OUTRO:       'Outro',
  };

  readonly tipoOptions: { value: TipoAtendimento; label: string }[] = [
    { value: 'PSICOLOGICO', label: 'Psicológico' },
    { value: 'SOCIAL',      label: 'Social' },
    { value: 'PEDAGOGICO',  label: 'Pedagógico' },
    { value: 'ORIENTACAO',  label: 'Orientação' },
    { value: 'OUTRO',       label: 'Outro' },
  ];

  constructor(
    private service: AtendimentoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  private carregar(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.service.listarTodos().subscribe({
      next: (lista) => {
        this.atendimentos = lista.sort((a, b) => b.data.localeCompare(a.data));
        this.aplicarFiltros();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.atendimentos = [];
        this.filtrados = [];
        this.errorMessage = 'Erro ao carregar atendimentos da API.';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  aplicarFiltros(): void {
    let r = [...this.atendimentos];
    if (this.filtroTipo) r = r.filter(a => a.tipo === this.filtroTipo);
    if (this.busca.trim()) {
      const t = this.busca.toLowerCase();
      r = r.filter(
        a =>
          a.estudanteNome.toLowerCase().includes(t) ||
          a.responsavel.toLowerCase().includes(t)
      );
    }
    this.filtrados = r;
    this.cdr.markForCheck();
  }

  limparFiltros(): void {
    this.busca = '';
    this.filtroTipo = '';
    this.aplicarFiltros();
  }

  get temFiltro(): boolean {
    return !!this.busca || !!this.filtroTipo;
  }
}
