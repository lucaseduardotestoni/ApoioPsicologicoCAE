import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import {
  CreateAtendimentoPayload,
  Estudante,
  RegistroAtendimento,
} from '../models/atendimento.model';

/**
 * AtendimentoService — CRUD de registros de atendimento e lista de estudantes.
 * Dados persistidos em memória (mock). Substituir por HttpClient na integração real.
 */
@Injectable({ providedIn: 'root' })
export class AtendimentoService {
  private nextId = 4;

  private mockEstudantes: Estudante[] = [
    { id: 1, nome: 'Ana Paula Souza',    matricula: '2021001', curso: 'Sistemas de Informação', email: 'ana@furb.br' },
    { id: 2, nome: 'Carlos Eduardo Lima', matricula: '2020045', curso: 'Engenharia de Software',  email: 'carlos@furb.br' },
    { id: 3, nome: 'Fernanda Oliveira',   matricula: '2022012', curso: 'Ciência da Computação',   email: 'fernanda@furb.br' },
    { id: 4, nome: 'João Pedro Martins',  matricula: '2019088', curso: 'Sistemas de Informação', email: 'joao@furb.br' },
    { id: 5, nome: 'Mariana Costa',       matricula: '2023003', curso: 'Engenharia de Software',  email: 'mariana@furb.br' },
  ];

  private mockAtendimentos: RegistroAtendimento[] = [
    {
      id: 1,
      estudanteId: 1,
      estudanteNome: 'Ana Paula Souza',
      data: '2025-04-10',
      tipo: 'PSICOLOGICO',
      descricao: 'Sessão inicial de acolhimento. Estudante relatou dificuldades de adaptação ao curso.',
      responsavel: 'Eduardo Zirbell',
      observacoes: 'Retorno agendado para 2 semanas.',
      criadoEm: new Date('2025-04-10'),
    },
    {
      id: 2,
      estudanteId: 1,
      estudanteNome: 'Ana Paula Souza',
      data: '2025-04-24',
      tipo: 'PSICOLOGICO',
      descricao: 'Segunda sessão. Melhora significativa no quadro de ansiedade.',
      responsavel: 'Eduardo Zirbell',
      criadoEm: new Date('2025-04-24'),
    },
    {
      id: 3,
      estudanteId: 2,
      estudanteNome: 'Carlos Eduardo Lima',
      data: '2025-04-15',
      tipo: 'PEDAGOGICO',
      descricao: 'Orientação sobre aproveitamento acadêmico e técnicas de estudo.',
      responsavel: 'Guilherme Kuhnen',
      observacoes: 'Encaminhado para monitoria de Cálculo.',
      criadoEm: new Date('2025-04-15'),
    },
  ];

  // ── Estudantes ────────────────────────────────────────────────────────────

  listarEstudantes(): Observable<Estudante[]> {
    return of([...this.mockEstudantes]);
  }

  buscarEstudantes(termo: string): Observable<Estudante[]> {
    const t = termo.toLowerCase().trim();
    if (!t) return of([...this.mockEstudantes]);
    const resultado = this.mockEstudantes.filter(
      e =>
        e.nome.toLowerCase().includes(t) ||
        e.matricula.toLowerCase().includes(t)
    );
    return of(resultado);
  }

  buscarEstudantePorId(id: number): Observable<Estudante | undefined> {
    return of(this.mockEstudantes.find(e => e.id === id));
  }

  // ── Atendimentos ──────────────────────────────────────────────────────────

  listarTodos(): Observable<RegistroAtendimento[]> {
    return of([...this.mockAtendimentos]);
  }

  listarPorEstudante(estudanteId: number): Observable<RegistroAtendimento[]> {
    return of(
      this.mockAtendimentos
        .filter(a => a.estudanteId === estudanteId)
        .sort((a, b) => b.data.localeCompare(a.data))
    );
  }

  buscarPorId(id: number): Observable<RegistroAtendimento | undefined> {
    return of(this.mockAtendimentos.find(a => a.id === id));
  }

  criar(payload: CreateAtendimentoPayload): Observable<RegistroAtendimento> {
    const novo: RegistroAtendimento = {
      id: this.nextId++,
      ...payload,
      criadoEm: new Date(),
    };
    this.mockAtendimentos.push(novo);
    return of(novo);
  }

  atualizar(
    id: number,
    payload: CreateAtendimentoPayload
  ): Observable<RegistroAtendimento> {
    const idx = this.mockAtendimentos.findIndex(a => a.id === id);
    if (idx === -1) return throwError(() => new Error('Atendimento não encontrado.'));
    this.mockAtendimentos[idx] = { ...this.mockAtendimentos[idx], ...payload };
    return of(this.mockAtendimentos[idx]);
  }

  remover(id: number): Observable<void> {
    this.mockAtendimentos = this.mockAtendimentos.filter(a => a.id !== id);
    return of(void 0);
  }
}
