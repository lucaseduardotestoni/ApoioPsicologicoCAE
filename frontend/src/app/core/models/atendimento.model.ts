export interface HorarioAtendimento {
  id: number;
  data: string; // ISO string
  horaInicio: string;
  horaFim: string;
  disponivel: boolean;
  criadoPor: string; // funcionário CAE
  observacao?: string;
}

export interface AgendamentoEstudante {
  id: number;
  horarioId: number;
  estudanteNome: string;
  estudanteId: number;
  motivo?: string;
  status: 'AGENDADO' | 'CANCELADO' | 'REALIZADO';
}

// ─── Registro de Atendimento ───────────────────────────────────────────────

export type TipoAtendimento =
  | 'PSICOLOGICO'
  | 'SOCIAL'
  | 'PEDAGOGICO'
  | 'ORIENTACAO'
  | 'OUTRO';

export interface RegistroAtendimento {
  id: number;
  estudanteId: number;
  estudanteNome: string;
  data: string;           // ISO date string (YYYY-MM-DD)
  tipo: TipoAtendimento;
  descricao: string;
  responsavel: string;
  observacoes?: string;
  criadoEm?: Date;
}

export interface CreateAtendimentoPayload {
  estudanteId: number;
  estudanteNome: string;
  data: string;
  tipo: TipoAtendimento;
  descricao: string;
  responsavel: string;
  observacoes?: string;
}

// ─── Estudante (mock) ──────────────────────────────────────────────────────

export interface Estudante {
  id: number;
  nome: string;
  matricula: string;
  curso?: string;
  email?: string;
}
