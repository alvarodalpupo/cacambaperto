# Caçamba Perto

Diretório de locação de caçambas de entulho no Paraná e em Santa Catarina: **cacambaperto.com.br**

## Como o projeto está organizado

| Pasta / arquivo | O que é |
|---|---|
| `src/dados.js` | **Tudo que você edita**: empresas, cidades, link do Stripe, preço, empresas em destaque e WhatsApp de contato |
| `src/style.css`, `src/lib.js`, `src/app.js` | Visual e funcionamento do site |
| `build.js` | Gera o site pronto na pasta `docs/` |
| `docs/` | O site publicado pelo GitHub Pages. Não edite à mão: ele é recriado a cada `node build.js` |

## Atualizar o site

1. Edite `src/dados.js` (adicionar empresa, marcar destaque, trocar o link do Stripe…).
2. Rode `node build.js`.
3. Faça commit e push. O GitHub Pages atualiza em 1 ou 2 minutos.

### Marcar uma empresa como Destaque

Coloque o id da empresa na lista `DESTAQUES` em `src/dados.js`. O id é a última parte do endereço da página dela: em `cacambaperto.com.br/cascavel/entumix/` o id é `entumix`. É o mesmo valor que chega no Stripe como `client_reference_id`.

## Publicação (GitHub Pages)

- **Settings → Pages → Build and deployment**: Source "Deploy from a branch", branch `main`, pasta `/docs`.
- **Custom domain**: `cacambaperto.com.br` (o arquivo `docs/CNAME` já está pronto). Depois que o DNS propagar, marque **Enforce HTTPS**.

### DNS no Registro.br

No painel do domínio, em **DNS → Editar zona**, crie:

| Tipo | Nome | Valor |
|---|---|---|
| A | (vazio) | 185.199.108.153 |
| A | (vazio) | 185.199.109.153 |
| A | (vazio) | 185.199.110.153 |
| A | (vazio) | 185.199.111.153 |
| CNAME | www | alvarodalpupo.github.io |
