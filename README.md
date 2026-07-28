# ChurchHub

Sistema de gestão administrativa para igrejas. Dashboard em tempo real, cadastro de membros, controle de visitantes e eventos.

## Funcionalidades

### Autenticação
- Login com email e senha
- Cadastro de nova conta (cria igreja + usuário admin automaticamente)
- Sessão via JWT com duração de 30 dias

### Dashboard
- Cards com estatísticas: total de membros, visitantes, eventos
- Crescimento de membros nos últimos 6 meses (gráfico de barras)
- Aniversariantes do mês
- Próximos eventos
- Notificações no header: aniversariantes do dia e eventos nos próximos 7 dias

### Membros
- CRUD completo (criar, editar, excluir)
- Modal de detalhes ao clicar na linha da tabela
- Busca por nome ou email
- Paginação (10 por página)
- Endereço com busca automática por CEP (ViaCEP)
- Vínculos familiares entre membros (cônjuge, pai/mãe, filho(a), irmão(ã))
- Propagação automática de vínculos através do cônjuge

### Visitantes
- CRUD completo
- Modal de detalhes ao clicar na linha
- Endereço com busca automática por CEP (ViaCEP)
- Controle de primeira visita e quem convidou

### Eventos
- CRUD completo
- Modal de detalhes ao clicar na linha
- Validação de data (não permite eventos no passado)

### Interface
- Tema claro/escuro com botão de alternância
- Sidebar responsiva (recolhe em mobile)
- Breadcrumb de navegação
- Modal com scroll em telas pequenas

### Banco de Dados
- PostgreSQL com Prisma ORM 7
- Migrations versionadas
- Seed com dados de exemplo

## Pré-requisitos

- Node.js 20+
- PostgreSQL 15+
- NPM ou Yarn

## Como rodar

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/churchhub.git
cd churchhub

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações:
#   DATABASE_URL: string de conexão do PostgreSQL
#   AUTH_SECRET: gere um secret aleatório (ex: openssl rand -base64 32)
#   AUTH_URL: URL da aplicação (http://localhost:3000)

# 4. Execute as migrações do banco
npm run db:migrate

# 5. (Opcional) Popule com dados de exemplo
npm run db:seed

# 6. Inicie o servidor de desenvolvimento
npm run dev

# 7. Acesse http://localhost:3000
```

### Seed (dados de exemplo)

```bash
npm run db:seed
```

Cria:
- Igreja: "Igreja Batista Testemunho"
- Admin: admin@churchhub.com / admin123
- 8 membros, 5 eventos, 3 visitantes

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run db:migrate` | Executa migrations do Prisma |
| `npm run db:seed` | Popula banco com dados de exemplo |
| `npm run db:generate` | Gera o Prisma Client |

## Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Lucide React, Recharts
- **Backend:** Next.js Server Actions, Prisma 7 ORM
- **Autenticação:** NextAuth v5 com JWT
- **Banco:** PostgreSQL
- **UI:** Componentes próprios (Modal, Table, Button, Input, Select, Badge, etc.)

## Estrutura

```
src/
  actions/        # Server Actions (camada de API)
  app/            # Páginas (App Router)
    (dashboard)/  # Layout autenticado (sidebar + header)
    login/        # Página de login
    register/     # Página de cadastro
    api/          # Rotas de API (NextAuth)
  components/
    ui/           # Componentes de UI reutilizáveis
    layout/       # Sidebar, Header
  lib/            # Configurações (auth, prisma)
  repositories/   # Acesso a dados (Prisma queries)
  services/       # Lógica de negócio
  types/          # Tipos TypeScript
prisma/
  schema.prisma   # Schema do banco
  seed.ts         # Dados de exemplo
  migrations/     # Migrations versionadas
```
