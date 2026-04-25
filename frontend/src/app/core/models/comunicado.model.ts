export interface Comunicado {
  id?: number;
  titulo: string;
  mensagem: string;
  dataEnvio?: Date;
  criadoPor?: number;
  ativo: boolean;
  grupos?: ComunicadoGrupo[];
}

// ComunicadoGrupo: representa os grupos que recebem o comunicado
export interface ComunicadoGrupo {
  id: number;
  nome?: string;
}

// CreateComunicadoPayload: dados usados para criar um comunicado (envio para API)
export interface CreateComunicadoPayload {
  titulo: string;
  mensagem: string;
  ativo: boolean;
  grupoIds: number[];
}

// ComunicadoDetalhado: comunicado com informações adicionais
export interface ComunicadoDetalhado extends Comunicado {
  criadoPorNome?: string;
}