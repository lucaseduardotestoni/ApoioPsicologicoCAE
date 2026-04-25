import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { ComunicadoFormComponent } from '../../components/comunicado-form/comunicado-form.component';
import { ComunicadoService } from '../../../../core/services/comunicado.service';
import { GrupoUsuarioService } from '../../../../core/services/grupo-usuario.service';
import { Comunicado, CreateComunicadoPayload } from '../../../../core/models/comunicado.model';
import { GrupoUsuario } from '../../../../core/models/grupo-usuario.model';

@Component({
  selector: 'app-create-comunicado',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ComunicadoFormComponent,
  ],
  templateUrl: './create-comunicado.component.html',
  styleUrls: ['./create-comunicado.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateComunicadoComponent implements OnInit, OnDestroy {

  comunicado: Comunicado | null = null;
  grupos: GrupoUsuario[] = [];
  loading = false;
  isEditMode = false;

  private destroy$ = new Subject<void>();

  constructor(
    private comunicadoService: ComunicadoService,
    private grupoService: GrupoUsuarioService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.grupoService
      .listarTodos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((grupos: GrupoUsuario[]) => {
        this.grupos = grupos;
        this.cdr.markForCheck();
      });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loading = true;

      this.comunicadoService
        .getById(Number(id))
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (c: Comunicado) => {
            if (!c) { this.voltar(); return; }
            this.comunicado = c;
            this.loading = false;
            this.cdr.markForCheck();
          },
          error: () => {
            this.loading = false;
            this.cdr.markForCheck();
          },
        });
    }
  }

  onFormSubmit(payload: CreateComunicadoPayload): void {
    this.loading = true;
    this.cdr.markForCheck();

    const request$ = this.isEditMode && this.comunicado
      ? this.comunicadoService.update(this.comunicado.id!, payload)
      : this.comunicadoService.create(payload);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => { this.voltar(); },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onCancelar(): void { this.voltar(); }

  private voltar(): void {
    this.router.navigate(['/comunicados']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}