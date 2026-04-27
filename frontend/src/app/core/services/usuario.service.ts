import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CreateUsuarioPayload, UpdateUsuarioPayload, Usuario } from '../models/usuario.model';

interface ListResponse<T> {
  count?: number;
  results?: T[];
}

interface UsuarioApi {
  id?: number;
  nome: string;
  senha_hash?: string;
  grupo_usuario_id: number;
  hora_criado?: string;
  mudou_senha?: boolean | string;
  status: string;
  data_bloqueio?: string | null;
  motivo_bloqueio?: string | null;
}

/**
 * Serviço responsável pelas operações CRUD de Usuario.
 * Atualmente usa dados mockados. Para integrar com API real.
 */
@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly apiBaseUrl = 'http://localhost:8000/api';

  constructor(private readonly http: HttpClient) {}

  // cria um novo usuário no backend e devolve o usuário salvo
  criar(payload: CreateUsuarioPayload): Observable<Usuario> {
    const body = {
      nome: payload.nome,
      senha_hash: payload.senha,
      grupo_usuario_id: payload.grupoUsuarioId,
      mudou_senha: payload.mudaSenha,
      status: payload.status,
      data_bloqueio: null,
      motivo_bloqueio: null,
    };

    return this.http.post<UsuarioApi>(`${this.apiBaseUrl}/usuarios/`, body).pipe(
      map((usuario) => this.mapApiParaUsuario(usuario))
    );
  }

  // busca um usuário específico pelo id
  buscarPorId(id: number): Observable<Usuario> {
    return this.http.get<UsuarioApi>(`${this.apiBaseUrl}/usuarios/${id}/`).pipe(
      map((usuario) => this.mapApiParaUsuario(usuario))
    );
  }

  // atualiza um usuário existente no backend
  atualizar(id: number, payload: UpdateUsuarioPayload): Observable<Usuario> {
    const body: Record<string, unknown> = {
      nome: payload.nome,
      grupo_usuario_id: payload.grupoUsuarioId,
      mudou_senha: payload.mudaSenha,
      status: payload.status,
      data_bloqueio: null,
      motivo_bloqueio: null,
    };

    if (payload.senha?.trim()) {
      body['senha_hash'] = payload.senha;
    }

    return this.http.patch<UsuarioApi>(`${this.apiBaseUrl}/usuarios/${id}/`, body).pipe(
      map((usuario) => this.mapApiParaUsuario(usuario))
    );
  }

  // retorna a lista de todos os usuários
  listarTodos(): Observable<Usuario[]> {
    return this.http.get<unknown>(`${this.apiBaseUrl}/usuarios/`).pipe(
      map((response) => {
        const listaApi = this.isListResponse<UsuarioApi>(response)
          ? (response.results ?? [])
          : Array.isArray(response)
            ? (response as UsuarioApi[])
            : [];

        return listaApi.map((usuario) => this.mapApiParaUsuario(usuario));
      })
    );
  }

  // converte o payload da API para o modelo do frontend
  private mapApiParaUsuario(usuarioApi: UsuarioApi): Usuario {
    const statusNormalizado = String(usuarioApi.status).toUpperCase() as 'ATIVO' | 'INATIVO';

    return {
      id: usuarioApi.id,
      nome: usuarioApi.nome,
      grupoUsuarioId: usuarioApi.grupo_usuario_id,
      horaCriado: usuarioApi.hora_criado ? new Date(usuarioApi.hora_criado) : undefined,
      mudaSenha: this.normalizarBooleano(usuarioApi.mudou_senha),
      status: statusNormalizado,
      dataBloqueio: usuarioApi.data_bloqueio ? new Date(usuarioApi.data_bloqueio) : null,
      motivoBloqueio: usuarioApi.motivo_bloqueio ?? null,
    };
  }

  // converte valores do backend para booleano real
  private normalizarBooleano(valor: boolean | string | undefined): boolean {
    if (typeof valor === 'boolean') return valor;
    if (typeof valor === 'string') {
      return valor.toLowerCase() === 'true' || valor === '1';
    }
    return false;
  }

  // valida se a resposta segue o padrão paginado do DRF
  private isListResponse<T>(value: unknown): value is ListResponse<T> {
    if (!value || typeof value !== 'object') return false;
    return 'results' in value || 'count' in value;
  }
}
