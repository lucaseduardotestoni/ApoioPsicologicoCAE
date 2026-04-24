// GrupoPermissao: vínculo entre grupo, permissão e nível de acesso
export interface GrupoPermissao {
  grupoUsuarioId: number;
  permissaoId: number;
  nivelPermissaoId: number | null;
}

/**
 * Representa o estado de uma permissão na tabela da UI.
 * Combina Permissao + nível selecionado atual.
 */
export interface PermissaoRow {
  permissaoId: number;
  nome: string;
  nivelPermissaoIdSelecionado: number | null;
}
