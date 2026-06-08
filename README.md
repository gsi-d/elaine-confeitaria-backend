# Elaine Confeitaria Backend

API Node.js da primeira versão da Elaine Confeitaria, com foco em dois fluxos principais:

- autenticação por login com JWT
- criação e gestão de pedidos

Os recursos de catálogo ficam expostos em leitura, e a persistência roda via Prisma/PostgreSQL conectado ao Supabase.

## Estado Atual

A aplicação usa PostgreSQL via Prisma conectado ao Supabase.

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
- CRUD de pedidos
- gestão básica de usuários
- consulta e atualização de configuração de entrega

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
- usuários com `isAdmin=true` podem visualizar todos os pedidos
- dados sensíveis de usuário são criptografados antes de persistir

### Repositories

Fazem o acesso a dados via Prisma.

## Decisões da V1

- catálogos são somente leitura via API
- o preço do item do pedido não é aceito do cliente; é resolvido pela tabela de preços ativa
- admins podem visualizar todos os pedidos; usuários comuns enxergam apenas os próprios
- `Produto.precoUnitario` existe no modelo, mas o fluxo de pedido busca preço na tabela ativa (`TabelaPreco` + `TPItem`)
- itens de pedido seguem existindo no banco, mas o fluxo principal de pedido os manipula dentro de `Pedido`

## Estratégia de testes

### Unit

Validação, utilitários e regras de negócio isoladas.

### Integration

Rotas HTTP com middleware, autenticação e controllers, usando serviços dublês.

### System

Fluxo ponta a ponta com app real.

## Autenticação e Acesso

- `POST /auth/login` emite JWT
- o middleware atual aceita requisições sem token e apenas popula `request.user` quando o header `Authorization` é enviado
- rotas de catálogo, pedidos, usuários e configuração de entrega são montadas com esse middleware
- `PUT /configuracao-entrega` exige admin via `requireAdmin`
- nas leituras de pedidos, admin enxerga todos os pedidos

## Rotas

### Público

- `POST /auth/login`

### Comportamento atual com JWT opcional

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
- `GET /configuracao-entrega`
- `GET /pedidos`
- `GET /pedidos/:id`
- `POST /pedidos`
- `PUT /pedidos/:id`
- `PATCH /pedidos/:id/status`
- `DELETE /pedidos/:id`
- `GET /usuarios`
- `GET /usuarios/:id`
- `POST /usuarios`
- `PUT /usuarios/:id`
- `DELETE /usuarios/:id`

### Restrito a admin

- `PUT /configuracao-entrega`

## Escopo HTTP

As rotas acima refletem o estado real exposto por `src/app.js`.

## Execução

```bash
npm install
npm run prisma:generate
npx prisma validate
npm run dev
```

## Variáveis de Ambiente

- `JWT_SECRET`: obrigatória em produção; em `development` e `test` usa fallback local
- `ENCRYPTION_SECRET`: obrigatória em produção; em `development` e `test` usa fallback local
- `JWT_EXPIRES_IN`: opcional, padrão `1h`
- `PORT`: opcional, padrão `3000`
- `DATABASE_URL`: obrigatória para conectar ao banco Supabase via Prisma
- `BCRYPT_SALT_ROUNDS`: opcional, padrão `10`

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

## Observações Importantes

- `GET /produtos` retorna `imagemUrl`, `imagemAlt` e também `anexo` em base64 quando o arquivo existe em `public/assets`
- o cadastro de pedido depende de preço ativo em `TabelaPreco` e `TPItem`
- `POST /usuarios` cria usuário comum com `isAdmin=false`
