# Elaine Confeitaria Backend

API da primeira versão da Elaine Confeitaria, com foco em dois fluxos principais:

- autenticação por login com JWT
- criação e gestão de pedidos do cliente autenticado

Os demais recursos de catálogo ficam expostos apenas para leitura e são abastecidos diretamente no banco.

## Modo Atual

Neste momento a API roda inteiramente em memória com dados fake, sem dependência de banco.

- dados seedados em `src/data/inMemoryStore.js`
- usuário padrão:
  - email: `cliente@elaine.com`
  - senha: `123456`

## Arquitetura

A aplicação segue uma arquitetura em camadas:

- `src/routes`: definição HTTP e composição dos endpoints
- `src/controllers`: adaptação entre HTTP e regras de negócio
- `src/services`: regras de negócio e orquestração
- `src/repositories`: acesso a dados e consultas Prisma
- `src/validators`: validação e normalização de payloads
- `src/middlewares`: autenticação, logging e tratamento de erro
- `src/errors`: erros HTTP padronizados

Detalhes:

## Objetivo

A V1 atende o fluxo mínimo de venda:

- autenticação do cliente
- consulta de catálogo
- CRUD de pedidos do usuário autenticado

## Camadas

### Routes

Recebem as requisições HTTP e conectam controllers aos endpoints.

### Controllers

Traduzem a requisição HTTP para chamadas de serviço e convertem erros em respostas via middleware global.

### Validators

Centralizam validação e normalização dos payloads. Isso reduz lógica repetida nos controllers.

### Services

Implementam regra de negócio. Na V1, os pontos mais importantes são:

- login e emissão de JWT
- preço do pedido calculado a partir da tabela de preços ativa
- pedidos isolados por usuário autenticado

### Repositories

Fazem o acesso a dados via Prisma. A separação facilita testes unitários e testes de sistema com repositórios em memória.

## Decisões da V1

- catálogos são somente leitura via API
- o preço do item do pedido não é aceito do cliente; é resolvido pela tabela de preços ativa
- o usuário só enxerga e altera os próprios pedidos
- itens de pedido deixam de ser um recurso HTTP independente para a V1

## Estratégia de testes

### Unit

Validação, utilitários e regras de negócio isoladas.

### Integration

Rotas HTTP com middleware, autenticação e controllers, usando serviços dublês.

### System

Fluxo ponta a ponta com app real e repositórios em memória.

## Escopo da V1

### Público

- `POST /auth/login`

### Autenticado

- `GET /pedidos`
- `GET /pedidos/:id`
- `POST /pedidos`
- `PUT /pedidos/:id`
- `DELETE /pedidos/:id`
- `GET /produtos`
- `GET /produtos/:id`
- `GET /massas`
- `GET /massas/:id`
- `GET /sabores`
- `GET /sabores/:id`
- `GET /tabelas-preco`
- `GET /tabelas-preco/:id`
- `GET /tp-itens`
- `GET /tp-itens/:id`

## Execução

```bash
npm install
npm run dev
```

## Variáveis de Ambiente

- `JWT_SECRET`: obrigatória em produção; em `development` e `test` usa fallback local
- `ENCRYPTION_SECRET`: obrigatória em produção; em `development` e `test` usa fallback local
- `JWT_EXPIRES_IN`: opcional, padrão `1h`
- `PORT`: opcional, padrão `3000`

Em produção, a aplicação falha no boot se `JWT_SECRET` ou `ENCRYPTION_SECRET` não estiverem definidas.

## Testes

```bash
npm test
```

A suíte usa `node:test` e está dividida em:

- `tests/unit`
- `tests/integration`
- `tests/system`

## Postman

A coleção e o ambiente ficam versionados em `postman/`.
