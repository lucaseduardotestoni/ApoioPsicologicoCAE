import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AgendamentoEstudante, HorarioAtendimento } from '../models/atendimento.model';

interface ListResponse<T> {
  count?: number;
  results?: T[];
}

interface HorarioApi {
  id?: number;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  disponivel: boolean;
  usuario_id?: number;
  usuario_nome?: string;
  observacao?: string | null;
}

interface AgendamentoApi {
  id?: number;
  horario_id: number;
  estudante_id: number;
  estudante_nome?: string;
  motivo?: string | null;
  status: 'AGENDADO' | 'CANCELADO' | 'REALIZADO';
}

@Injectable({ providedIn: 'root' })
export class AgendaCaeService {
  private readonly apiBaseUrl = 'http://localhost:8000/api';

  constructor(private readonly http: HttpClient) {}

  listarHorarios(): Observable<HorarioAtendimento[]> {
    return this.http.get<unknown>(`${this.apiBaseUrl}/horarios/`).pipe(
      map((response) => this.mapLista(response, (item) => this.mapHorario(item as HorarioApi)))
    );
  }

  buscarHorarioPorId(id: number): Observable<HorarioAtendimento> {
    return this.http.get<HorarioApi>(`${this.apiBaseUrl}/horarios/${id}/`).pipe(
      map((horario) => this.mapHorario(horario))
    );
  }

  criarHorario(horario: Omit<HorarioAtendimento, 'id'>): Observable<HorarioAtendimento> {
    return this.http.post<HorarioApi>(`${this.apiBaseUrl}/horarios/`, this.mapHorarioPayload(horario)).pipe(
      map((response) => this.mapHorario(response))
    );
  }

  atualizarHorario(horario: HorarioAtendimento): Observable<HorarioAtendimento> {
    return this.http.patch<HorarioApi>(`${this.apiBaseUrl}/horarios/${horario.id}/`, this.mapHorarioPayload(horario)).pipe(
      map((response) => this.mapHorario(response))
    );
  }

  removerHorario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/horarios/${id}/`);
  }

  listarAgendamentos(): Observable<AgendamentoEstudante[]> {
    return this.http.get<unknown>(`${this.apiBaseUrl}/agendamentos/`).pipe(
      map((response) => this.mapLista(response, (item) => this.mapAgendamento(item as AgendamentoApi)))
    );
  }

  listarDisponiveis(): Observable<HorarioAtendimento[]> {
    return this.listarHorarios().pipe(
      map((horarios) => horarios.filter((horario) => horario.disponivel))
    );
  }

  private mapHorarioPayload(horario: Partial<HorarioAtendimento>): Record<string, unknown> {
    return {
      data: horario.data,
      hora_inicio: horario.horaInicio,
      hora_fim: horario.horaFim,
      disponivel: horario.disponivel,
      observacao: horario.observacao ?? '',
    };
  }

  private mapHorario(horario: HorarioApi): HorarioAtendimento {
    return {
      id: horario.id ?? 0,
      data: horario.data,
      horaInicio: horario.hora_inicio?.slice(0, 5) ?? '',
      horaFim: horario.hora_fim?.slice(0, 5) ?? '',
      disponivel: horario.disponivel,
      criadoPor: horario.usuario_nome ?? '',
      observacao: horario.observacao ?? undefined,
    };
  }

  private mapAgendamento(agendamento: AgendamentoApi): AgendamentoEstudante {
    return {
      id: agendamento.id ?? 0,
      horarioId: agendamento.horario_id,
      estudanteNome: agendamento.estudante_nome ?? '',
      estudanteId: agendamento.estudante_id,
      motivo: agendamento.motivo ?? undefined,
      status: agendamento.status,
    };
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
