import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { CreateUsuarioPayload, Usuario } from '../models/usuario.model';

/**
 * Serviço responsável pelas operações CRUD de Usuario.
 * Atualmente usa dados mockados. Para integrar com API real.
 */
@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
// Simula o banco de dados em memória
  private mockUsuarios: Usuario[] = [
    {
      id: 1,
      nome: 'admin',
      grupoUsuarioId: 1,
      horaCriado: new Date(),
      mudaSenha: false,
      status: 'ATIVO',
    },
  ];

  private nextId = 2;
// Cria um novo usuário com base no payload fornecido
  criar(payload: CreateUsuarioPayload): Observable<Usuario> {
    // Simula erro se o nome já existir (validação de negócio mock)
    const nomeExistente = this.mockUsuarios.some(
      u => u.nome.toLowerCase() === payload.nome.toLowerCase()
    );

    if (nomeExistente) {
      return throwError(() => new Error('Nome de usuário já está em uso.'));
    }

    const novoUsuario: Usuario = {
      id: this.nextId++,
      nome: payload.nome,
      grupoUsuarioId: payload.grupoUsuarioId,
      mudaSenha: payload.mudaSenha,
      status: payload.status,
      horaCriado: new Date(),
      dataBloqueio: null,
      motivoBloqueio: null,
    };

    this.mockUsuarios.push(novoUsuario);

    return of(novoUsuario);
  }
// Retorna a lista de todos os usuários
  listarTodos(): Observable<Usuario[]> {
    return of([...this.mockUsuarios]);
  }
}
