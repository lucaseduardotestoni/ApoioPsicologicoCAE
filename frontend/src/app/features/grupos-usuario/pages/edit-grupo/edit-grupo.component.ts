import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { GrupoUsuario } from '../../../../core/models/grupo-usuario.model';
import { GrupoUsuarioService } from '../../../../core/services/grupo-usuario.service';
import { PermissaoService } from '../../../../core/services/permissao.service';
import { NivelPermissao } from '../../../../core/models/nivel-permissao.model';
import { PermissaoRow } from '../../../../core/models/grupo-permissao.model';

import { GrupoFormComponent } from '../../components/grupo-form/grupo-form.component';
import { PermissaoListComponent } from '../../components/permissao-list/permissao-list.component';

interface Feedback {
  tipo: 'success' | 'error';
  texto: string;
}

/**
 * Página/Container de edição de grupo de usuário.
 */
@Component({
  selector: 'app-edit-grupo',
  standalone: true,
  imports: [CommonModule, FormsModule, GrupoFormComponent, PermissaoListComponent],
  templateUrl: './edit-grupo.component.html',
  styleUrls: ['../../shared/styles/form-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditGrupoComponent implements OnInit {
  @ViewChild(GrupoFormComponent) private grupoFormComponent?: GrupoFormComponent;

  readonly tituloTela = 'Editar Grupo';

  isLoadingDados = true;
  isSubmitting = false;

  grupo: GrupoUsuario = { nome: '' };

  niveis: NivelPermissao[] = [];
  permissaoRows: PermissaoRow[] = [];

  feedbackMessage: Feedback | null = null;

  private readonly grupoId: number;

  constructor(
    private readonly grupoUsuarioService: GrupoUsuarioService,
    private readonly permissaoService: PermissaoService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.grupoId = Number(this.route.snapshot.paramMap.get('id'));
  }

  async ngOnInit(): Promise<void> {
    if (Number.isNaN(this.grupoId)) {
      this.isLoadingDados = false;
      this.feedbackMessage = { tipo: 'error', texto: 'ID inválido para edição de grupo.' };
      this.cdr.markForCheck();
      return;
    }

    await this.carregarGrupo();
    this.carregarPermissoesENiveis();
  }

  private async carregarGrupo(): Promise<void> {
    try {
      const grupo = await firstValueFrom(this.grupoUsuarioService.buscarPorId(this.grupoId));
      this.grupo = { ...grupo };
    } catch {
      this.feedbackMessage = { tipo: 'error', texto: 'Não foi possível carregar o grupo para edição.' };
    } finally {
      this.cdr.markForCheck();
    }
  }

  private carregarPermissoesENiveis(): void {
    let permissoesCarregadas = false;
    let niveisCarregados = false;

    const verificarConcluido = () => {
      if (permissoesCarregadas && niveisCarregados) {
        this.isLoadingDados = false;
        this.cdr.markForCheck();
      }
    };

    this.permissaoService.listarPermissoes().subscribe((permissoes) => {
      this.permissaoRows = permissoes.map((permissao) => ({
        permissaoId: permissao.id,
        nome: permissao.nome,
        nivelPermissaoIdSelecionado: null,
      }));
      permissoesCarregadas = true;
      verificarConcluido();
    });

    this.permissaoService.listarNiveis().subscribe((niveis) => {
      this.niveis = niveis;
      niveisCarregados = true;
      verificarConcluido();
    });
  }

  salvar(): void {
    this.grupoFormComponent?.markAllTouched();

    if (!this.grupoFormComponent?.isValid()) {
      this.feedbackMessage = { tipo: 'error', texto: 'Informe o nome do grupo.' };
      this.cdr.markForCheck();
      return;
    }

    this.grupo = this.grupoFormComponent.getPayload();

    this.isSubmitting = true;
    this.feedbackMessage = null;
    this.cdr.markForCheck();

    this.grupoUsuarioService.atualizar(this.grupoId, this.grupo).subscribe({
      next: () => {
        this.feedbackMessage = { tipo: 'success', texto: 'Grupo atualizado com sucesso!' };
        this.isSubmitting = false;
        this.cdr.markForCheck();
        setTimeout(() => this.router.navigate(['/grupos']), 1500);
      },
      error: () => {
        this.feedbackMessage = { tipo: 'error', texto: 'Erro ao salvar grupo.' };
        this.isSubmitting = false;
        this.cdr.markForCheck();
      },
    });
  }

  onSalvar(): void {
    this.salvar();
  }

  onCancelar(): void {
    this.router.navigate(['/grupos']);
  }

  onRowsChange(rows: PermissaoRow[]): void {
    this.permissaoRows = rows;
  }

  fecharFeedback(): void {
    this.feedbackMessage = null;
  }
}
