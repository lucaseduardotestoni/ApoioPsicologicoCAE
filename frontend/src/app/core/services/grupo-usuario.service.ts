import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { GrupoUsuario } from '../models/grupo-usuario.model';

interface ListResponse<T> {
  count?: number;
  results?: T[];
}

interface GrupoUsuarioApi {
  id?: number;
  nome: string;
}

/**
 * GrupoUsuarioService — CRUD de grupos de usuário via API.
 */
@Injectable({ providedIn: 'root' })
export class GrupoUsuarioService {
  private readonly apiBaseUrl = 'http://localhost:8000/api';

  constructor(private readonly http: HttpClient) {}

  // lista os grupos cadastrados no backend
  listarTodos(): Observable<GrupoUsuario[]> {
    return this.http.get<unknown>(`${this.apiBaseUrl}/gruposusuarios/`).pipe(
      map((response) => this.mapListaParaGrupo(response))
    );
  }

  // busca um grupo específico pelo id
  buscarPorId(id: number): Observable<GrupoUsuario> {
    return this.http.get<unknown>(`${this.apiBaseUrl}/gruposusuarios/${id}/`).pipe(
      map((response) => this.mapApiParaGrupo(this.normalizarGrupoApi(response)))
    );
  }

  // cria um novo grupo no backend
  criar(grupo: GrupoUsuario): Observable<GrupoUsuario> {
    const nome = grupo.nome.trim();

    return this.http.post<unknown>(`${this.apiBaseUrl}/gruposusuarios/`, {
      nome,
    }).pipe(
      map((response) => this.mapApiParaGrupo(this.normalizarGrupoApi(response)))
    );
  }

  // atualiza um grupo existente no backend
  atualizar(id: number, grupo: GrupoUsuario): Observable<GrupoUsuario> {
    const nome = grupo.nome.trim();

    return this.http.patch<unknown>(`${this.apiBaseUrl}/gruposusuarios/${id}/`, {
      nome,
    }).pipe(
      map((response) => this.mapApiParaGrupo(this.normalizarGrupoApi(response)))
    );
  }

  // converte um grupo da API para o modelo do frontend
  private mapApiParaGrupo(grupoApi: GrupoUsuarioApi): GrupoUsuario {
    return {
      id: grupoApi.id,
      nome: grupoApi.nome,
    };
  }

  // converte uma resposta de lista da API para a coleção do frontend
  private mapListaParaGrupo(response: unknown): GrupoUsuario[] {
    const listaApi = this.isListResponse<GrupoUsuarioApi>(response)
      ? (response.results ?? [])
      : Array.isArray(response)
        ? (response as GrupoUsuarioApi[])
        : [];

    return listaApi.map((grupo) => this.mapApiParaGrupo(grupo));
  }

  // normaliza a resposta de detalhe para o formato esperado pelo mapper
  private normalizarGrupoApi(response: unknown): GrupoUsuarioApi {
    if (!response || typeof response !== 'object') {
      return { nome: '' };
    }

    const grupo = response as Partial<GrupoUsuarioApi>;
    return {
      id: grupo.id,
      nome: grupo.nome ?? '',
    };
  }

  // valida se a resposta segue o padrão paginado do DRF
  private isListResponse<T>(value: unknown): value is ListResponse<T> {
    if (!value || typeof value !== 'object') return false;
    return 'results' in value || 'count' in value;
  }
}
