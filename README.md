# ConectaCAE

Sistema acadêmico voltado ao apoio psicológico e à organização de atendimentos no CAE. O projeto está dividido em um backend em Django REST Framework e um frontend em Angular, com foco em cadastro de usuários, controle de grupos e permissões, agenda de horários, registro de atendimentos e publicação de comunicados.

---

## Visão Geral

De forma geral, a aplicação reúne funcionalidades para:

- cadastrar e manter usuários internos do sistema;
- organizar grupos de usuários e níveis de permissão;
- registrar estudantes atendidos;
- disponibilizar horários e agendamentos de atendimento;
- registrar prontuários e históricos de atendimento;
- publicar comunicados para grupos específicos;
- consolidar informações resumidas no dashboard.

A proposta do projeto é centralizar rotinas administrativas e de acompanhamento em uma única interface web.

---

## Estrutura do Projeto

```txt
TCC-ApoioPsicologicoCAE/
├── backend/      API em Django + Django REST Framework
├── frontend/     Aplicação web em Angular
├── .github/      Workflows do GitHub Actions
├── README.md
```

---

## Backend

O backend expõe endpoints REST sob o prefixo `/api/` e está organizado por domínios:

- `usuarios` → gestão de usuários e grupos;
- `permissoes` → controle de permissões e níveis de acesso;
- `estudantes` → cadastro básico de estudantes;
- `agenda` → horários disponíveis e agendamentos;
- `atendimentos` → registros e prontuários de atendimento;
- `comunicados` → avisos internos vinculados a grupos;
- `auditoria` → rastreio de ações realizadas.

---

## Tecnologias Utilizadas

### Backend

- Python
- Django REST Framework
- JWT Authentication
- PostgreSQL
- Django CORS Headers

### Frontend

- Angular 21
- Angular Material
- TypeScript
- RxJS

---

## Pré-requisitos

Antes de executar o projeto, tenha instalado:

- Python 3.13 ou superior
- Node.js 20 ou superior
- npm
- PostgreSQL

---

# Como Rodar o Backend

## 1. Acesse a pasta do backend

```bash
cd backend
```

## 2. Crie e ative o ambiente virtual

### Windows

```bash
python -m venv .venv
.\.venv\Scripts\Activate.bat
```

---

## 3. Instale as dependências

```bash
pip install -r requirements.txt
```

---

## 4. Configure o banco PostgreSQL

Nas configurações atuais do projeto, o backend espera um banco com os seguintes dados:

```txt
Banco: conectacae
Usuário: postgres
Senha: 123
Host: localhost
Porta: 5432
```

Caso utilize outras credenciais, ajuste o arquivo:

```txt
backend/conectacae/settings.py
```

---

## 5. Execute as migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## 6. Inicie o servidor

```bash
python manage.py runserver
```

O backend ficará disponível em:

```txt
http://localhost:8000/
```

A API estará disponível em:

```txt
http://localhost:8000/api/
```

---

# Como Rodar o Frontend

## 1. Acesse a pasta do frontend

```bash
cd frontend
```

---

## 2. Instale as dependências

```bash
npm install
```

---

## 3. Inicie o servidor Angular

```bash
npm start
```

O frontend ficará disponível em:

```txt
http://localhost:4200/
```

---

## Pipeline CI/CD

O projeto utiliza GitHub Actions para automação de integração contínua (CI/CD).

O pipeline realiza automaticamente:

- instalação de dependências;
- validação do backend Django;
- verificação de migrations pendentes;
- execução de testes automatizados;
- integração com PostgreSQL em container Docker;
- validação de build da aplicação.

As credenciais utilizadas no pipeline são armazenadas de forma segura utilizando GitHub Secrets.

---

## Estratégia de Branches

O projeto utiliza organização de branches baseada em separação entre desenvolvimento e produção.

### Branches utilizadas

- `main` → versão estável do sistema;
- `develop` → integração de funcionalidades em desenvolvimento;
- `feature/*` → desenvolvimento isolado de novas funcionalidades.

---

## Integrantes

- Eduardo Zirbell
- Guilherme Kuhnen
- Kamilly Birkner
- Kauana Correia
- Lucas Eduardo

---

## GitHub Actions

Os workflows da aplicação estão localizados em:

```txt
.github/workflows/
```

Atualmente o projeto possui pipeline automatizado para validação do backend Python/Django.

---

## Observações

- O projeto utiliza PostgreSQL como banco principal.
- O backend utiliza autenticação JWT.
- O frontend consome a API REST disponibilizada pelo backend.
- O pipeline falha automaticamente caso testes ou validações apresentem erro.
