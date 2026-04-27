import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
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

import { AtendimentoFormComponent } from '../../components/atendimento-form/atendimento-form.component';
import { AtendimentoService } from '../../../../core/services/atendimento.service';
import { Estudante, TipoAtendimento } from '../../../../core/models/atendimento.model';

/** Valida que a data não é futura */
function notFutureDate(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const selected = new Date(control.value + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected > today ? { futureDate: true } : null;
}

/**
 * Página/Container de edição de atendimento.
 */
@Component({
  selector: 'app-edit-atendimento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AtendimentoFormComponent],
  templateUrl: './edit-atendimento.component.html',
  styleUrls: ['../../shared/styles/form-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAtendimentoComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  estudantes: Estudante[] = [];
  isLoadingPage = true;
  isSubmitting = false;
  isLoadingEstudantes = true;
  feedbackMessage: { tipo: 'success' | 'error'; texto: string } | null = null;

  readonly tipos: { value: TipoAtendimento; label: string }[] = [
    { value: 'PSICOLOGICO', label: 'Psicológico' },
    { value: 'SOCIAL', label: 'Social' },
    { value: 'PEDAGOGICO', label: 'Pedagógico' },
    { value: 'ORIENTACAO', label: 'Orientação' },
    { value: 'OUTRO', label: 'Outro' },
  ];

  private readonly destroy$ = new Subject<void>();
  private readonly atendimentoId: number;

  constructor(
    private readonly fb: FormBuilder,
    private readonly service: AtendimentoService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.atendimentoId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.buildForm();
    this.carregarEstudantes();

    if (Number.isNaN(this.atendimentoId)) {
      this.feedbackMessage = { tipo: 'error', texto: 'ID inválido para edição de atendimento.' };
      this.cdr.markForCheck();
      return;
    }

    this.carregarAtendimento(this.atendimentoId);
  }

  private buildForm(): void {
    this.form = this.fb.group({
      estudanteId: [null, Validators.required],
      data: ['', [Validators.required, notFutureDate]],
      tipo: ['', Validators.required],
      descricao: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
      responsavel: ['', [Validators.required, Validators.minLength(3)]],
      observacoes: [''],
    });
  }

  private carregarEstudantes(): void {
    this.service
      .listarEstudantes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (lista) => {
          this.estudantes = lista;
          this.isLoadingEstudantes = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.isLoadingEstudantes = false;
          this.cdr.markForCheck();
        },
      });
  }

  private carregarAtendimento(id: number): void {
    this.isLoadingPage = true;
    this.service
      .buscarPorId(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (atendimento) => {
          if (!atendimento) {
            this.feedbackMessage = { tipo: 'error', texto: 'Atendimento não encontrado.' };
            this.isLoadingPage = false;
            this.cdr.markForCheck();
            return;
          }

          this.form.patchValue(atendimento);
          this.isLoadingPage = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.feedbackMessage = { tipo: 'error', texto: 'Erro ao carregar atendimento.' };
          this.isLoadingPage = false;
          this.cdr.markForCheck();
        },
      });
  }

  private getNomeEstudante(id: number): string {
    return this.estudantes.find((estudante) => estudante.id === id)?.nome ?? '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.feedbackMessage = null;
    this.cdr.markForCheck();

    const raw = this.form.value;
    const payload = {
      ...raw,
      estudanteId: Number(raw.estudanteId),
      estudanteNome: this.getNomeEstudante(Number(raw.estudanteId)),
    };

    this.service.atualizar(this.atendimentoId, payload).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.feedbackMessage = {
          tipo: 'success',
          texto: 'Atendimento atualizado com sucesso!',
        };
        this.cdr.markForCheck();
        setTimeout(() => this.router.navigate(['/atendimentos']), 1800);
      },
      error: (err: Error) => {
        this.isSubmitting = false;
        this.feedbackMessage = {
          tipo: 'error',
          texto: err.message || 'Erro ao salvar atendimento.',
        };
        this.cdr.markForCheck();
      },
    });
  }

  onCancelar(): void {
    this.router.navigate(['/atendimentos']);
  }

  fecharFeedback(): void {
    this.feedbackMessage = null;
  }

  isInvalid(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  getError(campo: string): string {
    const control = this.form.get(campo);
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'Campo obrigatório.';
    if (control.errors['minlength']) {
      return `Mínimo de ${control.errors['minlength'].requiredLength} caracteres.`;
    }
    if (control.errors['maxlength']) {
      return `Máximo de ${control.errors['maxlength'].requiredLength} caracteres.`;
    }
    if (control.errors['futureDate']) return 'A data não pode ser futura.';
    return 'Valor inválido.';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
