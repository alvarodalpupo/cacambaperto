/* Gera o site estático do Caçamba Perto na pasta docs/.
   Uso: node build.js
   Os dados e a configuração ficam em src/dados.js. */
const fs = require("fs");
const path = require("path");
const D = require("./src/dados.js");
const { esc, isCel, digits, plural, foto, card } = require("./src/lib.js");

const SITE = "https://cacambaperto.com.br/";
/* Mude para true quando o DNS do cacambaperto.com.br estiver apontando para o GitHub.
   Enquanto for false, o site funciona em alvarodalpupo.github.io/cacambaperto/ */
const USAR_DOMINIO = false;
const NOME = "Caçamba Perto";
const OUT = path.join(__dirname, "docs");
const { CIDADES, CATEGORIAS, COORDS, EMPRESAS } = D;

const ordenar = l => [...l].sort((a, b) => (b.destaque - a.destaque) || a.nome.localeCompare(b.nome, "pt-BR"));
const doCidade = k => EMPRESAS.filter(e => e.cidade === k);
const cidadeTxt = e => `${CIDADES[e.cidade].nome}/${CIDADES[e.cidade].uf}`;
const waLink = t => "https://wa.me/55" + digits(t) + "?text=" + encodeURIComponent(`Olá! Encontrei vocês no ${NOME} e gostaria de um orçamento.`);
const mapsLink = e => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent([e.nome, e.end, e.bairro, cidadeTxt(e)].filter(Boolean).join(", "));
const paginas = [];

/* ---------- arquivos ---------- */
function escrever(rel, conteudo) {
  const f = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, conteudo);
}

/* ---------- moldura comum ---------- */
function pagina({ caminho, titulo, descricao, corpo, scripts = [], jsonld = null, raiz }) {
  const root = raiz !== undefined ? raiz : "../".repeat(caminho.split("/").filter(Boolean).length);
  if (caminho !== null) paginas.push(caminho);
  const url = SITE + (caminho || "");
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
${caminho !== null ? `<link rel="canonical" href="${url}">` : `<meta name="robots" content="noindex">`}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${NOME}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:url" content="${url}">
<meta name="theme-color" content="#1C2025">
<link rel="icon" href="${root}assets/icone.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=Public+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap">
<link rel="stylesheet" href="${root}assets/style.css">
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ""}
</head>
<body data-root="${root}">
<header class="top">
  <div class="wrap">
    <a class="logo" href="${root}"><b>${NOME}</b><span>cacambaperto.com.br</span></a>
    <nav aria-label="Principal">
      <a href="${root}#cidades">Cidades</a>
      <a href="${root}categoria/cacamba/">Caçambas</a>
      <a href="${root}categoria/mini/">Mini entulho</a>
      <a href="${root}cadastro/">Cadastrar empresa</a>
      <a class="cta" href="${root}anunciar/">Anunciar</a>
    </nav>
  </div>
  <div class="hazard" aria-hidden="true"></div>
</header>
<main>
${corpo(root)}
</main>
<footer>
  <div class="wrap">
    <span>${NOME} · diretório de locação de caçambas e serviços de entulho no Paraná e em Santa Catarina</span>
    <span>Dados públicos de empresas locais. É dono de uma empresa listada? <a href="${root}cadastro/">Atualize os dados</a> ou <a href="${root}anunciar/">destaque seu anúncio</a>.</span>
  </div>
</footer>
<div class="toast" id="toast" hidden></div>
<script src="${root}assets/config.js"></script>
<script src="${root}assets/lib.js"></script>
${scripts.map(s => `<script src="${root}assets/${s}"></script>`).join("\n")}
<script src="${root}assets/app.js"></script>
</body>
</html>
`;
}

/* ---------- blocos reutilizados ---------- */
const slot = (root, cidade) => `<a class="slot" href="${root}anunciar/"><span class="badge">Espaço disponível</span><b>Sua empresa no topo</b>
  <span>Apareça antes de todas as outras quando alguém procurar caçamba ${cidade ? "em " + esc(CIDADES[cidade].nome) : "na sua cidade"}.</span>
  <span class="price">${D.PRECO_DESTAQUE}/mês · cancele quando quiser</span></a>`;

const gradeCidades = root => `<div class="cities">${Object.entries(CIDADES).map(([k, c]) =>
  `<a class="city" href="${root}${k}/"><span class="uf mono">${c.uf}</span><b>${esc(c.nome)}</b><span class="note">${esc(c.regiao)} · ${plural(doCidade(k).length, "empresa", "empresas")}</span></a>`).join("")}</div>`;

const faixaCadastro = root => `<section class="wrap"><a class="join" href="${root}cadastro/">
  <span><b>Não achou sua empresa aqui?</b><span>Cadastre grátis sua locadora de caçambas, mini entulho ou terraplanagem.</span></span>
  <span class="btn primary">Entrar em contato</span></a></section>`;

const guia = `<section class="wrap">
  <div class="sec-head"><h2>O que pode ir na caçamba</h2><span class="count">Classes de resíduo da Resolução CONAMA 307</span></div>
  <div class="guide">
    <div><span class="cls">A</span><p><strong>Pode.</strong> Tijolo, bloco, telha, concreto, argamassa, azulejo e terra de escavação.</p></div>
    <div><span class="cls">B</span><p><strong>Separe.</strong> Madeira, metal, plástico, papelão, vidro e gesso vão para reciclagem.</p></div>
    <div><span class="cls">C</span><p><strong>Consulte.</strong> Materiais sem reciclagem viável. Pergunte à empresa antes de colocar.</p></div>
    <div><span class="cls no">D</span><p><strong>Proibido.</strong> Tintas, solventes, óleos, amianto e outros resíduos perigosos.</p></div>
  </div>
  <p class="note" style="margin-top:10px">Lixo doméstico, móveis e podas também costumam ser recusados. Confirme as regras com a empresa contratada.</p>
</section>`;

const chips = base => {
  const n = c => base.filter(e => !c || e.cat === c).length;
  const cats = Object.keys(CATEGORIAS).filter(k => n(k) > 0);
  if (cats.length < 2) return "";
  return `<div class="chips" role="group" aria-label="Categorias">
    <button class="chip" type="button" data-cat="" aria-pressed="true">Todas<span class="n">${n("")}</span></button>
    ${cats.map(k => `<button class="chip" type="button" data-cat="${k}" aria-pressed="false">${esc(CATEGORIAS[k].curto)}<span class="n">${n(k)}</span></button>`).join("")}
  </div>`;
};

/* ---------- página inicial ---------- */
function inicio() {
  const nCid = Object.keys(CIDADES).length;
  return pagina({
    caminho: "",
    titulo: `${NOME}: aluguel de caçamba de entulho no Paraná e em Santa Catarina`,
    descricao: `Encontre empresas de aluguel de caçamba de entulho perto da sua obra. ${EMPRESAS.length} empresas em ${nCid} cidades do PR e SC, com telefone, WhatsApp e endereço.`,
    scripts: ["dados.js"],
    corpo: root => `
<div class="wrap hero">
  <p class="eyebrow">Diretório de caçambas · ${EMPRESAS.length} empresas em ${nCid} cidades do PR e SC</p>
  <h1>Caçamba de entulho <em>perto</em> da sua obra</h1>
  <p>Escolha sua cidade, compare empresas de caçamba e mini entulho por bairro e fale direto com elas pelo telefone ou WhatsApp.</p>
  <form class="search three" id="busca" role="search">
    <input id="q" type="search" placeholder="Nome, bairro ou serviço" aria-label="Buscar" autocomplete="off">
    <select id="cidade" aria-label="Cidade"><option value="">Todas as cidades</option>${Object.entries(CIDADES).map(([k, c]) => `<option value="${k}">${esc(c.nome)}/${c.uf}</option>`).join("")}</select>
    <select id="bairro" aria-label="Bairro"><option value="">Todos os bairros</option></select>
    <button type="submit">Buscar</button>
  </form>
  <div class="geo"><button class="btn" type="button" id="geo"><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" fill="currentColor"/></svg>Usar minha localização</button><span class="note" id="geo-msg" role="status"></span></div>
  ${chips(EMPRESAS)}
</div>
<section class="wrap" id="cidades">
  <div class="sec-head"><h2>Escolha sua cidade</h2><span class="count">Paraná e Santa Catarina</span></div>
  ${gradeCidades(root)}
</section>
<section class="wrap" id="resultados" hidden>
  <div class="sec-head"><h2 id="res-titulo">Resultados</h2><span class="count mono" id="res-contagem"></span></div>
  <div id="res-grade"></div>
</section>
${faixaCadastro(root)}
${guia}`
  });
}

/* ---------- página de cidade ---------- */
function paginaCidade(k) {
  const c = CIDADES[k], base = ordenar(doCidade(k));
  const bairros = [...new Set(base.map(e => e.bairro))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  const temDestaque = base.some(e => e.destaque);
  const extras = base.some(e => e.cat !== "cacamba");
  return pagina({
    caminho: k + "/",
    titulo: `Caçamba de entulho em ${c.nome}/${c.uf}: ${plural(base.length, "empresa", "empresas")} | ${NOME}`,
    descricao: `Aluguel de caçamba de entulho em ${c.nome}/${c.uf}: compare ${plural(base.length, "empresa", "empresas")} por bairro, com telefone, WhatsApp e endereço.`,
    jsonld: { "@context": "https://schema.org", "@type": "ItemList", name: `Caçamba de entulho em ${c.nome}`,
      itemListElement: base.map((e, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}${k}/${e.id}/`, name: e.nome })) },
    corpo: root => `
<div class="wrap">
  <p class="crumbs"><a href="${root}">Início</a> / ${esc(c.nome)}</p>
  <div class="hero" style="padding-top:12px">
    <p class="eyebrow">${esc(c.regiao)} · ${plural(base.length, "empresa", "empresas")}</p>
    <h1>Caçamba de entulho em <em>${esc(c.nome)}</em></h1>
    <p>Empresas de locação de caçamba${extras ? ", mini entulho e serviços de obra" : ""} em ${esc(c.nome)}/${c.uf}. Compare por bairro e peça orçamento direto.</p>
    <form class="search" id="filtro" role="search">
      <input id="q" type="search" placeholder="Nome, bairro ou serviço em ${esc(c.nome)}" aria-label="Buscar" autocomplete="off">
      <select id="bairro" aria-label="Bairro"><option value="">Todos os bairros</option>${bairros.map(b => `<option>${esc(b)}</option>`).join("")}</select>
      <button type="submit">Buscar</button>
    </form>
    ${chips(base)}
  </div>
</div>
<section class="wrap">
  ${temDestaque ? "" : `<div class="grid" style="margin-bottom:24px">${slot(root, k)}</div>`}
  <div class="sec-head"><h2>Empresas em ${esc(c.nome)}</h2><span class="count mono" id="contagem">${plural(base.length, "empresa", "empresas")}</span></div>
  <div class="grid" id="lista">${base.map(e => card(e, D, root)).join("")}</div>
  <div class="empty" id="vazio" hidden>Nenhuma empresa encontrada com esses filtros. <a href="${root}cadastro/">Não achou sua empresa? Cadastre aqui.</a></div>
</section>
${faixaCadastro(root)}
<section class="wrap faq">
  <div class="sec-head"><h2>Dúvidas sobre caçamba em ${esc(c.nome)}</h2></div>
  <details><summary>Quanto custa alugar uma caçamba em ${esc(c.nome)}?</summary><p>O preço muda conforme o tamanho da caçamba, o bairro e quantos dias ela fica na obra. Peça orçamento para duas ou três empresas da lista e confirme se o valor já inclui a retirada e o descarte.</p></details>
  <details><summary>Qual tamanho de caçamba escolher?</summary><p>As empresas costumam trabalhar com caçambas de 3 a 5 m³. Para reformas pequenas, como trocar o piso de um cômodo, os tambores de mini entulho podem bastar. Para demolição ou obra inteira, a caçamba maior sai mais em conta.</p></details>
  <details><summary>Preciso de autorização para deixar a caçamba na rua?</summary><p>Cada prefeitura tem regras próprias para caçamba em via pública, como sinalização e prazo máximo. Pergunte à empresa, que normalmente já conhece as exigências de ${esc(c.nome)}.</p></details>
  <details><summary>Quanto tempo a caçamba pode ficar na obra?</summary><p>O prazo é combinado com a empresa no aluguel. Se precisar de mais dias, avise antes do vencimento para evitar cobrança extra.</p></details>
</section>
<section class="wrap"><div class="sec-head"><h2>Outras cidades</h2></div>${gradeCidades(root)}</section>
${guia}`
  });
}

/* ---------- página de empresa ---------- */
function paginaEmpresa(e) {
  const c = CATEGORIAS[e.cat], cid = CIDADES[e.cidade];
  const outras = ordenar(EMPRESAS.filter(x => x.cidade === e.cidade && x.id !== e.id && x.cat === e.cat)).slice(0, 3);
  return pagina({
    caminho: `${e.cidade}/${e.id}/`,
    titulo: `${e.nome}: ${c.nome.toLowerCase()} em ${cidadeTxt(e)} | ${NOME}`,
    descricao: `${e.nome}, ${c.nome.toLowerCase()} no bairro ${e.bairro}, ${cidadeTxt(e)}. Telefone ${e.tel}. Veja endereço e peça orçamento.`,
    jsonld: { "@context": "https://schema.org", "@type": "LocalBusiness", name: e.nome, telephone: "+55" + digits(e.tel), url: `${SITE}${e.cidade}/${e.id}/`,
      address: { "@type": "PostalAddress", streetAddress: e.end || undefined, addressLocality: cid.nome, addressRegion: cid.uf, addressCountry: "BR" } },
    corpo: root => `
<div class="wrap">
  <p class="crumbs"><a href="${root}">Início</a> / <a href="${root}${e.cidade}/">${esc(cid.nome)}</a> / ${esc(e.nome)}</p>
  <div class="detail">
    <div>
      <div class="cover">${foto(e, c.nome)}</div>
      <p class="ilus">Imagem ilustrativa. Empresas com plano Destaque podem enviar fotos reais.</p>
      ${e.destaque ? '<span class="badge">★ Empresa em destaque</span>' : ''}
      <h1>${esc(e.nome)}</h1>
      <p class="lead">${esc(e.desc)}</p>
      <dl class="facts">
        <dt>Categoria</dt><dd><a href="${root}categoria/${e.cat}/">${esc(c.nome)}</a></dd>
        <dt>Cidade</dt><dd><a href="${root}${e.cidade}/">${esc(cidadeTxt(e))}</a></dd>
        <dt>Endereço</dt><dd>${e.end ? esc(e.end) + " · " : ""}${esc(e.bairro)}</dd>
        <dt>Telefone</dt><dd class="mono">${esc(e.tel)}${e.fixo ? ` · ${esc(e.fixo)}` : ""}</dd>
      </dl>
      <p class="note">Dados públicos. Confirme preço, tamanho da caçamba e prazo de permanência diretamente com a empresa.</p>
    </div>
    <aside class="panel" aria-label="Contato">
      <span class="eyebrow">Pedir orçamento</span>
      <span class="big">${esc(e.tel)}</span>
      ${isCel(e.tel) ? `<a class="btn primary" href="${waLink(e.tel)}" target="_blank" rel="noopener">Chamar no WhatsApp</a>` : ""}
      <a class="btn" href="tel:+55${digits(e.tel)}">Ligar</a>
      <button class="btn" type="button" data-copy="${esc(e.tel)}">Copiar telefone</button>
      <a class="btn dark" href="${mapsLink(e)}" target="_blank" rel="noopener">Ver no mapa</a>
      <p class="note">Diga que encontrou a empresa no ${NOME}.</p>
      <hr>
      <span class="note">É o dono? <a href="${root}anunciar/">Destaque esta empresa por ${D.PRECO_DESTAQUE}/mês</a>.</span>
    </aside>
  </div>
</div>
${outras.length ? `<section class="wrap"><div class="sec-head"><h2>Outras opções em ${esc(cid.nome)}</h2><a href="${root}${e.cidade}/">Ver todas →</a></div><div class="grid">${outras.map(x => card(x, D, root)).join("")}</div></section>` : ""}`
  });
}

/* ---------- página de categoria ---------- */
function paginaCategoria(k) {
  const cat = CATEGORIAS[k], lista = EMPRESAS.filter(e => e.cat === k);
  const grupos = Object.keys(CIDADES).map(ck => [ck, ordenar(lista.filter(e => e.cidade === ck))]).filter(([, l]) => l.length);
  return pagina({
    caminho: `categoria/${k}/`,
    titulo: `${cat.nome} no Paraná e em Santa Catarina | ${NOME}`,
    descricao: `${cat.desc} ${plural(lista.length, "empresa", "empresas")} em ${plural(grupos.length, "cidade", "cidades")}.`,
    corpo: root => `
<div class="wrap">
  <p class="crumbs"><a href="${root}">Início</a> / ${esc(cat.curto)}</p>
  <div class="hero" style="padding-top:12px">
    <p class="eyebrow">Categoria · ${plural(lista.length, "empresa", "empresas")} em ${plural(grupos.length, "cidade", "cidades")}</p>
    <h1>${esc(cat.nome)}</h1>
    <p>${esc(cat.desc)}</p>
    <div class="chips">${Object.entries(CATEGORIAS).map(([kk, cc]) => `<a class="chip" href="${root}categoria/${kk}/" aria-pressed="${kk === k}">${esc(cc.curto)}</a>`).join("")}</div>
  </div>
</div>
${grupos.map(([ck, l]) => `<section class="wrap"><div class="sec-head"><h2>${esc(CIDADES[ck].nome)}</h2><a href="${root}${ck}/">Ver tudo em ${esc(CIDADES[ck].nome)} →</a></div><div class="grid">${l.map(e => card(e, D, root)).join("")}</div></section>`).join("")}
${faixaCadastro(root)}`
  });
}

/* ---------- anunciar ---------- */
function paginaAnunciar() {
  const opcoes = Object.entries(CIDADES).map(([k, c]) => `<optgroup label="${esc(c.nome)}/${c.uf}">${ordenar(doCidade(k)).map(e => `<option value="${e.id}">${esc(e.nome)}</option>`).join("")}</optgroup>`).join("");
  const ok = /^https:\/\/(buy|checkout)\.stripe\.com\//.test(D.STRIPE_PAYMENT_LINK);
  return pagina({
    caminho: "anunciar/",
    titulo: `Anuncie sua empresa de caçambas | ${NOME}`,
    descricao: `Coloque sua locadora de caçambas no topo da sua cidade no ${NOME} por ${D.PRECO_DESTAQUE} por mês, sem fidelidade.`,
    corpo: root => `
<div class="wrap">
  <p class="crumbs"><a href="${root}">Início</a> / Anunciar</p>
  <div class="plan">
    <div class="price-card">
      <span class="eyebrow" style="color:inherit;opacity:.7">Plano Destaque</span>
      <span class="amt">${esc(D.PRECO_DESTAQUE.replace(/\D/g, ""))}<small>,00 /mês</small></span>
      <ul>
        <li>Sua empresa no topo da página da sua cidade</li>
        <li>Selo "Destaque" e borda amarela no anúncio</li>
        <li>Fotos reais da sua frota no lugar da ilustração</li>
        <li>Botão de WhatsApp com mensagem pronta de orçamento</li>
        <li>Cobrança mensal pelo Stripe, sem fidelidade</li>
      </ul>
    </div>
    <form class="form" id="assinar">
      <h2 style="font-size:32px;text-transform:uppercase">Assinar o Destaque</h2>
      <p style="margin:0;color:var(--muted)">Escolha sua empresa. O pagamento abre numa página segura do Stripe, com cartão de crédito.</p>
      <label for="emp">Empresa
        <select id="emp" required><option value="">Selecione…</option>${opcoes}<optgroup label="Outra"><option value="nova">Minha empresa não está na lista</option></optgroup></select>
      </label>
      ${ok ? "" : `<div class="warn"><strong>Pagamento ainda não configurado.</strong> Coloque o link do Stripe em src/dados.js e gere o site de novo.</div>`}
      <button class="btn primary" type="submit" ${ok ? "" : "disabled"}>Assinar por ${D.PRECO_DESTAQUE}/mês</button>
      <p class="note">Depois do pagamento, o anúncio é atualizado em até 1 dia útil.</p>
    </form>
  </div>
</div>`
  });
}

/* ---------- cadastro ---------- */
function paginaCadastro() {
  const ok = digits(D.CONTATO_WHATSAPP).length >= 10;
  return pagina({
    caminho: "cadastro/",
    titulo: `Cadastre sua empresa de caçambas grátis | ${NOME}`,
    descricao: `Não achou sua empresa no ${NOME}? Cadastre grátis sua locadora de caçambas, mini entulho ou terraplanagem.`,
    corpo: root => `
<div class="wrap">
  <p class="crumbs"><a href="${root}">Início</a> / Cadastrar empresa</p>
  <div class="plan">
    <div>
      <p class="eyebrow">Cadastro gratuito</p>
      <h1 class="page-h1">Não achou sua empresa aqui?</h1>
      <p class="lead">Preencha os dados e entre em contato. O cadastro básico é grátis e sua empresa aparece na página da sua cidade em até 2 dias úteis.</p>
      <p class="note" style="margin-top:16px">Também serve para corrigir dados de uma empresa que já está no site, como telefone ou endereço.</p>
      <p style="margin-top:20px"><a href="${root}anunciar/">Quer aparecer no topo? Conheça o plano Destaque →</a></p>
    </div>
    <form class="form" id="cad" novalidate>
      <label for="cad-nome">Nome da empresa<input id="cad-nome" required autocomplete="organization"></label>
      <label for="cad-cidade">Cidade<select id="cad-cidade" required><option value="">Selecione…</option>${Object.values(CIDADES).map(c => `<option>${esc(c.nome)}/${c.uf}</option>`).join("")}<option value="outra">Outra cidade</option></select></label>
      <label for="cad-outra" id="lbl-outra" hidden>Qual cidade?<input id="cad-outra"></label>
      <label for="cad-cat">Serviço<select id="cad-cat" required>${Object.values(CATEGORIAS).map(c => `<option>${esc(c.nome)}</option>`).join("")}</select></label>
      <label for="cad-tel">Telefone ou WhatsApp<input id="cad-tel" type="tel" required autocomplete="tel" placeholder="(45) 99999-0000"></label>
      <label for="cad-end">Endereço e bairro<input id="cad-end" autocomplete="street-address"></label>
      <label for="cad-resp">Seu nome<input id="cad-resp" autocomplete="name"></label>
      <p class="note" id="cad-erro" role="alert" hidden></p>
      ${ok ? "" : `<div class="warn"><strong>Contato ainda não configurado.</strong> Coloque o número de WhatsApp em src/dados.js e gere o site de novo.</div>`}
      <button class="btn primary" type="submit" ${ok ? "" : "disabled"}>Enviar pelo WhatsApp</button>
      <p class="note">O botão abre o WhatsApp com a mensagem pronta. É só tocar em enviar.</p>
    </form>
  </div>
</div>`
  });
}

/* ---------- 404 (links absolutos, pois pode abrir em qualquer endereço) ---------- */
function pagina404() {
  return pagina({
    caminho: null, raiz: USAR_DOMINIO ? "/" : "/cacambaperto/",
    titulo: `Página não encontrada | ${NOME}`,
    descricao: "Página não encontrada.",
    corpo: root => `<div class="wrap hero"><p class="eyebrow">Erro 404</p><h1>Essa página não existe</h1><p>O endereço pode ter mudado. Escolha sua cidade abaixo.</p></div>
<section class="wrap">${gradeCidades(root)}</section>`
  });
}

/* ---------- gerar ---------- */
fs.rmSync(OUT, { recursive: true, force: true });
escrever("index.html", inicio());
Object.keys(CIDADES).forEach(k => escrever(`${k}/index.html`, paginaCidade(k)));
EMPRESAS.forEach(e => escrever(`${e.cidade}/${e.id}/index.html`, paginaEmpresa(e)));
Object.keys(CATEGORIAS).filter(k => EMPRESAS.some(e => e.cat === k)).forEach(k => escrever(`categoria/${k}/index.html`, paginaCategoria(k)));
escrever("anunciar/index.html", paginaAnunciar());
escrever("cadastro/index.html", paginaCadastro());
escrever("404.html", pagina404());

/* recursos */
const reset = `html{color-scheme:light}body{margin:0}img{max-width:100%}[hidden]{display:none!important}\n`;
const extra = `
.card .ver{color:var(--link);font-weight:700}
.panel hr{border:0;border-top:1px dashed var(--line);width:100%;margin:4px 0}
.page-h1{font-size:clamp(38px,6vw,64px);font-weight:900;text-transform:uppercase;margin:8px 0 12px}
.lead{font-size:18px;max-width:60ch}
.faq details{margin-bottom:8px}
.faq details p{margin:10px 0 0;color:var(--muted);max-width:70ch}
`;
escrever("assets/style.css", reset + fs.readFileSync(path.join(__dirname, "src/style.css"), "utf8") + extra);
escrever("assets/lib.js", fs.readFileSync(path.join(__dirname, "src/lib.js"), "utf8"));
escrever("assets/app.js", fs.readFileSync(path.join(__dirname, "src/app.js"), "utf8"));
escrever("assets/config.js", `window.CP_CONFIG = ${JSON.stringify({ stripe: D.STRIPE_PAYMENT_LINK, whatsapp: D.CONTATO_WHATSAPP, preco: D.PRECO_DESTAQUE })};\n`);
const enxuto = EMPRESAS.map(({ id, nome, cat, tel, end, bairro, cidade, resumo, cor, destaque }) => ({ id, nome, cat, tel, end, bairro, cidade, resumo, cor, destaque }));
escrever("assets/dados.js", `window.CP_DADOS = ${JSON.stringify({ CIDADES, CATEGORIAS, COORDS, EMPRESAS: enxuto })};\n`);
escrever("assets/icone.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#1C2025"/><path d="M10 22 H54 L48 46 H16 Z" fill="#E3A008"/><rect x="18" y="30" width="28" height="3" fill="#1C2025" opacity=".35"/><rect x="20" y="37" width="24" height="3" fill="#1C2025" opacity=".35"/></svg>`);

/* SEO e GitHub Pages */
const hoje = new Date().toISOString().slice(0, 10);
escrever("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paginas.map(p => `  <url><loc>${SITE}${p}</loc><lastmod>${hoje}</lastmod></url>`).join("\n")}
</urlset>
`);
escrever("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`);
if (USAR_DOMINIO) escrever("CNAME", "cacambaperto.com.br\n");
escrever(".nojekyll", "");

console.log(`Site gerado em docs/: ${paginas.length} páginas, ${EMPRESAS.length} empresas, ${Object.keys(CIDADES).length} cidades.`);
