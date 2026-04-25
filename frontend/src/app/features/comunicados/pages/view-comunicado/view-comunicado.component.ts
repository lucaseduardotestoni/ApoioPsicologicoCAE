import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';

import { ComunicadoService } from '../../../../core/services/comunicado.service';
import { Comunicado } from '../../../../core/models/comunicado.model';

// Componente de visualização de um comunicado
@Component({
  selector: 'app-view-comunicado',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './view-comunicado.component.html',
  styleUrls: ['./view-comunicado.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewComunicadoComponent implements OnInit, OnDestroy {
  comunicado: Comunicado | null = null; // comunicado carregado
  loading = true; // controle de loading

  private destroy$ = new Subject<void>(); // controla unsubscribe

  constructor(
    private comunicadoService: ComunicadoService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // pega id da rota
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // busca comunicado pelo id
    this.comunicadoService
      .getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (c) => {
          if (!c) {
            // caso não encontre
            this.snackBar.open('Comunicado não encontrado.', 'Fechar', { duration: 3000 });
            this.voltar();
            return;
          }
          this.comunicado = c;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          // erro ao carregar
          this.loading = false;
          this.snackBar.open('Erro ao carregar comunicado.', 'Fechar', { duration: 3000 });
          this.cdr.markForCheck();
        },
      });
  }

  // volta para tela anterior
  voltar(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  // limpa subscriptions ao destruir componente
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}