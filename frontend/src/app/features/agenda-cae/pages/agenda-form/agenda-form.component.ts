import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AgendaCaeService } from '../../../../core/services/agenda-cae.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './agenda-form.component.html',
  styleUrls: ['./agenda-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgendaFormComponent implements OnInit {
  form!: FormGroup;

  editMode = false;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly service: AgendaCaeService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
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

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.editMode = true;
      this.isLoading = true;

      this.service.buscarHorarioPorId(id).subscribe({
        next: (horario) => {
          this.form.patchValue(horario);
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.errorMessage = 'Erro ao carregar horário.';
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
    }
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
    this.errorMessage = null;
    this.cdr.markForCheck();

    const value = this.form.getRawValue() as any;

    const request$ = this.editMode
      ? this.service.atualizarHorario(value)
      : this.service.criarHorario(value);

    request$.subscribe({
      next: () => this.router.navigate(['/agenda-cae']),
      error: () => {
        this.errorMessage = 'Erro ao salvar horário.';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }
}
