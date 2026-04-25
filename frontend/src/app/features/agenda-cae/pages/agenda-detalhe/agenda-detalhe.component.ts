import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendaCaeService } from '../../../../core/services/agenda-cae.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agenda-detalhe.component.html',
  styleUrls: ['./agenda-detalhe.component.scss']
})
export class AgendaDetalheComponent {

  constructor(public service: AgendaCaeService) {}
}