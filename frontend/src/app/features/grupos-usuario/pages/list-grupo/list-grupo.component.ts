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

  constructor(
    private service: GrupoUsuarioService,
    private cdr: ChangeDetectorRef,
  ) {}

ngOnInit(): void {
  // MOCK TEMPORÁRIO
  this.grupos = [
    { id: 1, nome: 'Administrador' },
    { id: 2, nome: 'Usuário Padrão' },
    { id: 3, nome: 'Coordenador' },
  ];

  this.isLoading = false;
  this.cdr.markForCheck();
}
}
