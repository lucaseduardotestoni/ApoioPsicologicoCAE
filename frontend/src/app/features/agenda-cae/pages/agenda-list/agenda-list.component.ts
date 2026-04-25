import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AgendaCaeService } from '../../../../core/services/agenda-cae.service';

@Component({
  selector: 'app-agenda-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agenda-list.component.html',
  styleUrls: ['./agenda-list.component.scss']
})
export class AgendaListComponent {

  constructor(
    public service: AgendaCaeService,
    private router: Router
  ) {}

  novo() {
    this.router.navigate(['/agenda-cae/novo']);
  }

  editar(id: number) {
    this.router.navigate(['/agenda-cae/editar', id]);
  }

  excluir(id: number) {
    this.service.removerHorario(id);
  }
}