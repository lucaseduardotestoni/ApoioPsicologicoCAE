import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Estudante, TipoAtendimento } from '../../../../core/models/atendimento.model';

@Component({
  selector: 'app-atendimento-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './atendimento-form.component.html',
  styleUrls: ['../../shared/styles/form-page.scss'],
})
export class AtendimentoFormComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() estudantes: Estudante[] = [];
  @Input() tipos: { value: TipoAtendimento; label: string }[] = [];
  @Input() isLoading = false;
  @Input() isLoadingEstudantes = false;
  @Input() submitLabel = 'Salvar';

  @Output() formSubmit = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

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
}