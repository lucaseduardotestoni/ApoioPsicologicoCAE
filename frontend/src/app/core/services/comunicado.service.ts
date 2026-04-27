import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { Comunicado, ComunicadoGrupo, CreateComunicadoPayload } from '../models/comunicado.model';

interface ListResponse<T> {
  count?: number;
  results?: T[];
}

interface ComunicadoGrupoApi {
  id: number;
  nome?: string;
}

interface ComunicadoApi {
  id?: number;
  titulo: string;
  mensagem: string;
  data_em?: string;
  usuario_id?: number;
  ativo: boolean;
  grupos?: ComunicadoGrupoApi[];
}

@Injectable({ providedIn: 'root' })
export class ComunicadoService {
  private readonly apiBaseUrl = 'http://localhost:8000/api';

  constructor(private readonly http: HttpClient) {}

  listarTodos(): Observable<Comunicado[]> {
    return this.http.get<unknown>(`${this.apiBaseUrl}/comunicados/`).pipe(
      map((response) => this.mapLista(response))
    );
  }

  getById(id: number): Observable<Comunicado> {
    return this.http.get<ComunicadoApi>(`${this.apiBaseUrl}/comunicados/${id}/`).pipe(
      map((comunicado) => this.mapApiParaModel(comunicado))
    );
  }

  create(payload: CreateComunicadoPayload): Observable<Comunicado> {
    return this.http.post<ComunicadoApi>(`${this.apiBaseUrl}/comunicados/`, this.mapPayloadParaApi(payload)).pipe(
      map((comunicado) => this.mapApiParaModel(comunicado))
    );
  }

  update(id: number, payload: CreateComunicadoPayload): Observable<Comunicado> {
    return this.http.patch<ComunicadoApi>(`${this.apiBaseUrl}/comunicados/${id}/`, this.mapPayloadParaApi(payload)).pipe(
      map((comunicado) => this.mapApiParaModel(comunicado))
    );
  }

  toggleAtivo(id: number): Observable<void> {
    return this.getById(id).pipe(
      switchMap((comunicado) =>
        this.http.patch(`${this.apiBaseUrl}/comunicados/${id}/`, {
          ativo: !comunicado.ativo,
        })
      ),
      map(() => void 0)
    );
  }

  private mapPayloadParaApi(payload: CreateComunicadoPayload): Record<string, unknown> {
    return {
      titulo: payload.titulo.trim(),
      mensagem: payload.mensagem.trim(),
      ativo: payload.ativo,
      grupo_ids: payload.grupoIds,
    };
  }

  private mapLista(response: unknown): Comunicado[] {
    const listaApi = this.isListResponse<ComunicadoApi>(response)
      ? (response.results ?? [])
      : Array.isArray(response)
        ? (response as ComunicadoApi[])
        : [];

    return listaApi.map((comunicado) => this.mapApiParaModel(comunicado));
  }

  private mapApiParaModel(comunicado: ComunicadoApi): Comunicado {
    return {
      id: comunicado.id,
      titulo: comunicado.titulo,
      mensagem: comunicado.mensagem,
      dataEnvio: comunicado.data_em ? new Date(comunicado.data_em) : undefined,
      criadoPor: comunicado.usuario_id,
      ativo: comunicado.ativo,
      grupos: (comunicado.grupos ?? []).map((grupo) => this.mapGrupo(grupo)),
    };
  }

  private mapGrupo(grupo: ComunicadoGrupoApi): ComunicadoGrupo {
    return {
      id: grupo.id,
      nome: grupo.nome,
    };
  }

  private isListResponse<T>(value: unknown): value is ListResponse<T> {
    if (!value || typeof value !== 'object') return false;
    return 'results' in value || 'count' in value;
  }
}
