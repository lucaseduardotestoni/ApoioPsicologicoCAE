import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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

@Component({
  selector: 'app-create-grupo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GrupoFormComponent,
    PermissaoListComponent
  ],
  templateUrl: './create-grupo.component.html',
  styleUrls: ['./create-grupo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateGrupoComponent implements OnInit {

  tituloTela = 'Novo Grupo';

  isLoadingDados = true;
  isSubmitting = false;
  modoEdicao = false;

  grupo: GrupoUsuario = { nome: '' };
  grupoParaEditar: GrupoUsuario | null = null;

  niveis: NivelPermissao[] = [];
  permissaoRows: PermissaoRow[] = [];

  feedback: Feedback | null = null;

  constructor(
    private grupoService: GrupoUsuarioService,
    private permissaoService: PermissaoService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Verifica modo edição
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicao = true;
      this.tituloTela = 'Editar Grupo';
      const grupo = this.grupoService.buscarPorId(Number(id));
      if (grupo) {
        this.grupoParaEditar = grupo;
        this.grupo = { ...grupo };
      }
    }

    // Carrega permissões e níveis em paralelo
    let permissoesCarregadas = false;
    let niveisCarregados = false;

    const verificarConcluido = () => {
      if (permissoesCarregadas && niveisCarregados) {
        this.isLoadingDados = false;
        this.cdr.markForCheck();
      }
    };

    this.permissaoService.listarPermissoes().subscribe(permissoes => {
      this.permissaoRows = permissoes.map(p => ({
        permissaoId: p.id,
        nome: p.nome,
        nivelPermissaoIdSelecionado: null,
      }));
      permissoesCarregadas = true;
      verificarConcluido();
    });

    this.permissaoService.listarNiveis().subscribe(niveis => {
      this.niveis = niveis;
      niveisCarregados = true;
      verificarConcluido();
    });
  }

  salvar(): void {
    if (!this.grupo.nome) {
      this.feedback = { tipo: 'error', texto: 'Informe o nome do grupo.' };
      this.cdr.markForCheck();
      return;
    }

    this.isSubmitting = true;
    this.feedback = null;
    this.cdr.markForCheck();

    const request$ = this.modoEdicao && this.grupoParaEditar?.id
      ? this.grupoService.atualizar(this.grupoParaEditar.id, this.grupo)
      : this.grupoService.criar(this.grupo);

    request$.subscribe({
      next: () => {
        this.feedback = {
          tipo: 'success',
          texto: this.modoEdicao ? 'Grupo atualizado com sucesso!' : 'Grupo criado com sucesso!',
        };
        this.isSubmitting = false;
        this.cdr.markForCheck();
        setTimeout(() => this.router.navigate(['/grupos']), 1500);
      },
      error: () => {
        this.feedback = { tipo: 'error', texto: 'Erro ao salvar grupo.' };
        this.isSubmitting = false;
        this.cdr.markForCheck();
      },
    });
  }

  onSalvar(): void { this.salvar(); }
  onCancelar(): void { this.router.navigate(['/grupos']); }

  onNomeChange(nome: string | null): void {
    this.grupo.nome = nome ?? '';
  }

  onRowsChange(rows: PermissaoRow[]): void {
    this.permissaoRows = rows;
  }

  fecharFeedback(): void {
    this.feedback = null;
  }
}