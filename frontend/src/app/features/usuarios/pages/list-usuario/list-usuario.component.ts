import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Usuario } from '../../../../core/models/usuario.model';
import { UsuarioService } from '../../../../core/services/usuario.service';

@Component({
  selector: 'app-list-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-usuario.component.html',
  styleUrls: ['./list-usuario.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListUsuarioComponent implements OnInit {

  usuarios: Usuario[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  private carregarUsuarios(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.usuarioService.listarTodos().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.usuarios = [];
        this.errorMessage = 'Erro ao carregar usuários da API.';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }
}
