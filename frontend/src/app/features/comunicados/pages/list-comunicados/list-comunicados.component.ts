import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Comunicado } from '../../../../core/models/comunicado.model';
import { ComunicadoService } from '../../../../core/services/comunicado.service';

@Component({
  selector: 'app-list-comunicados',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list-comunicados.component.html',
  styleUrls: ['./list-comunicados.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComunicadosComponent implements OnInit {
  comunicados: Comunicado[] = [];
  comunicadosFiltrados: Comunicado[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  filtroStatus: 'todos' | 'ativo' | 'inativo' = 'todos';
  buscaTitulo = '';

  constructor(
    private readonly service: ComunicadoService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.carregarComunicados();
  }

  private carregarComunicados(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.service.listarTodos().subscribe({
      next: (lista) => {
        this.comunicados = lista;
        this.aplicarFiltros();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.comunicados = [];
        this.comunicadosFiltrados = [];
        this.errorMessage = 'Erro ao carregar comunicados da API.';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  aplicarFiltros(): void {
    let resultado = [...this.comunicados];

    if (this.filtroStatus === 'ativo') resultado = resultado.filter((c) => c.ativo);
    if (this.filtroStatus === 'inativo') resultado = resultado.filter((c) => !c.ativo);

    if (this.buscaTitulo.trim()) {
      const termo = this.buscaTitulo.toLowerCase();
      resultado = resultado.filter((c) => c.titulo.toLowerCase().includes(termo));
    }

    this.comunicadosFiltrados = resultado;
    this.cdr.markForCheck();
  }

  onToggleAtivo(com: Comunicado, event: Event): void {
    event.stopPropagation();

    const acao = com.ativo ? 'desativar' : 'ativar';
    if (!confirm(`Deseja ${acao} o comunicado "${com.titulo}"?`)) return;

    this.service.toggleAtivo(com.id!).subscribe({
      next: () => this.carregarComunicados(),
      error: () => {
        this.errorMessage = 'Erro ao atualizar o status do comunicado.';
        this.cdr.markForCheck();
      },
    });
  }

  limparFiltros(): void {
    this.filtroStatus = 'todos';
    this.buscaTitulo = '';
    this.aplicarFiltros();
  }

  get totalAtivos(): number {
    return this.comunicados.filter((c) => c.ativo).length;
  }

  get totalInativos(): number {
    return this.comunicados.filter((c) => !c.ativo).length;
  }
}
