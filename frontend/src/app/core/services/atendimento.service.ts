import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  CreateAtendimentoPayload,
  Estudante,
  RegistroAtendimento,
  TipoAtendimento,
} from '../models/atendimento.model';

interface ListResponse<T> {
  count?: number;
  results?: T[];
}

interface EstudanteApi {
  id: number;
  nome: string;
  codigo_pessoa?: string;
  codigo_vinculo?: string;
  curso?: string | null;
  email?: string | null;
}

interface AtendimentoApi {
  id?: number;
  estudante_id: number;
  estudante_nome?: string;
  data: string;
  tipo: string;
  descricao: string;
  responsavel: string;
  observacoes?: string | null;
  criado_em?: string;
}

@Injectable({ providedIn: 'root' })
export class AtendimentoService {
  private readonly apiBaseUrl = 'http://localhost:8000/api';

  constructor(private readonly http: HttpClient) {}

  listarEstudantes(): Observable<Estudante[]> {
    return this.http.get<unknown>(`${this.apiBaseUrl}/estudantes/`).pipe(
      map((response) => this.mapLista(response, (item) => this.mapEstudante(item as EstudanteApi)))
    );
  }

  buscarEstudantes(termo: string): Observable<Estudante[]> {
    const termoNormalizado = termo.toLowerCase().trim();

    return this.listarEstudantes().pipe(
      map((estudantes) => {
        if (!termoNormalizado) return estudantes;

        return estudantes.filter(
          (estudante) =>
            estudante.nome.toLowerCase().includes(termoNormalizado) ||
            estudante.matricula.toLowerCase().includes(termoNormalizado)
        );
      })
    );
  }

  buscarEstudantePorId(id: number): Observable<Estudante | undefined> {
    return this.http.get<EstudanteApi>(`${this.apiBaseUrl}/estudantes/${id}/`).pipe(
      map((estudante) => this.mapEstudante(estudante))
    );
  }

  listarTodos(): Observable<RegistroAtendimento[]> {
    return this.http.get<unknown>(`${this.apiBaseUrl}/atendimentos/`).pipe(
      map((response) => this.mapLista(response, (item) => this.mapAtendimento(item as AtendimentoApi)))
    );
  }

  listarPorEstudante(estudanteId: number): Observable<RegistroAtendimento[]> {
    return this.http.get<unknown>(`${this.apiBaseUrl}/atendimentos/?estudante_id=${estudanteId}`).pipe(
      map((response) => this.mapLista(response, (item) => this.mapAtendimento(item as AtendimentoApi)))
    );
  }

  buscarPorId(id: number): Observable<RegistroAtendimento | undefined> {
    return this.http.get<AtendimentoApi>(`${this.apiBaseUrl}/atendimentos/${id}/`).pipe(
      map((atendimento) => this.mapAtendimento(atendimento))
    );
  }

  criar(payload: CreateAtendimentoPayload): Observable<RegistroAtendimento> {
    return this.http.post<AtendimentoApi>(`${this.apiBaseUrl}/atendimentos/`, this.mapPayload(payload)).pipe(
      map((atendimento) => this.mapAtendimento(atendimento))
    );
  }

  atualizar(id: number, payload: CreateAtendimentoPayload): Observable<RegistroAtendimento> {
    return this.http.patch<AtendimentoApi>(`${this.apiBaseUrl}/atendimentos/${id}/`, this.mapPayload(payload)).pipe(
      map((atendimento) => this.mapAtendimento(atendimento))
    );
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/atendimentos/${id}/`);
  }

  private mapPayload(payload: CreateAtendimentoPayload): Record<string, unknown> {
    return {
      estudante_id: payload.estudanteId,
      data: payload.data,
      tipo: payload.tipo,
      descricao: payload.descricao.trim(),
      responsavel: payload.responsavel.trim(),
      observacoes: payload.observacoes?.trim() || '',
    };
  }

  private mapEstudante(estudante: EstudanteApi): Estudante {
    return {
      id: estudante.id,
      nome: estudante.nome,
      matricula: estudante.codigo_vinculo || estudante.codigo_pessoa || '',
      curso: estudante.curso || undefined,
      email: estudante.email || undefined,
    };
  }

  private mapAtendimento(atendimento: AtendimentoApi): RegistroAtendimento {
    return {
      id: atendimento.id ?? 0,
      estudanteId: atendimento.estudante_id,
      estudanteNome: atendimento.estudante_nome ?? '',
      data: atendimento.data,
      tipo: this.normalizarTipo(atendimento.tipo),
      descricao: atendimento.descricao,
      responsavel: atendimento.responsavel,
      observacoes: atendimento.observacoes || undefined,
      criadoEm: atendimento.criado_em ? new Date(atendimento.criado_em) : undefined,
    };
  }

  private normalizarTipo(tipo: string): TipoAtendimento {
    return String(tipo).toUpperCase() as TipoAtendimento;
  }

  private mapLista<T>(response: unknown, mapper: (item: unknown) => T): T[] {
    const lista = this.isListResponse<unknown>(response)
      ? (response.results ?? [])
      : Array.isArray(response)
        ? response
        : [];

    return lista.map((item) => mapper(item));
  }

  private isListResponse<T>(value: unknown): value is ListResponse<T> {
    if (!value || typeof value !== 'object') return false;
    return 'results' in value || 'count' in value;
  }
}
