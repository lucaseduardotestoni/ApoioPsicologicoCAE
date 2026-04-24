import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AtendimentoService } from '../../../../core/services/atendimento.service';
import {
  Estudante,
  RegistroAtendimento,
  TipoAtendimento,
} from '../../../../core/models/atendimento.model';

@Component({
  selector: 'app-prontuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './prontuario.component.html',
  styleUrls: ['./prontuario.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProntuarioComponent {
  // Busca
  termoBusca = '';
  resultadosBusca: Estudante[] = [];
  buscando = false;
  buscaRealizada = false;

  // Estudante selecionado
  estudanteSelecionado: Estudante | null = null;
  atendimentos: RegistroAtendimento[] = [];
  carregandoAtendimentos = false;

  // Expansão de itens
  expandidos = new Set<number>();

  readonly tipoLabels: Record<TipoAtendimento, string> = {
    PSICOLOGICO: 'Psicológico',
    SOCIAL:      'Social',
    PEDAGOGICO:  'Pedagógico',
    ORIENTACAO:  'Orientação',
    OUTRO:       'Outro',
  };

  readonly tipoCores: Record<TipoAtendimento, string> = {
    PSICOLOGICO: '#1565C0',
    SOCIAL:      '#00897B',
    PEDAGOGICO:  '#5C6BC0',
    ORIENTACAO:  '#F9A825',
    OUTRO:       '#757575',
  };

  constructor(
    private service: AtendimentoService,
    private cdr: ChangeDetectorRef
  ) {}

  onBuscar(): void {
    const termo = this.termoBusca.trim();
    if (!termo) return;

    this.buscando = true;
    this.buscaRealizada = false;
    this.estudanteSelecionado = null;
    this.atendimentos = [];
    this.cdr.markForCheck();

    this.service.buscarEstudantes(termo).subscribe(lista => {
      this.resultadosBusca = lista;
      this.buscando = false;
      this.buscaRealizada = true;
      this.cdr.markForCheck();
    });
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.onBuscar();
  }

  selecionarEstudante(estudante: Estudante): void {
    this.estudanteSelecionado = estudante;
    this.carregandoAtendimentos = true;
    this.expandidos.clear();
    this.cdr.markForCheck();

    this.service.listarPorEstudante(estudante.id).subscribe(lista => {
      this.atendimentos = lista;
      this.carregandoAtendimentos = false;
      this.cdr.markForCheck();
    });
  }

  toggleExpandir(id: number): void {
    if (this.expandidos.has(id)) {
      this.expandidos.delete(id);
    } else {
      this.expandidos.add(id);
    }
    this.cdr.markForCheck();
  }

  isExpandido(id: number): boolean {
    return this.expandidos.has(id);
  }

  limparSelecao(): void {
    this.estudanteSelecionado = null;
    this.atendimentos = [];
    this.termoBusca = '';
    this.resultadosBusca = [];
    this.buscaRealizada = false;
    this.cdr.markForCheck();
  }

  get totalAtendimentos(): number {
    return this.atendimentos.length;
  }

  get ultimoAtendimento(): RegistroAtendimento | null {
    return this.atendimentos.length > 0 ? this.atendimentos[0] : null;
  }
}
