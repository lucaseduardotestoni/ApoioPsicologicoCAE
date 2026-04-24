import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AgendaCaeService } from '../../../../core/services/agenda-cae.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './agenda-form.component.html',
  styleUrls: ['./agenda-form.component.scss']
})
export class AgendaFormComponent implements OnInit {

  form: any;
  editMode = false;

  constructor(
    private fb: FormBuilder,
    private service: AgendaCaeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [0],
      data: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFim: ['', Validators.required],
      disponivel: [true],
      observacao: ['']
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.editMode = true;

      this.service.horarios$.subscribe((horarios: any[]) => {
        const horario = horarios.find(h => h.id === id);

        if (horario) {
          this.form.patchValue(horario);
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/agenda-cae']);
  }

  salvar() {
    const value = this.form.value as any;

    if (this.editMode) {
      this.service.atualizarHorario(value);
    } else {
      this.service.criarHorario(value);
    }

    this.router.navigate(['/agenda-cae']);
  }
}