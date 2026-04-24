import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { GrupoUsuario } from '../../../../core/models/grupo-usuario.model';
import { CreateUsuarioPayload } from '../../../../core/models/usuario.model';
import { GrupoUsuarioService } from '../../../../core/services/grupo-usuario.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { UsuarioFormComponent } from '../../components/usuario-form/usuario-form.component';

/**
 * Página/Container de criação de usuário.
 *
 * Responsabilidades:
 *  - Carregar dados necessários (grupos) para o formulário
 *  - Orquestrar chamada ao service de criação
 *  - Exibir feedback (sucesso/erro) ao usuário
 *  - Redirecionar após criação bem-sucedida
 *
 * NÃO contém lógica de formulário — delegada ao UsuarioFormComponent.
 */
@Component({
  selector: 'app-create-usuario',
  standalone: true,
  imports: [CommonModule, UsuarioFormComponent],
  templateUrl: './create-usuario.component.html',
  styleUrls: ['./create-usuario.component.scss'],
})
export class CreateUsuarioComponent implements OnInit {

  grupos: GrupoUsuario[] = [];
  isLoading = false;
  isLoadingGrupos = true;

  /** Mensagem de feedback exibida após operação */
  feedbackMessage: { tipo: 'success' | 'error'; texto: string } | null = null;

  constructor(
    private grupoService: GrupoUsuarioService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarGrupos();
  }

  private carregarGrupos(): void {
    this.isLoadingGrupos = true;
    this.grupoService.listarTodos().subscribe({
      next: (grupos) => {
        this.grupos = grupos;
        this.isLoadingGrupos = false;
      },
      error: () => {
        this.feedbackMessage = {
          tipo: 'error',
          texto: 'Erro ao carregar grupos de usuário. Tente recarregar a página.',
        };
        this.isLoadingGrupos = false;
      },
    });
  }

  /**
   * Recebe o payload do componente filho e chama o service.
   */
  onFormSubmit(payload: CreateUsuarioPayload): void {
    this.isLoading = true;
    this.feedbackMessage = null;

    this.usuarioService.criar(payload).subscribe({
      next: (usuario) => {
        this.isLoading = false;
        this.feedbackMessage = {
          tipo: 'success',
          texto: `Usuário "${usuario.nome}" cadastrado com sucesso!`,
        };

        // Redireciona após 2 segundos para a listagem
        // Ajuste a rota conforme seu módulo de roteamento
        setTimeout(() => this.router.navigate(['/usuarios']), 2000);
      },
      error: (err: Error) => {
        this.isLoading = false;
        this.feedbackMessage = {
          tipo: 'error',
          texto: err.message || 'Erro ao cadastrar usuário. Tente novamente.',
        };
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
