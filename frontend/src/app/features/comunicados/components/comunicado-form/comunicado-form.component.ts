import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GrupoSelectorComponent } from '../grupo-selector/grupo-selector.component';
import { Comunicado, CreateComunicadoPayload } from '../../../../core/models/comunicado.model';
import { GrupoUsuario } from '../../../../core/models/grupo-usuario.model';
// Componente de formulário de comunicado (criar/editar)
@Component({
  selector: 'app-comunicado-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GrupoSelectorComponent,
  ],
  templateUrl: './comunicado-form.component.html',
  styleUrls: ['./comunicado-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComunicadoFormComponent implements OnInit, OnChanges {

  @Input() comunicado: Comunicado | null = null;
  @Input() grupos: GrupoUsuario[] = [];
  @Input() loading = false;

  @Output() formSubmit = new EventEmitter<CreateComunicadoPayload>(); // envia dados do form
  @Output() cancelar = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm(); //cria o form
    if (this.comunicado) this.patchForm(); // apenas preenche se for edição
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['comunicado'] && !changes['comunicado'].firstChange && this.form) {
      this.patchForm();
    }
  }

 // Acessos rápidos aos campos
  get titulo(): AbstractControl { return this.form.get('titulo')!; }
  get mensagem(): AbstractControl { return this.form.get('mensagem')!; }
  get grupoIds(): AbstractControl { return this.form.get('grupoIds')!; }
// conta os caracteres
  get tituloLen(): number { return this.titulo.value?.length ?? 0; }
  get mensagemLen(): number { return this.mensagem.value?.length ?? 0; }

  // Cria estrutura do formulário com validações
  private buildForm(): void {
    this.form = this.fb.group({
      titulo:   ['', [Validators.required, Validators.maxLength(200)]],
      mensagem: ['', [Validators.required, Validators.maxLength(5000)]],
      ativo:    [true],
      grupoIds: [[], [this.gruposRequeridosValidator]],
    });
  }
  // Preenche o formulário com dados existentes
  private patchForm(): void {
    if (!this.comunicado) return;

    this.form.patchValue({
      titulo:   this.comunicado.titulo,
      mensagem: this.comunicado.mensagem,
      ativo:    this.comunicado.ativo,
      grupoIds: this.comunicado.grupos?.map(g => g.id) || [] 
    });
  }
  // valida se tem >= 1 grupo selecionado
  private gruposRequeridosValidator(control: AbstractControl) {
    const value: number[] = control.value;
    return Array.isArray(value) && value.length > 0
      ? null
      : { gruposObrigatorios: true };
  }

  // envia o form se tudo ok
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formSubmit.emit(this.form.getRawValue() as CreateComunicadoPayload); 
  }
  // ação de cancelar
  onCancelar(): void {
    this.cancelar.emit();
  }
}