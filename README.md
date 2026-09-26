# NovaLoja — Plataforma de E-commerce

E-commerce completo, "whitelabel" (sem catálogo pré-carregado — você cadastra seus
próprios produtos pelo painel administrativo). Construído com Next.js, Prisma/PostgreSQL,
Auth.js, Mercado Pago e envio de e-mails transacionais.

## Funcionalidades

- **Loja pública**: catálogo com categorias e busca, página de produto, carrinho.
- **Conta do cliente**: cadastro/login com e-mail e senha, recuperação de senha por
  e-mail, gerenciamento de endereços com busca automática de CEP (ViaCEP), histórico
  de pedidos com acompanhamento de status.
- **Checkout**: seleção de endereço, cálculo de frete (fixo ou grátis acima de um
  valor configurável), cupom de desconto, pagamento via **Mercado Pago (Checkout Pro)**.
- **E-mails transacionais**: boas-vindas, confirmação de pedido, atualização de status
  do pedido e redefinição de senha — todos personalizados com o nome/logo/cor da loja.
- **Painel administrativo** (`/admin`, login próprio e protegido):
  - Dashboard com faturamento, pedidos, estoque baixo etc.
  - CRUD de produtos e categorias.
  - Gestão de pedidos com atualização de status (o cliente é notificado por e-mail
    automaticamente a cada mudança).
  - Lista de clientes cadastrados.
  - Banners da home.
  - Configurações da loja (nome, logo, cor, contato, frete).

## Stack técnica

- [Next.js 16](https://nextjs.org) (App Router, Server Actions)
- [Prisma](https://www.prisma.io) + PostgreSQL
- [Auth.js (NextAuth v5)](https://authjs.dev) — autenticação por credenciais
- [Mercado Pago SDK](https://github.com/mercadopago/sdk-nodejs) — Checkout Pro + webhook
- [Nodemailer](https://nodemailer.com) — envio de e-mails via SMTP
- [ViaCEP](https://viacep.com.br) — busca de endereço por CEP
- Tailwind CSS

## Rodando localmente

### Sobre `DATABASE_URL` e `DIRECT_URL`

Provedores como **Neon** e **Supabase** oferecem uma conexão "pooled" (com
`-pooler` no host, usada em produção pela aplicação) e uma conexão **direta**
(sem pooler). O Prisma precisa da conexão **direta** para rodar migrações —
usar a pooled trava com o erro `P1002` (timeout ao adquirir advisory lock).

- `DATABASE_URL`: conexão pooled (a que a aplicação usa em runtime).
- `DIRECT_URL`: conexão direta (usada só por `prisma migrate`/`prisma db seed`).

No Neon, pegue as duas em **Connect** → aba "Pooled connection" (liga) e
"Pooled connection" (desliga) — ou simplesmente remova o `-pooler` do host
da connection string pooled para obter a direta.

### 1. Pré-requisitos

- Node.js 20+
- PostgreSQL rodando localmente (ou um banco na nuvem)

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copie `.env.example` para `.env` e preencha os valores (veja detalhes de cada
integração abaixo).

```bash
cp .env.example .env
```

### 4. Rodar as migrações e o seed

```bash
npx prisma migrate deploy   # cria as tabelas
npx prisma db seed          # cria o usuário admin inicial + categoria padrão
```

O seed usa `ADMIN_EMAIL` e `ADMIN_PASSWORD` do `.env` para criar o primeiro
administrador. **Troque essa senha assim que possível** (crie outro admin
diretamente no banco ou peça um fluxo de troca de senha, se necessário).

### 5. Rodar o servidor

```bash
npm run dev
```

- Loja: http://localhost:3000
- Painel admin: http://localhost:3000/admin/login

## Configurando as integrações

### Mercado Pago

1. Crie uma aplicação em https://www.mercadopago.com.br/developers/panel/app
2. Copie o **Access Token** e a **Public Key** (use as credenciais de teste
   primeiro, depois troque para produção quando for divulgar a loja).
3. Preencha no `.env`:
   ```
   MP_ACCESS_TOKEN="seu-access-token"
   NEXT_PUBLIC_MP_PUBLIC_KEY="sua-public-key"
   ```
4. Configure a **URL de notificação (webhook)** no painel do Mercado Pago (ou ela é
   enviada automaticamente a cada preferência criada) apontando para:
   ```
   https://seu-dominio.com/api/webhooks/mercadopago
   ```
5. Por segurança, essas credenciais ficam **apenas em variáveis de ambiente do
   servidor**, nunca em um formulário do painel admin.

> Sem essas credenciais configuradas, o botão de finalizar compra mostra uma
> mensagem avisando que os pagamentos ainda não foram configurados — a loja
> continua navegável normalmente.

### E-mails (SMTP)

Preencha `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` e `SMTP_FROM` com os
dados do seu provedor (ex: um domínio no Gmail/Google Workspace, SendGrid,
Amazon SES, Resend via SMTP, etc.). Sem SMTP configurado, os e-mails só são
exibidos no console do servidor — útil para desenvolvimento.

### CEP

Usa a API pública do ViaCEP, não requer chave.

## Deploy em produção

Um caminho simples e recomendado:

1. **Banco de dados**: crie um Postgres gerenciado (ex: Neon, Supabase, Railway).
2. **Aplicação**: faça deploy na Vercel (ou qualquer host Node.js):
   - Configure todas as variáveis de `.env.example` no painel do provedor.
   - `NEXTAUTH_URL` e `NEXT_PUBLIC_BASE_URL` devem apontar para o domínio final
     (ex: `https://sualoja.com.br`).
3. Rode as migrações contra o banco de produção:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```
4. Acesse `/admin/login` com o e-mail/senha definidos em `ADMIN_EMAIL`/`ADMIN_PASSWORD`
   e comece a cadastrar categorias e produtos.
5. Aponte o domínio (ex: registrado no registro.br) para o host escolhido.

## Personalizando a marca

Tudo isso é editável em **Painel Admin → Configurações**, sem precisar mexer em
código:

- Nome da loja
- Logo
- Cor principal (usada no cabeçalho e nos e-mails)
- E-mail, telefone, WhatsApp, Instagram, endereço
- Regras de frete (valor fixo e frete grátis acima de X)

## Estrutura do projeto

```
prisma/schema.prisma       Modelo de dados (produtos, pedidos, usuários, etc.)
prisma/seed.ts             Script de seed (admin inicial)
src/app/(site)/            Loja pública + área do cliente
src/app/admin/             Painel administrativo
src/app/api/               Rotas de API (NextAuth, CEP, webhook Mercado Pago)
src/lib/actions/           Server Actions (mutações: cadastro, pedidos, admin...)
src/lib/email/             Templates e envio de e-mails transacionais
src/components/            Componentes de UI (loja, conta, admin)
src/store/cart.ts          Carrinho de compras (client-side, localStorage)
```

## Observações importantes

- O catálogo começa **vazio de propósito** — cadastre produtos, categorias e
  banners pelo painel `/admin` conforme a necessidade do seu negócio.
- Certifique-se de operar apenas com produtos cuja comercialização seja permitida
  na legislação brasileira.
