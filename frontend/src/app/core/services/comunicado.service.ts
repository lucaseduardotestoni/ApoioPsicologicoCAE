import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Comunicado, CreateComunicadoPayload } from '../models/comunicado.model';
// ComunicadoService: simula um CRUD de comunicados usando lista em memória (mock)
@Injectable({ providedIn: 'root' })
export class ComunicadoService {

  private mockComunicados: Comunicado[] = []; // "banco fake" em memória

  listarTodos(): Observable<Comunicado[]> {
    return of(this.mockComunicados); // retorna todos os comunicados
  }

  // busca por id, retorna um comunicado específico
  getById(id: number): Observable<Comunicado> {
    const comunicado = this.mockComunicados.find(c => c.id === id)!;
    return of(comunicado);
  } 
  // cria novo comunicado com base no payload
  create(payload: CreateComunicadoPayload): Observable<Comunicado> {
    const novo: Comunicado = {
      id: Date.now(),
      titulo: payload.titulo,
      mensagem: payload.mensagem,
      ativo: payload.ativo,
      grupos: payload.grupoIds.map(id => ({ id }))
    };
    this.mockComunicados.push(novo);
    return of(novo);
  }
  // atualiza um comunicado existente
  update(id: number, payload: CreateComunicadoPayload): Observable<Comunicado> {
    const index = this.mockComunicados.findIndex(c => c.id === id);

    const atualizado: Comunicado = {
      ...this.mockComunicados[index],
      titulo: payload.titulo,
      mensagem: payload.mensagem,
      ativo: payload.ativo,
      grupos: payload.grupoIds.map(id => ({ id }))
    };

    this.mockComunicados[index] = atualizado;
    return of(atualizado);
  }
  // alterna o status ativo/inativo
  toggleAtivo(id: number): Observable<void> {
    const c = this.mockComunicados.find(c => c.id === id);
    if (c) c.ativo = !c.ativo;
    return of(void 0);
  }
}