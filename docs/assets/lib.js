/* Funções compartilhadas entre o gerador (Node) e o navegador. */
(function (global) {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const digits = t => String(t).replace(/\D/g, "");
  const isCel = t => { const d = digits(t); return d.length === 11 && d[2] === "9"; };
  const norm = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const plural = (n, s, p) => n + " " + (n === 1 ? s : p);

  function foto(e, catNome) {
    const c = e.cor, ini = esc(e.nome.replace(/^(Caçambas?|Terraplanagem|Mini Entulhos?|Disk Entulhos?)\s+/i, "").slice(0, 14).toUpperCase());
    const ground = `<rect width="320" height="180" fill="#D9D6CE"/><rect y="136" width="320" height="44" fill="#B9B5AA"/><rect y="136" width="320" height="3" fill="#A29E92"/>`;
    const txt = (x, y, size, fill) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Big Shoulders Display,Impact,sans-serif" font-weight="900" font-size="${size}" fill="${fill}">${ini}</text>`;
    let fig = "";
    if (e.cat === "cacamba") {
      fig = `<path d="M70 70 L250 70 L232 136 L88 136 Z" fill="${c}"/><path d="M70 70 L250 70 L246 82 L74 82 Z" fill="#000" opacity=".18"/>
        <rect x="96" y="96" width="128" height="4" fill="#000" opacity=".15"/><rect x="100" y="112" width="120" height="4" fill="#000" opacity=".15"/>
        <path d="M92 70 l14 -14 l10 6 l12 -10 l16 8 l14 -6 l10 10 l18 -6 l12 12 Z" fill="#8C8577"/>
        <rect x="62" y="64" width="10" height="16" rx="2" fill="#3A3A3A"/><rect x="248" y="64" width="10" height="16" rx="2" fill="#3A3A3A"/>` + txt(160, 124, 18, "#fff");
    } else if (e.cat === "mini") {
      fig = [90, 160, 230].map((x, i) => `<g><rect x="${x - 26}" y="${66 + (i % 2) * 8}" width="52" height="${70 - (i % 2) * 8}" rx="6" fill="${c}"/>
        <rect x="${x - 26}" y="${82 + (i % 2) * 8}" width="52" height="4" fill="#000" opacity=".2"/><rect x="${x - 26}" y="112" width="52" height="4" fill="#000" opacity=".2"/>
        <ellipse cx="${x}" cy="${66 + (i % 2) * 8}" rx="26" ry="6" fill="#000" opacity=".25"/></g>`).join("") + txt(160, 164, 16, "#3A3A3A");
    } else if (e.cat === "terraplanagem") {
      fig = `<path d="M0 136 Q60 96 120 120 T240 112 L320 136 Z" fill="#9B7B55"/>
        <rect x="150" y="98" width="88" height="30" rx="4" fill="${c}"/><rect x="196" y="72" width="38" height="30" rx="3" fill="${c}"/>
        <rect x="202" y="78" width="26" height="16" fill="#CFE3EF"/><rect x="144" y="126" width="100" height="12" rx="6" fill="#2C2C2C"/>
        <path d="M156 104 L104 70 L72 96" stroke="${c}" stroke-width="10" fill="none" stroke-linecap="round"/>
        <path d="M64 92 l20 4 l-6 22 l-22 -6 Z" fill="#3A3A3A"/>` + txt(196, 122, 12, "#fff");
    } else {
      fig = `<path d="M40 136 L110 70 L180 136 Z" fill="#8C8577"/><path d="M150 136 L210 86 L280 136 Z" fill="#A69F90"/>
        <circle cx="96" cy="112" r="6" fill="#7A6F5E"/><circle cx="124" cy="120" r="5" fill="#6E6556"/><circle cx="214" cy="118" r="5" fill="#7A6F5E"/>
        <circle cx="250" cy="62" r="26" fill="${c}"/><path d="M238 62 l8 8 l16 -16" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` + txt(160, 164, 16, "#3A3A3A");
    }
    return `<svg viewBox="0 0 320 180" role="img" aria-label="Ilustração: ${esc(catNome)}">${ground}${fig}</svg>`;
  }

  /* e: empresa; d: { CIDADES, CATEGORIAS }; root: prefixo relativo até a raiz do site */
  function card(e, d, root) {
    const cid = d.CIDADES[e.cidade], cat = d.CATEGORIAS[e.cat];
    return `<a class="card${e.destaque ? " featured" : ""}" href="${root}${e.cidade}/${e.id}/" data-cat="${e.cat}" data-bairro="${esc(e.bairro)}" data-busca="${esc(norm([e.nome, e.bairro, e.end, e.resumo, cat.nome, cid.nome].join(" ")))}">
    <div class="ph">${foto(e, cat.nome)}</div>
    <div class="body">
      <span>${e.destaque ? '<span class="badge">★ Destaque</span> ' : ''}<span class="tag">${esc(cat.curto)} · ${esc(cid.nome)}/${cid.uf}</span></span>
      <h3>${esc(e.nome)}</h3>
      <span class="where">${esc(e.bairro)} · ${esc(e.resumo)}</span>
      <span class="tel"><span class="mono">${esc(e.tel)}</span><span class="ver">Ver contato →</span></span>
    </div></a>`;
  }

  const api = { esc, digits, isCel, norm, plural, foto, card };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else global.CP = api;
})(this);
