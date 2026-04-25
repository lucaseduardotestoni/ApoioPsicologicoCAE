import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Comunicado } from '../../../../core/models/comunicado.model';
import { ComunicadoService } from '../../../../core/services/comunicado.service';

// Componente de listagem de comunicados
@Component({
  selector: 'app-list-comunicados',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list-comunicados.component.html',
  styleUrls: ['./list-comunicados.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComunicadosComponent implements OnInit {

  comunicados: Comunicado[] = []; // lista original
  comunicadosFiltrados: Comunicado[] = []; // lista com filtros aplicados
  isLoading = true; // controle de loading

  // Filtros 
  filtroStatus: 'todos' | 'ativo' | 'inativo' = 'todos'; 
  buscaTitulo = ''; 

  constructor(
    private service: ComunicadoService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.carregarComunicados(); // carrega dados ao iniciar
  }

  private carregarComunicados(): void {
    this.isLoading = true;

    // busca todos comunicados
    this.service.listarTodos().subscribe(lista => {
      this.comunicados = lista;
      this.aplicarFiltros(); // aplica filtros após carregar
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }

  aplicarFiltros(): void {
    let resultado = [...this.comunicados];

    // filtro por status
    if (this.filtroStatus === 'ativo') resultado = resultado.filter(c => c.ativo);
    if (this.filtroStatus === 'inativo') resultado = resultado.filter(c => !c.ativo);

    // filtro por título
    if (this.buscaTitulo.trim()) {
      const termo = this.buscaTitulo.toLowerCase();
      resultado = resultado.filter(c => c.titulo.toLowerCase().includes(termo));
    }

    this.comunicadosFiltrados = resultado;
    this.cdr.markForCheck();
  }

  onToggleAtivo(com: Comunicado, event: Event): void {
    event.stopPropagation(); // evita trigger de clique na linha

    const acao = com.ativo ? 'desativar' : 'ativar';

    // confirmação antes de alterar status
    if (!confirm(`Deseja ${acao} o comunicado "${com.titulo}"?`)) return;

    this.service.toggleAtivo(com.id!).subscribe(() => {
      this.carregarComunicados(); // recarrega lista após alteração
    });
  }

  limparFiltros(): void {
    this.filtroStatus = 'todos';
    this.buscaTitulo = '';
    this.aplicarFiltros(); // reseta filtros
  }

  // total de comunicados ativos
  get totalAtivos(): number {
    return this.comunicados.filter(c => c.ativo).length;
  }

  // total de comunicados inativos
  get totalInativos(): number {
    return this.comunicados.filter(c => !c.ativo).length;
  }
}