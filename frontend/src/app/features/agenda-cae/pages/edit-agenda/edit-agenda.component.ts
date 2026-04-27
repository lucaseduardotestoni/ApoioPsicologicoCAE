import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { AgendaFormComponent } from '../../components/agenda-form/agenda-form.component';
import { AgendaCaeService } from '../../../../core/services/agenda-cae.service';

/**
 * Página/Container de edição de horário da agenda CAE.
 */
@Component({
  selector: 'app-edit-agenda',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AgendaFormComponent],
  templateUrl: './edit-agenda.component.html',
  styleUrls: ['../../shared/styles/form-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAgendaComponent implements OnInit {
  form!: FormGroup;

  isLoading = false;
  feedbackMessage: { tipo: 'success' | 'error'; texto: string } | null = null;

  private readonly horarioId: number;

  constructor(
    private readonly fb: FormBuilder,
    private readonly service: AgendaCaeService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.horarioId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [0],
      data: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFim: ['', Validators.required],
      disponivel: [true, Validators.required],
      observacao: [''],
    });

    if (Number.isNaN(this.horarioId)) {
      this.feedbackMessage = {
        tipo: 'error',
        texto: 'ID inválido para edição de horário.',
      };
      this.cdr.markForCheck();
      return;
    }

    this.carregarHorario(this.horarioId);
  }

  private carregarHorario(id: number): void {
    this.isLoading = true;

    this.service.buscarHorarioPorId(id).subscribe({
      next: (horario) => {
        this.form.patchValue(horario);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.feedbackMessage = {
          tipo: 'error',
          texto: 'Erro ao carregar horário.',
        };
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/agenda-cae']);
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.feedbackMessage = null;
    this.cdr.markForCheck();

    const payload = this.form.getRawValue();

    this.service.atualizarHorario(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.feedbackMessage = {
          tipo: 'success',
          texto: 'Horário atualizado com sucesso!',
        };
        this.cdr.markForCheck();
        setTimeout(() => this.router.navigate(['/agenda-cae']), 1800);
      },
      error: () => {
        this.feedbackMessage = {
          tipo: 'error',
          texto: 'Erro ao salvar horário.',
        };
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  fecharFeedback(): void {
    this.feedbackMessage = null;
  }
}
