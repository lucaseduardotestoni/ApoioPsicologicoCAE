import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GrupoUsuario } from '../../../../core/models/grupo-usuario.model';

@Component({
  selector: 'app-grupo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './grupo-form.component.html',
  styleUrls: ['./grupo-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrupoFormComponent implements OnInit, OnChanges {
  @Input() grupo: GrupoUsuario | null = null;
  @Input() isLoading = false;

  form!: FormGroup;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: [
        this.grupo?.nome ?? '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
      ],
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

  markAllTouched(): void {
    this.form.markAllAsTouched();
  }

  isValid(): boolean {
    return this.form.valid;
  }

  getPayload(): GrupoUsuario {
    const nome = String(this.form.getRawValue().nome ?? '').trim();

    return {
      ...this.grupo,
      nome,
    };
  }

  hasError(campo: string, erro?: string): boolean {
    const control = this.form.get(campo);
    if (!control || !(control.touched || control.dirty)) return false;
    return erro ? control.hasError(erro) : control.invalid;
  }
}
