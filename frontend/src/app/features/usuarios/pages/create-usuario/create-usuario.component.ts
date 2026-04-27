import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom, timeout } from 'rxjs';

import { GrupoUsuario } from '../../../../core/models/grupo-usuario.model';
import { CreateUsuarioPayload, UsuarioFormPayload } from '../../../../core/models/usuario.model';
import { GrupoUsuarioService } from '../../../../core/services/grupo-usuario.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { UsuarioFormComponent } from '../../components/usuario-form/usuario-form.component';

@Component({
  selector: 'app-create-usuario',
  standalone: true,
  imports: [CommonModule, UsuarioFormComponent],
  templateUrl: './create-usuario.component.html',
  styleUrls: ['./create-usuario.component.scss'],
})
export class CreateUsuarioComponent implements OnInit {
  grupos: GrupoUsuario[] = [];
  readonly tituloPagina = 'Cadastrar Usuário';
  readonly subtituloPagina = 'Preencha os dados para criar um novo acesso ao sistema.';
  readonly breadcrumbAtual = 'Novo Usuário';

  isLoading = false;
  isLoadingGrupos = true;

  feedbackMessage: { tipo: 'success' | 'error'; texto: string } | null = null;

  constructor(
    private readonly grupoUsuarioService: GrupoUsuarioService,
    private readonly usuarioService: UsuarioService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    void this.carregarGrupos();
  }

  private async carregarGrupos(): Promise<void> {
    this.isLoadingGrupos = true;
    this.feedbackMessage = null;

    try {
      this.grupos = await firstValueFrom(
        this.grupoUsuarioService.listarTodos().pipe(timeout(10000))
      );
    } catch {
      this.grupos = [];
      this.feedbackMessage = {
        tipo: 'error',
        texto: 'Erro ao carregar grupos de usuário. Tente recarregar a página.',
      };
    } finally {
      this.isLoadingGrupos = false;
      this.cdr.detectChanges();
    }
  }

  onFormSubmit(payload: UsuarioFormPayload): void {
    this.isLoading = true;
    this.feedbackMessage = null;

    const createPayload: CreateUsuarioPayload = {
      nome: payload.nome,
      senha: payload.senha ?? '',
      grupoUsuarioId: payload.grupoUsuarioId,
      mudaSenha: payload.mudaSenha,
      status: payload.status,
    };

    this.usuarioService.criar(createPayload).subscribe({
      next: (usuario) => {
        this.isLoading = false;
        this.feedbackMessage = {
          tipo: 'success',
          texto: `Usuário "${usuario.nome}" cadastrado com sucesso!`,
        };

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
