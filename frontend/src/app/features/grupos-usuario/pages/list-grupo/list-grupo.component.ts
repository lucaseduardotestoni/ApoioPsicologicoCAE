import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GrupoUsuario } from '../../../../core/models/grupo-usuario.model';
import { GrupoUsuarioService } from '../../../../core/services/grupo-usuario.service';

@Component({
  selector: 'app-list-grupo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-grupo.component.html',
  styleUrls: ['./list-grupo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListGrupoComponent implements OnInit {

  grupos: GrupoUsuario[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private grupoUsuarioService: GrupoUsuarioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarGrupos();
  }

  private carregarGrupos(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.grupoUsuarioService.listarTodos().subscribe({
      next: (grupos: GrupoUsuario[]) => {
        this.grupos = grupos;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.grupos = [];
        this.errorMessage = 'Erro ao carregar grupos da API.';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }
}
