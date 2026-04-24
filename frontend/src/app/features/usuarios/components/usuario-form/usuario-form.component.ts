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
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { GrupoUsuario } from '../../../../core/models/grupo-usuario.model';
import { CreateUsuarioPayload } from '../../../../core/models/usuario.model';
import { passwordMatchValidator } from '../../../../shared/utils/password-match.validator';

/**
 * Componente de formulário reutilizável para criação/edição de usuário.
 *
 * É um componente "burro" (dumb component): recebe dados via @Input
 * e emite eventos via @Output. Não conhece serviços nem roteamento.
 *
 * Responsabilidades:
 *  - Estrutura e validação do formulário
 *  - Exibição de erros inline
 *  - Emissão do payload ao container pai
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

  /** Indica se o container está processando a requisição (desabilita o botão) */
  @Input() isLoading = false;

  /** Emite o payload válido para o container realizar a operação */
  @Output() formSubmit = new EventEmitter<CreateUsuarioPayload>();

  /** Emite quando o usuário cancela */
  @Output() cancelar = new EventEmitter<void>();

  form!: FormGroup;

  /** Controla visibilidade da senha */
  showSenha = false;
  showConfirmacao = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Se o estado de loading mudar, habilita/desabilita o form
    if (changes['isLoading'] && this.form) {
      this.isLoading ? this.form.disable() : this.form.enable();
    }
  }

  /**
   * Constrói o Reactive Form com todas as validações.
   * Separado do ngOnInit para facilitar testes unitários.
   */
  private buildForm(): void {
    this.form = this.fb.group(
      {
        nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        senha: ['', [Validators.required, Validators.minLength(6)]],
        confirmacaoSenha: ['', [Validators.required]],
        grupoUsuarioId: [null, [Validators.required]],
        status: ['ATIVO', [Validators.required]],
        mudaSenha: [false],
      },
      {
        validators: passwordMatchValidator('senha', 'confirmacaoSenha'),
      }
    );
  }

  /** Utilitário para acesso fácil aos controls no template */
  get f() {
    return this.form.controls;
  }

  /**
   * Verifica se um campo possui erro e foi tocado/sujo.
   * Usado no template para exibir mensagens de erro.
   */
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

    const payload: CreateUsuarioPayload = {
      nome: values.nome,
      senha: values.senha,
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
