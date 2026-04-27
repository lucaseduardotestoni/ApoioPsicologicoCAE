import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { ComunicadoFormComponent } from '../../components/comunicado-form/comunicado-form.component';
import { ComunicadoService } from '../../../../core/services/comunicado.service';
import { GrupoUsuarioService } from '../../../../core/services/grupo-usuario.service';
import { Comunicado, CreateComunicadoPayload } from '../../../../core/models/comunicado.model';
import { GrupoUsuario } from '../../../../core/models/grupo-usuario.model';

/**
 * Página/Container de edição de comunicado.
 */
@Component({
  selector: 'app-edit-comunicado',
  standalone: true,
  imports: [CommonModule, RouterModule, ComunicadoFormComponent],
  templateUrl: './edit-comunicado.component.html',
  styleUrls: ['../../shared/styles/form-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditComunicadoComponent implements OnInit, OnDestroy {
  comunicado: Comunicado | null = null;
  grupos: GrupoUsuario[] = [];
  loading = false;
  feedbackMessage: { tipo: 'success' | 'error'; texto: string } | null = null;

  private readonly destroy$ = new Subject<void>();
  private readonly comunicadoId: number;

  constructor(
    private readonly comunicadoService: ComunicadoService,
    private readonly grupoService: GrupoUsuarioService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.comunicadoId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.carregarGrupos();
    this.carregarComunicado();
  }

  private carregarGrupos(): void {
    this.grupoService
      .listarTodos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((grupos: GrupoUsuario[]) => {
        this.grupos = grupos;
        this.cdr.markForCheck();
      });
  }

  private carregarComunicado(): void {
    if (Number.isNaN(this.comunicadoId)) {
      this.voltar();
      return;
    }

    this.loading = true;
    this.cdr.markForCheck();

    this.comunicadoService
      .getById(this.comunicadoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comunicado: Comunicado) => {
          if (!comunicado) {
            this.voltar();
            return;
          }

          this.comunicado = comunicado;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }

  onFormSubmit(payload: CreateComunicadoPayload): void {
    if (!this.comunicado?.id) {
      return;
    }

    this.loading = true;
    this.feedbackMessage = null;
    this.cdr.markForCheck();

    this.comunicadoService
      .update(this.comunicado.id, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
          this.feedbackMessage = {
            tipo: 'success',
            texto: 'Comunicado atualizado com sucesso!',
          };
          this.cdr.markForCheck();
          setTimeout(() => this.voltar(), 1800);
        },
        error: () => {
          this.loading = false;
          this.feedbackMessage = {
            tipo: 'error',
            texto: 'Erro ao salvar comunicado.',
          };
          this.cdr.markForCheck();
        },
      });
  }

  onCancelar(): void {
    this.voltar();
  }

  fecharFeedback(): void {
    this.feedbackMessage = null;
  }

  private voltar(): void {
    this.router.navigate(['/comunicados']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
