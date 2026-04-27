# ConectaCAE

Sistema acadêmico voltado ao apoio psicológico e à organização de atendimentos no CAE. O projeto está dividido em um backend em Django/DRF e um frontend em Angular, com foco em cadastro de usuários, controle de grupos e permissões, agenda de horários, registro de atendimentos e publicação de comunicados.

## Vis�o geral

De forma geral, a aplicação reúne funcionalidades para:

- cadastrar e manter usuários internos do sistema;
- organizar grupos de usuários e níveis de permissão;
- registrar estudantes atendidos;
- disponibilizar horários e agendamentos de atendimento;
- registrar prontuários e históricos de atendimento;
- publicar comunicados para grupos específicos;
- consolidar informações resumidas no dashboard.

A proposta do projeto é centralizar rotinas administrativas e de acompanhamento em uma única interface web.

## Estrutura do projeto

```text
TCC-ApoioPsicologicoCAE/
|- backend/    API em Django + Django REST Framework
|- frontend/   Aplica��o web em Angular
|- README.md
```

### Backend

O backend expõe endpoints REST sob o prefixo `/api/` e está organizado por domínios:

- `usuarios`: gestão de usuários e grupos de usuários;
- `permissoes`: controle de permissões e níveis de acesso;
- `estudantes`: cadastro básico de estudantes;
- `agenda`: horários disponíveis e agendamentos;
- `atendimentos`: registros e prontuários de atendimento;
- `comunicados`: avisos internos vinculados a grupos;
- `auditoria`: rastreio de ações realizadas.

## Tecnologias utilizadas

### Backend

- Python
- Django REST Framework
- JWT para autenticação
- PostgreSQL
- CORS Headers

### Frontend

- Angular 21
- Angular Material
- TypeScript
- RxJS

## Pré-requisitos

Antes de rodar o projeto, tenha instalado:

- Python 3.13.13 ou compatável
- Node.js 20 ou superior
- npm
- PostgreSQL

## Como rodar o backend

### 1. Acesse a pasta do backend

```cmd
cd backend
```

### 2. Crie e ative um ambiente virtual

```cmd
python -m venv .venv
.\.venv\Scripts\Activate.bat
```

### 3. Instale as depend�ncias

```cmd
pip install -r requirements.txt
```

### 4. Crie o banco no PostgreSQL

Nas configurações atuais do projeto, o backend espera um banco com estes dados:

- Banco: `conectacae`
- Usuário: `postgres`
- Senha: `123`
- Host: `localhost`
- Porta: `5432`

Se preferir usar outro usuário, senha ou nome de banco, ajuste o arquivo `backend/conectacae/settings.py`.

### 5. Execute as migrations

```cmd
python manage.py makemigrations
python manage.py migrate
```

### 6. Inicie o servidor

```cmd
python manage.py runserver
```

O backend ficará disponível em:

```text
http://localhost:8000/
```

E a API estar� em:

```text
http://localhost:8000/api/
```

## Como rodar o frontend

### 1. Em outro terminal, acesse a pasta do frontend

```cmd
cd frontend
```

### 2. Instale as depend�ncias

```cmd
npm install
```

### 3. Inicie o servidor de desenvolvimento

```cmd
npm start
```

O frontend ficará disponível em:

```text
http://localhost:4200/
```