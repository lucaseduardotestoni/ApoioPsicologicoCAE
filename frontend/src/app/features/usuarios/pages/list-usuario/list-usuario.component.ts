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

  constructor(
    private service: UsuarioService,
    private cdr: ChangeDetectorRef,
  ) {}

ngOnInit(): void {
  // MOCK TEMPORÁRIO
  this.usuarios = [
    {
      id: 1,
      nome: 'Guilherme Kuhnen',
      status: 'ATIVO',
      grupoUsuarioId: 1,
      horaCriado: new Date(),
      mudaSenha: false,
    },
    {
      id: 2,
      nome: 'Eduardo Zirbell',
      status: 'INATIVO',
      grupoUsuarioId: 2,
      horaCriado: new Date(),
      mudaSenha: false,
    }
  ];

  this.isLoading = false;
  this.cdr.markForCheck();
}
}
