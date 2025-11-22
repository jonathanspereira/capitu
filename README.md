# 📚 Capitu - API RESTful

Uma API para gerenciamento de biblioteca pessoal com recomendações inteligentes baseadas em IA.

## 🎯 Objetivo

A **Capitu API** foi desenvolvida para proporcionar uma experiência de gerenciamento de biblioteca pessoal, permitindo que usuários organizem seus livros, marquem favoritos, acompanhem o progresso de leitura (livros que o usuario está "LENDO" ou que já foram "LIDOS") e recebam recomendações personalizadas através de inteligência artificial.

### ✨ Principais Funcionalidades

- 🔐 **Autenticação completa** com JWT e recuperação de senha
- 👤 **Gerenciamento de perfil** do usuário
- 📖 **Biblioteca pessoal** com status de leitura (Lendo ou LIDO)
- ⭐ **Sistema de favoritos** para livros preferidos
- 🔍 **Busca de livros** integrada com Google Books API
- 🤖 **Recomendações personalizadas** usando IA (Groq)
- 📧 **Notificações por email** para recuperação de senha

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js**
- **TypeScript**
- **Express.js**
- **Prisma**
- **PostgreSQL**

### Autenticação & Segurança
- **JWT** - Tokens de autenticação
- **bcrypt** - Hash de senhas
- **CORS** - Controle de acesso cross-origin

### Integrações Externas
- **Groq AI** - Recomendações inteligentes
- **Google Books API** - Busca de livros
- **Resend** - Envio de emails transacionais

### Documentação & Testes
- **Swagger UI** - Documentação interativa da API
- **Vitest** - Framework de testes unitários
- **Supertest** - Testes de API

### DevOps & Qualidade
- **Docker** - Containerização
- **SonarQube** - Análise de qualidade de código
- **ESLint/Prettier** - Linting e formatação

## 📋 Endpoints da API

### 🔐 Autenticação
```
POST   /v1/api/auth/register           # Registrar novo usuário
```
```
POST   /v1/api/auth/login              # Fazer login
```
```
POST   /v1/api/auth/forgot-password    # Solicitar reset de senha
```
```
POST   /v1/api/auth/verify-reset-token # Verificar token de reset
```
```
POST   /v1/api/auth/reset-password     # Redefinir senha
```
```
DELETE /v1/api/auth/delete-account     # Deletar conta
```

### 👤 Usuário
```
GET    /v1/api/user/profile            # Obter perfil do usuário
```

### 📚 Livros
```
GET    /v1/api/books/search            # Buscar livros
```
```
POST   /v1/api/books                   # Adicionar livro à biblioteca
```
```
PATCH  /v1/api/books/status            # Atualizar status de leitura
```
```
PATCH  /v1/api/books/favorite          # Marcar/desmarcar favorito
```
```
DELETE /v1/api/books/remove            # Remover livro da biblioteca
```
```
GET    /v1/api/books/user/{userId}     # Listar livros do usuário
```

### ⭐ Favoritos
```
GET    /v1/api/favorites/{userId}                    # Listar favoritos
```
```
POST   /v1/api/favorites/{userId}                    # Adicionar aos favoritos
```
```
DELETE /v1/api/favorites/{userId}/{favoriteId}      # Remover favorito
```
```
POST   /v1/api/favorites/{userId}/check              # Verificar se é favorito
```
```
DELETE /v1/api/favorites/{userId}/by-google-id      # Remover por Google ID
```

### 🎯 Recomendações
```
GET    /v1/api/recommendations/user/{userId}        # Obter recomendações
```

## 🚀 Como Usar Localmente

### Pré-requisitos
- Node.js (v18 ou superior)
- PostgreSQL
- npm

### 1. Clone o Repositório
```bash
git clone https://github.com/jonathanspereira/capitu.git
cd capitu
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/capitu_db"
DIRECT_URL="postgresql://username:password@localhost:5432/capitu_db"

# JWT
JWT_SECRET="seu_jwt_secret_aqui"

# Email (Resend)
RESEND_API_KEY="sua_api_key_do_resend"

# IA (Groq)
GROQ_API_KEY="sua_api_key_do_groq"

# Google Books API
GOOGLE_BOOKS_API_KEY="sua_api_key_do_google_books"

# Server
PORT=8080
NODE_ENV=development

# SonarQube (opcional)
SONAR_TOKEN="seu_token_sonarqube"
```

### 4. Configure o Banco de Dados
```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrations
npx prisma migrate dev
```

### 5. Execute a Aplicação

#### Modo Desenvolvimento
```bash
npm run dev
```

#### Modo Produção
```bash
npm run build
npm start
```

### 6. Acesse a Documentação
Após iniciar o servidor, acesse:
- **API**: http://localhost:8080
- **Swagger Docs**: http://localhost:8080/docs

## 📊 Testes

```bash
# Executar testes
npm test

# Executar com coverage
npm run coverage
```

## 📝 Documentação

A documentação completa da API está disponível via Swagger UI em `/docs` quando o servidor está em execução.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou envie um pull request.

---

**Desenvolvido com ❤️ por [Jonathan Pereira](https://github.com/jonathanspereira)**

