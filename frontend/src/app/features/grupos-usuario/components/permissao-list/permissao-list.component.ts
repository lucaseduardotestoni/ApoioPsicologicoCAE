import {
  ChangeDetectionStrategy, Component, EventEmitter,
  Input, OnChanges, Output, SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NivelPermissao } from '../../../../core/models/nivel-permissao.model';
import { PermissaoRow } from '../../../../core/models/grupo-permissao.model';

/**
 * Componente "dumb" — exibe a tabela de permissões com selects de nível.
 * Recebe as linhas prontas e emite as alterações ao container.
 *
 * Usa OnPush: só re-renderiza quando @Input mudar por referência.
 */
@Component({
  selector: 'app-permissao-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './permissao-list.component.html',
  styleUrls: ['./permissao-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissaoListComponent implements OnChanges {

  @Input() rows: PermissaoRow[] = [];
  @Input() niveis: NivelPermissao[] = [];
  @Input() isLoading = false;

  /** Emite cópia imutável do array atualizado */
  @Output() rowsChange = new EventEmitter<PermissaoRow[]>();

  /** Conta quantas permissões estão selecionadas */
  get totalSelecionadas(): number {
    return this.rows.filter(r => r.nivelPermissaoIdSelecionado !== null).length;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Garante imutabilidade — cria cópia rasa ao receber @Input
    if (changes['rows'] && this.rows) {
      this.rows = this.rows.map(r => ({ ...r }));
    }
  }

  onNivelChange(row: PermissaoRow, value: string): void {
    const nivelId = value === 'null' ? null : Number(value);
    const updated = this.rows.map(r =>
      r.permissaoId === row.permissaoId
        ? { ...r, nivelPermissaoIdSelecionado: nivelId }
        : r
    );
    this.rows = updated;
    this.rowsChange.emit([...updated]);
  }

  /** Ação "Selecionar tudo como Leitura" (id=1) */
  selecionarTudoLeitura(): void {
    const updated = this.rows.map(r => ({ ...r, nivelPermissaoIdSelecionado: 1 }));
    this.rows = updated;
    this.rowsChange.emit([...updated]);
  }

  /** Ação "Limpar permissões" */
  limparTudo(): void {
    const updated = this.rows.map(r => ({ ...r, nivelPermissaoIdSelecionado: null }));
    this.rows = updated;
    this.rowsChange.emit([...updated]);
  }

  /** TrackBy para performance na *ngFor */
  trackByPermissao(_: number, row: PermissaoRow): number {
    return row.permissaoId;
  }
}
