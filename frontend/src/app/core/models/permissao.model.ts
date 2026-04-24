export interface Permissao {
  id: number;
  nome: string;
  nivelPermissaoPadrao: number; // ID do nível padrão sugerido (1: Sem Acesso, 2: Leitura, 3: Escrita)
}
