import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GrupoUsuario } from '../../../../core/models/grupo-usuario.model';
// GrupoSelectorComponent: componente de seleção de grupos integrado ao form 
@Component({
  selector: 'app-grupo-selector',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule],
  templateUrl: './grupo-selector.component.html',
  styleUrls: ['./grupo-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GrupoSelectorComponent),
      multi: true,
    },
  ],
})
export class GrupoSelectorComponent implements ControlValueAccessor {

  @Input() grupos: GrupoUsuario[] = []; // lista os grupos para selecionar
  @Input() label = 'Grupos destinatários';

  selectedIds: number[] = [];
  isDisabled = false;

  private onChange: (value: number[]) => void = () => {};
  private onTouched: () => void = () => {};

  trackById(index: number, item: GrupoUsuario): number {
    return item.id!;
  }
// verifica se o grupo está selecionado
  isChecked(id: number): boolean {
    return this.selectedIds.includes(id);
  }

  toggle(id: number): void {
    if (this.isDisabled) return;

    this.selectedIds = this.isChecked(id)
      ? this.selectedIds.filter((sid) => sid !== id)
      : [...this.selectedIds, id];

    this.onChange(this.selectedIds); //envia para o form a mudança
    this.onTouched();
  }

  // Recebe valor do form
  writeValue(value: number[]): void {
    this.selectedIds = value ?? [];
  }
  // Registra mudança
  registerOnChange(fn: (value: number[]) => void): void {
    this.onChange = fn;
  }
  // Registra toque
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  // Controla estado desabilitado
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}