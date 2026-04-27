import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, combineLatest, map, Observable, of, shareReplay } from 'rxjs';

interface ListResponse<T> {
  count?: number;
  results?: T[];
}

interface ComunicadoApi {
  ativo?: boolean;
}

export interface DashboardStats {
  usuarios: number;
  grupos: number;
  comunicadosAtivos: number;
  atendimentos: number;
  prontuarios: number;
  horarios: number;
}

// DashboardStatsService: consolida métricas do dashboard usando os endpoints da API
@Injectable({ providedIn: 'root' })
export class DashboardStatsService {
  // base da API
  private readonly apiBaseUrl = 'http://localhost:8000/api';

  // stream com os números exibidos no dashboard
  readonly stats$: Observable<DashboardStats>;

  constructor(private readonly http: HttpClient) {
    // monta as estatísticas agregadas por recurso
    this.stats$ = combineLatest({
      // contagens diretas por endpoint
      usuarios: this.getEndpoint('usuarios'),
      grupos: this.getEndpoint('gruposusuarios'),
      atendimentos: this.getEndpoint('atendimentos'),
      horarios: this.getEndpoint('horarios'),

      // comunicados precisa de filtro por ativo
      comunicadosAtivos: this.getColecao<ComunicadoApi>('comunicados').pipe(
        map((comunicados) => comunicados.filter((comunicado) => comunicado.ativo).length),
        catchError(() => of(0))
      ),
    }).pipe(
      map(({ usuarios, grupos, comunicadosAtivos, atendimentos, horarios }) => {
        return {
          usuarios,
          grupos,
          comunicadosAtivos,
          atendimentos,
          prontuarios: atendimentos,
          horarios,
        };
      }),
      shareReplay(1)
    );
  }

  // retorna a quantidade de um endpoint de lista (array simples ou paginado)
  private getEndpoint(endpoint: string): Observable<number> {
    return this.http.get<unknown>(`${this.apiBaseUrl}/${endpoint}/`).pipe(
      map((response) => {
        if (Array.isArray(response)) return response.length;
        if (this.respostaLista<unknown>(response)) {
          if (typeof response.count === 'number') return response.count;
          return response.results?.length ?? 0;
        }
        return 0;
      }),
      catchError(() => of(0))
    );
  }

  // retorna a coleção completa para processar dados do item
  private getColecao<T>(endpoint: string): Observable<T[]> {
    return this.http.get<unknown>(`${this.apiBaseUrl}/${endpoint}/`).pipe(
      map((response) => {
        if (Array.isArray(response)) return response as T[];
        if (this.respostaLista<T>(response)) return response.results ?? [];
        return [];
      })
    );
  }

  // valida se a resposta segue o padrão paginado do DRF
  private respostaLista<T>(value: unknown): value is ListResponse<T> {
    if (!value || typeof value !== 'object') return false;
    return 'results' in value || 'count' in value;
  }
}
