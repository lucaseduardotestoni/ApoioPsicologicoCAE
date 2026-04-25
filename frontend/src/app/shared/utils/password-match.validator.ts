import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator de grupo que verifica se dois campos de senha são iguais.
 *
 * @param senhaControlName - nome do control da senha
 * @param confirmacaoControlName - nome do control de confirmação
 *
 * Uso:
 *   this.form = this.fb.group({
 *     senha: [''],
 *     confirmacaoSenha: [''],
 *   }, { validators: passwordMatchValidator('senha', 'confirmacaoSenha') });
 */
export function passwordMatchValidator(
  senhaControlName: string,
  confirmacaoControlName: string
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const senha = group.get(senhaControlName)?.value;
    const confirmacao = group.get(confirmacaoControlName)?.value;

    if (senha && confirmacao && senha !== confirmacao) {
      // Define o erro no campo de confirmação para exibir mensagem inline
      group.get(confirmacaoControlName)?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    // Limpa apenas o erro de mismatch, preservando outros erros (ex: required)
    const confirmacaoControl = group.get(confirmacaoControlName);
    if (confirmacaoControl?.hasError('passwordMismatch')) {
      const errors = { ...confirmacaoControl.errors };
      delete errors['passwordMismatch'];
      confirmacaoControl.setErrors(Object.keys(errors).length ? errors : null);
    }

    return null;
  };
}
