import {
  ChangeDetectionStrategy, Component, EventEmitter,
  Input, OnChanges, OnInit, Output, SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GrupoUsuario } from '../../../../core/models/grupo-usuario.model';

/**
 * Componente "dumb" — só cuida do campo Nome do grupo.
 * Emite o valor quando válido via @Output.
 */
@Component({
  selector: 'app-grupo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './grupo-form.component.html',
  styleUrls: ['./grupo-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrupoFormComponent implements OnInit, OnChanges {

  /** Dados para modo edição */
  @Input() grupo: GrupoUsuario | null = null;
  @Input() isLoading = false;

  @Output() nomeChange = new EventEmitter<string | null>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: [this.grupo?.nome ?? '', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    });

    // Emite null quando inválido, string quando válido
    this.form.valueChanges.subscribe(() => {
      this.nomeChange.emit(this.form.valid ? this.form.value.nome : null);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['grupo'] && this.form && this.grupo) {
      this.form.patchValue({ nome: this.grupo.nome }, { emitEvent: false });
    }
    if (changes['isLoading'] && this.form) {
      this.isLoading ? this.form.disable() : this.form.enable();
    }
  }

  /** Exposto para o container acionar validação visual antes do submit */
  markAllTouched(): void {
    this.form.markAllAsTouched();
  }

  hasError(campo: string, erro?: string): boolean {
    const c = this.form.get(campo);
    if (!c || !(c.touched || c.dirty)) return false;
    return erro ? c.hasError(erro) : c.invalid;
  }
}
