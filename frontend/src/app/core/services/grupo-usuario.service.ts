import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GrupoUsuario } from '../models/grupo-usuario.model';
// GrupoUsuarioService: simula CRUD de grupos de usuário em memória
@Injectable({ providedIn: 'root' })
export class GrupoUsuarioService {
// lista mock de grupos
  private mockGrupos: GrupoUsuario[] = [
    { id: 1, nome: 'Administrador' },
    { id: 2, nome: 'Aluno' }
  ];

  listarTodos(): Observable<GrupoUsuario[]> {
    return of(this.mockGrupos); // retorna todos os grupos
  }
// busca grupo por id
  buscarPorId(id: number): GrupoUsuario {
    return this.mockGrupos.find(g => g.id === id)!;
  }
// cria um grupo novo
  criar(payload: GrupoUsuario): Observable<GrupoUsuario> {
    const novo = { id: Date.now(), ...payload };
    this.mockGrupos.push(novo);
    return of(novo);
  }
// atualiza o grupo existente
  atualizar(id: number, payload: GrupoUsuario): Observable<GrupoUsuario> {
    const index = this.mockGrupos.findIndex(g => g.id === id);
    this.mockGrupos[index] = { ...this.mockGrupos[index], ...payload };
    return of(this.mockGrupos[index]);
  }
}
