import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { GrupoUsuario } from '../../../../core/models/grupo-usuario.model';
import { Usuario, UsuarioFormPayload } from '../../../../core/models/usuario.model';
import { passwordMatchValidator } from '../../../../shared/utils/password-match.validator';

/**
 * Formulário reutilizável para criação e edição de usuário.
 */
@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.scss'],
})
export class UsuarioFormComponent implements OnInit, OnChanges {

  /** Lista de grupos carregada pelo container pai */
  @Input() grupos: GrupoUsuario[] = [];

  /** Dados do usuário carregados para edição */
  @Input() usuario: Usuario | null = null;

  /** Indica se a tela está no modo edição */
  @Input() isEditMode = false;

  /** Indica se o container está processando a requisição (desabilita o botão) */
  @Input() isLoading = false;

  /** Emite o payload válido para o container realizar a operação */
  @Output() formSubmit = new EventEmitter<UsuarioFormPayload>();

  /** Emite quando o usuário cancela */
  @Output() cancelar = new EventEmitter<void>();

  form!: FormGroup;

  /** Controla visibilidade dos campos de senha */
  showSenha = false;
  showConfirmacao = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    this.applyEditState();
    this.patchForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Habilita ou desabilita o formulário conforme o estado de carregamento
    if (changes['isLoading'] && this.form) {
      this.isLoading ? this.form.disable() : this.form.enable();
    }

    // Reaplica regras quando alterna entre criação e edição
    if ((changes['isEditMode'] || changes['usuario']) && this.form) {
      this.applyEditState();
      this.patchForm();
    }
  }

  // Constrói o Reactive Form.
  private buildForm(): void {
    this.form = this.fb.group(
      {
        nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        senha: ['', [Validators.minLength(6)]],
        confirmacaoSenha: [''],
        grupoUsuarioId: [null, [Validators.required]],
        status: ['ATIVO', [Validators.required]],
        mudaSenha: [false],
      },
      { validators: passwordMatchValidator('senha', 'confirmacaoSenha') }
    );
  }

  private applyEditState(): void {
    const senha = this.form.get('senha') as FormControl<string | null>;
    const confirmacaoSenha = this.form.get('confirmacaoSenha') as FormControl<string | null>;

    if (this.isEditMode) {
      senha.clearValidators();
      confirmacaoSenha.clearValidators();
    } else {
      senha.setValidators([Validators.required, Validators.minLength(6)]);
      confirmacaoSenha.setValidators([Validators.required]);
    }

    senha.updateValueAndValidity({ emitEvent: false });
    confirmacaoSenha.updateValueAndValidity({ emitEvent: false });
  }

  private patchForm(): void {
    if (!this.usuario || !this.form) return;

    this.form.patchValue(
      {
        nome: this.usuario.nome,
        senha: '',
        confirmacaoSenha: '',
        grupoUsuarioId: this.usuario.grupoUsuarioId,
        status: this.usuario.status,
        mudaSenha: this.usuario.mudaSenha,
      },
      { emitEvent: false }
    );
  }

  /** Utilitário para acesso fácil aos controls no template */
  get f() {
    return this.form.controls;
  }

  // Verifica se um campo possui erro e foi tocado/sujo.
  hasError(campo: string, erro?: string): boolean {
    const control = this.form.get(campo);
    if (!control || !(control.touched || control.dirty)) return false;
    return erro ? control.hasError(erro) : control.invalid;
  }

  onSubmit(): void {
    // Marca todos os campos como tocados para exibir erros
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const { confirmacaoSenha, ...values } = this.form.getRawValue();

    const payload: UsuarioFormPayload = {
      nome: values.nome,
      senha: values.senha?.trim() || undefined,
      grupoUsuarioId: Number(values.grupoUsuarioId),
      mudaSenha: values.mudaSenha,
      status: values.status,
    };

    this.formSubmit.emit(payload);
  }

  onCancelar(): void {
    this.cancelar.emit();
  }
}
