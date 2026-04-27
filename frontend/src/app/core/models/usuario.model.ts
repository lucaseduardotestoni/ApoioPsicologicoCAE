/**
 * Interface que representa a entidade Usuario do banco de dados.
 * Campos opcionais são aqueles gerados pelo backend ou preenchidos após criação.
 */
export interface Usuario {
  id?: number;
  nome: string;
  senhaHash?: string;          
  grupoUsuarioId: number;
  horaCriado?: Date;           
  mudaSenha: boolean;          
  status: UsuarioStatus;
  dataBloqueio?: Date | null;
  motivoBloqueio?: string | null;
}

/**
 * Status possíveis de um usuário no sistema.
 */
export type UsuarioStatus = 'ATIVO' | 'INATIVO';

/**
 * Dados do formulário de usuário, usados tanto para criação quanto edição.
 * A senha é opcional no modo edição.
 */
export interface UsuarioFormPayload {
  nome: string;
  senha?: string;
  grupoUsuarioId: number;
  mudaSenha: boolean;
  status: UsuarioStatus;
}

/**
 * Payload enviado ao backend para criação de usuário.
 * A senha é enviada em texto puro e o backend realiza o hash.
 */
export interface CreateUsuarioPayload extends UsuarioFormPayload {
  senha: string;
}

/**
 * Payload usado na atualização de usuário.
 */
export interface UpdateUsuarioPayload extends UsuarioFormPayload {
  senha?: string;
}
