import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

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

@Component({
  selector: 'app-create-atendimento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-atendimento.component.html',
  styleUrls: ['./create-atendimento.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAtendimentoComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  estudantes: Estudante[] = [];
  isLoading = false;
  isLoadingEstudantes = true;
  isEditMode = false;
  atendimentoId: number | null = null;
  feedback: { tipo: 'success' | 'error'; texto: string } | null = null;

  readonly tipos: { value: TipoAtendimento; label: string }[] = [
    { value: 'PSICOLOGICO', label: 'Psicológico' },
    { value: 'SOCIAL',      label: 'Social' },
    { value: 'PEDAGOGICO',  label: 'Pedagógico' },
    { value: 'ORIENTACAO',  label: 'Orientação' },
    { value: 'OUTRO',       label: 'Outro' },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private service: AtendimentoService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.carregarEstudantes();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.atendimentoId = Number(id);
      this.carregarAtendimento(this.atendimentoId);
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      estudanteId: [null, Validators.required],
      data:        ['', [Validators.required, notFutureDate]],
      tipo:        ['', Validators.required],
      descricao:   ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
      responsavel: ['', [Validators.required, Validators.minLength(3)]],
      observacoes: [''],
    });
  }

  private carregarEstudantes(): void {
    this.service
      .listarEstudantes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: lista => {
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
    this.isLoading = true;
    this.service
      .buscarPorId(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: atendimento => {
          if (!atendimento) {
            this.feedback = { tipo: 'error', texto: 'Atendimento não encontrado.' };
            this.isLoading = false;
            this.cdr.markForCheck();
            return;
          }
          this.form.patchValue(atendimento);
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.feedback = { tipo: 'error', texto: 'Erro ao carregar atendimento.' };
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  /** Retorna o nome do estudante selecionado para incluir no payload */
  private getNomeEstudante(id: number): string {
    return this.estudantes.find(e => e.id === id)?.nome ?? '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.feedback = null;
    this.cdr.markForCheck();

    const raw = this.form.value;
    const payload = {
      ...raw,
      estudanteId: Number(raw.estudanteId),
      estudanteNome: this.getNomeEstudante(Number(raw.estudanteId)),
    };

    const request$ = this.isEditMode && this.atendimentoId
      ? this.service.atualizar(this.atendimentoId, payload)
      : this.service.criar(payload);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.isLoading = false;
        this.feedback = {
          tipo: 'success',
          texto: this.isEditMode
            ? 'Atendimento atualizado com sucesso!'
            : 'Atendimento registrado com sucesso!',
        };
        this.cdr.markForCheck();
        setTimeout(() => this.router.navigate(['/atendimentos']), 1800);
      },
      error: (err: Error) => {
        this.isLoading = false;
        this.feedback = {
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
    this.feedback = null;
  }

  // Helpers de validação para o template
  isInvalid(campo: string): boolean {
    const c = this.form.get(campo);
    return !!(c && c.invalid && c.touched);
  }

  getError(campo: string): string {
    const c = this.form.get(campo);
    if (!c || !c.errors) return '';
    if (c.errors['required'])   return 'Campo obrigatório.';
    if (c.errors['minlength'])  return `Mínimo de ${c.errors['minlength'].requiredLength} caracteres.`;
    if (c.errors['maxlength'])  return `Máximo de ${c.errors['maxlength'].requiredLength} caracteres.`;
    if (c.errors['futureDate']) return 'A data não pode ser futura.';
    return 'Valor inválido.';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
