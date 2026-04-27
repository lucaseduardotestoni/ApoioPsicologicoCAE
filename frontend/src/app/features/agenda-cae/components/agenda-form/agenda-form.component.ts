import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-agenda-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agenda-form.component.html',
  styleUrls: ['../../shared/styles/form-page.scss'],
})
export class AgendaFormComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() isLoading = false;
  @Input() submitLabel = 'Salvar';

  @Output() formSubmit = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();
}