/* Interações do site Caçamba Perto (navegador). */
(function () {
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const ROOT = document.body.dataset.root || "";
  const CFG = window.CP_CONFIG || {};

  function toast(msg) {
    const t = $("#toast"); if (!t) return;
    t.textContent = msg; t.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(() => (t.hidden = true), 2400);
  }
  function abrir(url) {
    const a = document.createElement("a"); a.href = url; a.target = "_blank"; a.rel = "noopener";
    document.body.appendChild(a); a.click(); a.remove();
  }

  /* Copiar telefone */
  $$("[data-copy]").forEach(b => b.addEventListener("click", () => {
    const txt = b.dataset.copy;
    try {
      navigator.clipboard.writeText(txt).then(() => toast("Telefone copiado"), () => toast("Selecione o número para copiar"));
    } catch (e) { toast("Selecione o número para copiar"); }
  }));

  /* Chips de categoria (página de cidade e página inicial) */
  function ligarChips(onChange) {
    $$(".chip[data-cat]").forEach(b => b.addEventListener("click", () => {
      $$(".chip[data-cat]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      onChange(b.dataset.cat);
    }));
  }

  /* Filtro em página de cidade: esconde e mostra os cartões já gerados */
  const filtro = $("#filtro");
  if (filtro) {
    const st = { q: "", bairro: "", cat: "" };
    const aplicar = () => {
      const q = CP.norm(st.q.trim());
      let n = 0;
      $$("#lista .card").forEach(c => {
        const ok = (!st.cat || c.dataset.cat === st.cat) && (!st.bairro || c.dataset.bairro === st.bairro) && (!q || c.dataset.busca.includes(q));
        c.hidden = !ok; if (ok) n++;
      });
      const cont = $("#contagem"); if (cont) cont.textContent = CP.plural(n, "empresa", "empresas");
      const vazio = $("#vazio"); if (vazio) vazio.hidden = n > 0;
    };
    filtro.addEventListener("submit", ev => { ev.preventDefault(); st.q = $("#q").value; aplicar(); });
    $("#q").addEventListener("input", ev => { st.q = ev.target.value; aplicar(); });
    const bai = $("#bairro"); if (bai) bai.addEventListener("change", () => { st.bairro = bai.value; aplicar(); });
    ligarChips(cat => { st.cat = cat; aplicar(); });
  }

  /* Busca da página inicial: usa a lista completa em assets/dados.js */
  const busca = $("#busca"), D = window.CP_DADOS;
  if (busca && D) {
    const st = { q: "", cidade: "", bairro: "", cat: "" };
    const bai = $("#bairro"), cid = $("#cidade");
    const bairros = k => [...new Set(D.EMPRESAS.filter(e => !k || e.cidade === k).map(e => e.bairro))].sort((a, b) => a.localeCompare(b, "pt-BR"));
    const preencherBairros = () => {
      bai.innerHTML = '<option value="">Todos os bairros</option>' + bairros(st.cidade).map(b => `<option>${CP.esc(b)}</option>`).join("");
    };
    const desenhar = () => {
      const filtrando = st.q.trim() || st.cidade || st.bairro || st.cat;
      $("#cidades").hidden = !!filtrando;
      $("#resultados").hidden = !filtrando;
      if (!filtrando) return;
      const q = CP.norm(st.q.trim());
      const lista = D.EMPRESAS.filter(e =>
        (!st.cidade || e.cidade === st.cidade) && (!st.cat || e.cat === st.cat) && (!st.bairro || e.bairro === st.bairro) &&
        (!q || CP.norm([e.nome, e.bairro, e.end, e.resumo, D.CATEGORIAS[e.cat].nome, D.CIDADES[e.cidade].nome].join(" ")).includes(q))
      ).sort((a, b) => (b.destaque - a.destaque) || a.nome.localeCompare(b.nome, "pt-BR"));
      $("#res-titulo").textContent = st.cidade ? D.CIDADES[st.cidade].nome : "Resultados";
      $("#res-contagem").textContent = CP.plural(lista.length, "empresa", "empresas");
      $("#res-grade").innerHTML = lista.length
        ? `<div class="grid">${lista.map(e => CP.card(e, D, ROOT)).join("")}</div>`
        : `<div class="empty">Nenhuma empresa encontrada com esses filtros. Tente outro bairro, outra cidade ou outra palavra. <a href="${ROOT}cadastro/">Não achou sua empresa? Cadastre aqui.</a></div>`;
    };
    busca.addEventListener("submit", ev => { ev.preventDefault(); st.q = $("#q").value; desenhar(); });
    $("#q").addEventListener("input", ev => { st.q = ev.target.value; desenhar(); });
    cid.addEventListener("change", () => { st.cidade = cid.value; st.bairro = ""; preencherBairros(); desenhar(); });
    bai.addEventListener("change", () => { st.bairro = bai.value; desenhar(); });
    ligarChips(cat => { st.cat = cat; desenhar(); });
    preencherBairros();
  }

  /* Usar minha localização: leva para a cidade atendida mais próxima */
  const geo = $("#geo");
  if (geo && D) {
    const distKm = (a, b) => {
      const r = x => x * Math.PI / 180, R = 6371, dLat = r(b[0] - a[0]), dLng = r(b[1] - a[1]);
      const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a[0])) * Math.cos(r(b[0])) * Math.sin(dLng / 2) ** 2;
      return 2 * R * Math.asin(Math.sqrt(h));
    };
    geo.addEventListener("click", () => {
      const msg = $("#geo-msg");
      const falhou = t => { msg.textContent = t; geo.disabled = false; };
      if (!navigator.geolocation) return falhou("Seu navegador não informa a localização. Escolha a cidade na lista.");
      geo.disabled = true; msg.textContent = "Procurando sua localização…";
      navigator.geolocation.getCurrentPosition(pos => {
        const eu = [pos.coords.latitude, pos.coords.longitude];
        const [k, km] = Object.entries(D.COORDS).map(([k, c]) => [k, distKm(eu, c)]).sort((a, b) => a[1] - b[1])[0];
        geo.disabled = false;
        if (km > 60) { msg.textContent = `Ainda não atendemos sua cidade. A mais próxima é ${D.CIDADES[k].nome}, a ${Math.round(km)} km.`; return; }
        location.href = ROOT + k + "/";
      }, () => falhou("Não foi possível pegar sua localização. Escolha a cidade na lista."), { timeout: 10000, maximumAge: 600000 });
    });
  }

  /* Plano Destaque: abre o Stripe com o id da empresa */
  const assinar = $("#assinar");
  if (assinar) {
    const emp = $("#emp");
    emp.addEventListener("change", () => { if (emp.value === "nova") location.href = ROOT + "cadastro/"; });
    assinar.addEventListener("submit", ev => {
      ev.preventDefault();
      if (!emp.value) { toast("Selecione sua empresa"); return; }
      const link = CFG.stripe || "";
      if (!/^https:\/\/(buy|checkout)\.stripe\.com\//.test(link)) return;
      abrir(link + (link.includes("?") ? "&" : "?") + "client_reference_id=" + encodeURIComponent(emp.value));
    });
  }

  /* Cadastro de empresa: monta a mensagem e abre o WhatsApp */
  const cad = $("#cad");
  if (cad) {
    const cidSel = $("#cad-cidade");
    cidSel.addEventListener("change", () => { $("#lbl-outra").hidden = cidSel.value !== "outra"; });
    cad.addEventListener("submit", ev => {
      ev.preventDefault();
      const v = id => $(id).value.trim();
      const cidade = cidSel.value === "outra" ? v("#cad-outra") : cidSel.value;
      const erro = $("#cad-erro");
      if (!v("#cad-nome") || !cidade || !v("#cad-tel")) { erro.textContent = "Preencha o nome da empresa, a cidade e o telefone."; erro.hidden = false; return; }
      erro.hidden = true;
      const num = CP.digits(CFG.whatsapp || "");
      if (num.length < 10) return;
      const msg = ["Olá! Quero cadastrar minha empresa no Caçamba Perto.",
        "Empresa: " + v("#cad-nome"), "Cidade: " + cidade, "Serviço: " + v("#cad-cat"), "Telefone: " + v("#cad-tel"),
        v("#cad-end") && "Endereço: " + v("#cad-end"), v("#cad-resp") && "Responsável: " + v("#cad-resp")].filter(Boolean).join("\n");
      abrir("https://wa.me/" + (num.startsWith("55") ? "" : "55") + num + "?text=" + encodeURIComponent(msg));
    });
  }
})();
