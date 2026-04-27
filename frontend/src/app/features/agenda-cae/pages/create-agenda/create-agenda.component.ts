import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AgendaFormComponent } from '../../components/agenda-form/agenda-form.component';
import { AgendaCaeService } from '../../../../core/services/agenda-cae.service';

/**
 * Página/Container de criação de horário da agenda CAE.
 */
@Component({
  selector: 'app-create-agenda',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AgendaFormComponent],
  templateUrl: './create-agenda.component.html',
  styleUrls: ['../../shared/styles/form-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAgendaComponent implements OnInit {
  form!: FormGroup;

  isLoading = false;
  feedbackMessage: { tipo: 'success' | 'error'; texto: string } | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly service: AgendaCaeService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [0],
      data: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFim: ['', Validators.required],
      disponivel: [true, Validators.required],
      observacao: [''],
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

    this.service.criarHorario(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.feedbackMessage = {
          tipo: 'success',
          texto: 'Horário cadastrado com sucesso!',
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
