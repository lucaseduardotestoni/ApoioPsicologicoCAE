import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { GrupoUsuario } from '../../../../core/models/grupo-usuario.model';
import { Usuario, UsuarioFormPayload } from '../../../../core/models/usuario.model';
import { GrupoUsuarioService } from '../../../../core/services/grupo-usuario.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { UsuarioFormComponent } from '../../components/usuario-form/usuario-form.component';

/**
 * Página/Container de edição de usuário.
 *
 * Responsabilidades:
 *  - Carregar dados necessários (grupos e usuário)
 *  - Orquestrar chamada ao service de atualização
 *  - Exibir feedback (sucesso/erro) ao usuário
 *  - Redirecionar após atualização bem-sucedida
 *
 * NÃO contém lógica de formulário — delegada ao UsuarioFormComponent.
 */
@Component({
  selector: 'app-edit-usuario',
  standalone: true,
  imports: [CommonModule, UsuarioFormComponent],
  templateUrl: './edit-usuario.component.html',
  styleUrls: ['../../shared/styles/form-page.scss'],
})
export class EditUsuarioComponent implements OnInit {

  grupos: GrupoUsuario[] = [];
  usuario: Usuario | null = null;
  isLoading = false;
  isLoadingPage = true;

  readonly tituloPagina = 'Editar Usuário';
  readonly subtituloPagina = 'Atualize os dados do usuário selecionado.';
  readonly breadcrumbAtual = 'Editar Usuário';

  /** Mensagem de feedback exibida após operação */
  feedbackMessage: { tipo: 'success' | 'error'; texto: string } | null = null;

  private readonly usuarioId: number;

  constructor(
    private grupoUsuarioService: GrupoUsuarioService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.usuarioId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    if (Number.isNaN(this.usuarioId)) {
      this.isLoadingPage = false;
      this.cdr.detectChanges();
      this.feedbackMessage = {
        tipo: 'error',
        texto: 'ID do usuário inválido para edição.',
      };
      return;
    }

    void this.carregarDados();
  }

  private async carregarDados(): Promise<void> {
    this.isLoadingPage = true;

    try {
      const [grupos, usuario] = await Promise.all([
        firstValueFrom(this.grupoUsuarioService.listarTodos()),
        firstValueFrom(this.usuarioService.buscarPorId(this.usuarioId)),
      ]);

      this.grupos = grupos;
      this.usuario = usuario;
      this.cdr.detectChanges();
    } catch {
      this.feedbackMessage = {
        tipo: 'error',
        texto: 'Erro ao carregar os dados do usuário para edição.',
      };
      this.cdr.detectChanges();
    } finally {
      this.isLoadingPage = false;
      this.cdr.detectChanges();
    }
  }

  /**
   * Recebe o payload do componente filho e chama o service.
   */
  onFormSubmit(payload: UsuarioFormPayload): void {
    if (!this.usuario?.id) return;

    this.isLoading = true;
    this.feedbackMessage = null;

    this.usuarioService.atualizar(this.usuario.id, payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.feedbackMessage = {
          tipo: 'success',
          texto: 'Usuário alterado com sucesso!',
        };
        this.cdr.detectChanges();

        setTimeout(() => this.router.navigate(['/usuarios']), 2000);
      },
      error: (err: Error) => {
        this.isLoading = false;
        this.feedbackMessage = {
          tipo: 'error',
          texto: err.message || 'Erro ao atualizar usuário. Tente novamente.',
        };
        this.cdr.detectChanges();
      },
    });
  }

  onCancelar(): void {
    this.router.navigate(['/usuarios']);
  }

  fecharFeedback(): void {
    this.feedbackMessage = null;
  }
}