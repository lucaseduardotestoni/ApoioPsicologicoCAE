import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Permissao } from '../models/permissao.model';
import { NivelPermissao } from '../models/nivel-permissao.model';
// PermissaoService: fornece permissões e níveis (mock em memória)
@Injectable({ providedIn: 'root' })
export class PermissaoService {

  private readonly mockPermissoes: Permissao[] = [
    { id: 1, nome: 'Gerenciar Usuários',      nivelPermissaoPadrao: 2 },
    { id: 2, nome: 'Gerenciar Grupos',         nivelPermissaoPadrao: 2 },
    { id: 3, nome: 'Visualizar Relatórios',    nivelPermissaoPadrao: 1 },
    { id: 4, nome: 'Exportar Dados',           nivelPermissaoPadrao: 1 },
    { id: 5, nome: 'Configurações do Sistema', nivelPermissaoPadrao: 3 },
    { id: 6, nome: 'Diário de Aula',           nivelPermissaoPadrao: 2 },
    { id: 7, nome: 'Lançamento de Notas',      nivelPermissaoPadrao: 2 },
    { id: 8, nome: 'Calendário Acadêmico',     nivelPermissaoPadrao: 1 },
  ];
// níveis de permissão disponíveis
  private readonly mockNiveis: NivelPermissao[] = [
    { id: 1, descricao: 'Leitura' },
    { id: 2, descricao: 'Escrita' },
    { id: 3, descricao: 'Admin'   },
  ];
// retorna permissões
  listarPermissoes(): Observable<Permissao[]> {
    return of(this.mockPermissoes);
  }
// retorna níveis
  listarNiveis(): Observable<NivelPermissao[]> {
    return of(this.mockNiveis);
  }
}
