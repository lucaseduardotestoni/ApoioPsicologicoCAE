import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { ComunicadoFormComponent } from '../../components/comunicado-form/comunicado-form.component';
import { ComunicadoService } from '../../../../core/services/comunicado.service';
import { GrupoUsuarioService } from '../../../../core/services/grupo-usuario.service';
import { CreateComunicadoPayload } from '../../../../core/models/comunicado.model';
import { GrupoUsuario } from '../../../../core/models/grupo-usuario.model';

@Component({
  selector: 'app-create-comunicado',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ComunicadoFormComponent,
  ],
  templateUrl: './create-comunicado.component.html',
  styleUrls: ['../../shared/styles/form-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateComunicadoComponent implements OnInit, OnDestroy {

  grupos: GrupoUsuario[] = [];
  loading = false;
  feedbackMessage: { tipo: 'success' | 'error'; texto: string } | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private comunicadoService: ComunicadoService,
    private grupoService: GrupoUsuarioService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.grupoService
      .listarTodos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((grupos: GrupoUsuario[]) => {
        this.grupos = grupos;
        this.cdr.markForCheck();
      });
  }

  onFormSubmit(payload: CreateComunicadoPayload): void {
    this.loading = true;
    this.feedbackMessage = null;
    this.cdr.markForCheck();

    const request$ = this.comunicadoService.create(payload);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.loading = false;
        this.feedbackMessage = {
          tipo: 'success',
          texto: 'Comunicado criado com sucesso!',
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

  onCancelar(): void { this.voltar(); }

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