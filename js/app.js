(() => {
  const { categorie, ricette } = window.RICETTARIO;
  const app = document.getElementById("app");
  const nf = (max) => new Intl.NumberFormat("it-IT", { maximumFractionDigits: max });

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const nomeCategoria = (id) => categorie.find((c) => c.id === id)?.nome ?? id;

  const storage = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };

  const ICONE = {
    indietro: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H5M11 5l-7 7 7 7"/></svg>',
    stella: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l2.6 5.3 5.9.9-4.25 4.1 1 5.8L12 16.9l-5.25 2.7 1-5.8L3.5 9.7l5.9-.9z"/></svg>',
    freccia: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
    cerca: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>',
    carrello: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h2l2.2 10.2a1.5 1.5 0 0 0 1.5 1.2h7.6a1.5 1.5 0 0 0 1.5-1.2L20 8H7"/><circle cx="10" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/></svg>',
    condividi: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/></svg>',
    cestino: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
    scarica: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
  };

  /* ---------- Geometria stampi ---------- */

  const areaStampo = (s) => {
    switch (s.forma) {
      case "tonda": return Math.PI * (s.diametro / 2) ** 2;
      case "rettangolare": return s.lunghezza * s.larghezza;
      case "quadrata": return s.lato ** 2;
      case "superficie": return s.area;
    }
    return NaN;
  };

  const descriviStampo = (s) => {
    switch (s.forma) {
      case "tonda": return `tonda Ø ${nf(1).format(s.diametro)} cm`;
      case "rettangolare": return `rettangolare ${nf(1).format(s.lunghezza)} × ${nf(1).format(s.larghezza)} cm`;
      case "quadrata": return `quadrata ${nf(1).format(s.lato)} cm`;
    }
    return "";
  };

  /* ---------- Quantità ---------- */

  const arrotonda = (v) => {
    if (v < 20) return Math.round(v);
    if (v < 100) return Math.round(v / 5) * 5;
    return Math.round(v / 10) * 10;
  };

  const PLURALI = { cucchiaino: "cucchiaini", cucchiaio: "cucchiai", pizzico: "pizzichi", uovo: "uova", limone: "limoni", arancia: "arance", filone: "filoni" };
  const FRAZIONABILI = ["cucchiaino", "cucchiaio", "pizzico"];

  // Uova, limoni e simili restano unità intere; cucchiaini e pizzichi vanno a mezze unità
  const arrotondaIng = (ing, v) => {
    if (ing.intero) return Math.max(1, Math.round(v));
    if (FRAZIONABILI.includes(ing.unita)) return Math.max(0.5, Math.round(v * 2) / 2);
    return arrotonda(v);
  };

  // Restituisce una mappa id -> { q, unita, prefisso } con le quantità scalate
  const scalaIngredienti = (ingredienti, fattore) => {
    const mappa = {};
    const righe = ingredienti.map((ing) => {
      if (ing.sotto) {
        const sotto = ing.sotto.map((s) => ({ ...s, q: arrotondaIng(s, s.q * fattore) }));
        sotto.forEach((s) => (mappa[s.id] = s));
        const riga = { ...ing, q: sotto.reduce((t, s) => t + s.q, 0), sotto };
        mappa[ing.id] = riga;
        return riga;
      }
      const riga = { ...ing, q: arrotondaIng(ing, ing.q * fattore), teorico: ing.q * fattore };
      mappa[ing.id] = riga;
      return riga;
    });
    return { righe, mappa };
  };

  const unitaDi = (ing) => {
    const u = ing.unita ?? "";
    return ing.q > 1 ? (ing.unitaPlurale ?? PLURALI[u] ?? u) : u;
  };
  const fmtQ = (ing) => {
    const u = unitaDi(ing);
    return `${nf(1).format(ing.q)}${u ? " " + u : ""}`;
  };
  const scostamento = (ing) =>
    ing.intero && ing.teorico && Math.abs(ing.q - ing.teorico) / ing.teorico > 0.15
      ? `Dose teorica: ${nf(1).format(ing.teorico)}; arrotondata a ${fmtQ(ing)}.`
      : "";

  /* ---------- Preferiti e lista della spesa (salvati sul telefono) ---------- */

  const CHIAVE_PREF = "ricettacolo:preferiti";
  const CHIAVE_SPESA = "ricettacolo:spesa";
  const preferiti = new Set((storage.get(CHIAVE_PREF) ?? []).filter((id) => ricette.some((r) => r.id === id)));
  let spesa = storage.get(CHIAVE_SPESA) ?? []; // [{ rid, titolo, dose, voci: [{ q, nome, fatto }] }]

  const salvaPreferiti = () => storage.set(CHIAVE_PREF, [...preferiti]);
  const salvaSpesa = () => { storage.set(CHIAVE_SPESA, spesa); aggiornaBadge(); };

  function aggiornaBadge() {
    const n = spesa.reduce((t, g) => t + g.voci.filter((v) => !v.fatto).length, 0);
    const b = document.getElementById("badgeSpesa");
    b.textContent = n > 99 ? "99+" : String(n);
    b.hidden = n === 0;
  }

  let timerToast;
  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(timerToast);
    timerToast = setTimeout(() => (t.hidden = true), 2800);
  }

  /* ---------- Installazione su Android ---------- */

  let richiestaInstalla = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    richiestaInstalla = e;
    mostraInstalla();
  });
  window.addEventListener("appinstalled", () => {
    richiestaInstalla = null;
    document.getElementById("installa")?.remove();
    toast("Ricettacolo è stato aggiunto alla schermata Home");
  });
  function mostraInstalla() {
    const box = document.getElementById("installa-box");
    if (!box || !richiestaInstalla) return;
    box.innerHTML = `
      <div class="installa" id="installa">
        <img src="icons/icon-192.png" alt="">
        <b>Installa Ricettacolo</b>
        <p>Si apre dalla schermata Home come un'app e funziona anche senza connessione.</p>
        <button type="button" class="btn">${ICONE.scarica}Installa l'app</button>
      </div>`;
    box.querySelector("button").addEventListener("click", async () => {
      richiestaInstalla.prompt();
      await richiestaInstalla.userChoice.catch(() => null);
      richiestaInstalla = null;
      box.innerHTML = "";
    });
  }

  /* ---------- Schermo sempre acceso mentre si cucina ---------- */

  let blocco = null;
  let vuoleSchermo = false;
  async function chiediSchermo() {
    try {
      blocco = await navigator.wakeLock.request("screen");
      blocco.addEventListener("release", () => (blocco = null));
    } catch {
      blocco = null;
    }
  }
  function rilasciaSchermo() {
    vuoleSchermo = false;
    blocco?.release().catch(() => {});
    blocco = null;
  }
  document.addEventListener("visibilitychange", () => {
    if (vuoleSchermo && document.visibilityState === "visible" && !blocco) chiediSchermo();
  });

  /* ---------- Elementi comuni ---------- */

  const metaRicetta = (r) =>
    [r.tempi?.preparazione, r.stampo && "Stampo " + descriviStampo(r.stampo), !r.stampo && r.porzioni && `${r.porzioni.n} ${r.porzioni.nome}`]
      .filter(Boolean).map(esc).join(" · ");

  const rigaRicetta = (r) => `
    <a class="riga" href="#/ricetta/${r.id}">
      <span class="testo">
        <span class="occhiello">${esc(r.sottocategoria ?? nomeCategoria(r.categoria))}</span>
        <b>${esc(r.titolo)}</b>
        ${r.descrizione ? `<span class="desc">${esc(r.descrizione)}</span>` : ""}
        <small>${metaRicetta(r)}</small>
      </span>
      <span class="fine">${preferiti.has(r.id) ? ICONE.stella.replace("<svg", '<svg class="stella"') : ""}${ICONE.freccia}</span>
    </a>`;

  /* ---------- Ricette ---------- */

  let filtro = { categoria: null, testo: "" };

  function renderHome() {
    document.title = "Ricettacolo";
    const conteggi = Object.fromEntries(categorie.map((c) => [c.id, ricette.filter((r) => r.categoria === c.id).length]));

    app.className = "wrap";
    app.innerHTML = `
      <header class="testa">
        <span class="occhiello">Il ricettario</span>
        <h1>Ricettacolo</h1>
        <p class="sottotitolo">${ricette.length} ${ricette.length === 1 ? "ricetta" : "ricette"} in ${categorie.length} categorie</p>
      </header>
      <div id="installa-box"></div>
      <label class="cerca">${ICONE.cerca}<input id="cerca" type="search" enterkeyhint="search" placeholder="Cerca per nome o ingrediente" value="${esc(filtro.testo)}" aria-label="Cerca ricette"></label>
      <nav class="chips" aria-label="Categorie">
        <button type="button" class="chip" data-cat="" aria-pressed="${!filtro.categoria}">Tutte</button>
        ${categorie.map((c) => `
          <button type="button" class="chip" data-cat="${c.id}" aria-pressed="${filtro.categoria === c.id}" ${conteggi[c.id] ? "" : "data-vuota"}>
            ${esc(c.nome)} <span class="conta">${conteggi[c.id]}</span>
          </button>`).join("")}
      </nav>
      <div id="elenco"></div>`;

    mostraInstalla();
    const cerca = app.querySelector("#cerca");
    cerca.addEventListener("input", () => { filtro.testo = cerca.value; renderElenco(); });
    cerca.addEventListener("keydown", (e) => { if (e.key === "Enter") cerca.blur(); });
    app.querySelectorAll(".chip").forEach((b) =>
      b.addEventListener("click", () => {
        filtro.categoria = b.dataset.cat || null;
        app.querySelectorAll(".chip").forEach((x) => x.setAttribute("aria-pressed", x === b));
        renderElenco();
      })
    );
    renderElenco();
  }

  function renderElenco() {
    const t = filtro.testo.trim().toLowerCase();
    const corrisponde = (r) => {
      if (filtro.categoria && r.categoria !== filtro.categoria) return false;
      if (!t) return true;
      const nomiIng = r.ingredienti.flatMap((i) => [i.nome, ...(i.sotto ?? []).map((s) => s.nome)]);
      return [r.titolo, r.sottocategoria, r.descrizione, ...nomiIng].join(" ").toLowerCase().includes(t);
    };

    const gruppi = categorie
      .map((c) => ({ c, lista: ricette.filter((r) => r.categoria === c.id && corrisponde(r)) }))
      .filter((g) => g.lista.length);

    const elenco = app.querySelector("#elenco");
    if (!gruppi.length) {
      elenco.innerHTML = `<div class="vuoto"><b>${filtro.categoria && !t ? "Nessuna ricetta in questa categoria, per ora." : "Nessuna ricetta trovata."}</b></div>`;
      return;
    }
    elenco.innerHTML = gruppi.map(({ c, lista }) => `
      <section class="gruppo">
        <h2>${esc(c.nome)}</h2>
        <div class="lista">${lista.map(rigaRicetta).join("")}</div>
      </section>`).join("");
  }

  /* ---------- Preferiti ---------- */

  function renderPreferiti() {
    document.title = "Preferiti — Ricettacolo";
    const lista = ricette.filter((r) => preferiti.has(r.id));
    app.className = "wrap";
    app.innerHTML = `
      <header class="testa">
        <span class="occhiello">Da rifare</span>
        <h1>Preferiti</h1>
      </header>
      ${lista.length
        ? `<section class="gruppo"><div class="lista">${lista.map(rigaRicetta).join("")}</div></section>`
        : `<div class="vuoto">${ICONE.stella}<b>Ancora nessun preferito</b><p>Apri una ricetta e tocca la stella in alto a destra: la ritroverai qui.</p></div>`}`;
  }

  /* ---------- Lista della spesa ---------- */

  const testoSpesa = () =>
    "Lista della spesa\n" +
    spesa.map((g) => `\n${g.titolo}${g.dose ? ` (${g.dose})` : ""}\n` +
      g.voci.filter((v) => !v.fatto).map((v) => `• ${v.q} ${v.nome}`).join("\n")).join("\n");

  function renderSpesa() {
    document.title = "Spesa — Ricettacolo";
    app.className = "wrap";
    if (!spesa.length) {
      app.innerHTML = `
        <header class="testa"><span class="occhiello">Da comprare</span><h1>Lista della spesa</h1></header>
        <div class="vuoto">${ICONE.carrello}<b>La lista è vuota</b><p>In ogni ricetta, sotto gli ingredienti, c'è il pulsante «Aggiungi alla spesa»: aggiunge le dosi già ricalcolate.</p></div>`;
      return;
    }
    app.innerHTML = `
      <header class="testa"><span class="occhiello">Da comprare</span><h1>Lista della spesa</h1>
        <p class="sottotitolo">Tocca una voce quando l'hai messa nel carrello.</p></header>
      ${spesa.map((g, gi) => `
        <section class="gruppo">
          <h2><a href="#/ricetta/${esc(g.rid)}">${esc(g.titolo)}${g.dose ? ` <small class="sottotitolo">· ${esc(g.dose)}</small>` : ""}</a>
            <button type="button" class="icona" data-rimuovi="${gi}" aria-label="Togli ${esc(g.titolo)} dalla lista">${ICONE.cestino}</button></h2>
          <ul class="lista spesa">
            ${g.voci.map((v, vi) => `
              <li><label class="voce ${v.fatto ? "fatto" : ""}">
                <input type="checkbox" data-g="${gi}" data-v="${vi}" ${v.fatto ? "checked" : ""}>
                <span class="q">${esc(v.q)}</span><span class="nome">${esc(v.nome)}</span>
              </label></li>`).join("")}
          </ul>
        </section>`).join("")}
      <div class="azioni">
        <button type="button" class="btn" id="condividi">${ICONE.condividi}Condividi</button>
        <button type="button" class="btn tonale" id="togliFatti">Togli le voci spuntate</button>
        <button type="button" class="btn testo" id="svuota">Svuota la lista</button>
      </div>`;

    app.querySelectorAll(".spesa input").forEach((c) =>
      c.addEventListener("change", () => {
        spesa[c.dataset.g].voci[c.dataset.v].fatto = c.checked;
        c.closest(".voce").classList.toggle("fatto", c.checked);
        salvaSpesa();
      })
    );
    app.querySelectorAll("[data-rimuovi]").forEach((b) =>
      b.addEventListener("click", () => { spesa.splice(Number(b.dataset.rimuovi), 1); salvaSpesa(); renderSpesa(); })
    );
    app.querySelector("#togliFatti").addEventListener("click", () => {
      spesa = spesa.map((g) => ({ ...g, voci: g.voci.filter((v) => !v.fatto) })).filter((g) => g.voci.length);
      salvaSpesa();
      renderSpesa();
    });
    app.querySelector("#svuota").addEventListener("click", () => {
      if (!confirm("Svuotare tutta la lista della spesa?")) return;
      spesa = [];
      salvaSpesa();
      renderSpesa();
    });
    app.querySelector("#condividi").addEventListener("click", async () => {
      const text = testoSpesa();
      if (navigator.share) {
        try { await navigator.share({ title: "Lista della spesa", text }); } catch {}
        return;
      }
      try { await navigator.clipboard.writeText(text); toast("Lista copiata: incollala dove vuoi"); }
      catch { toast("Condivisione non disponibile su questo dispositivo"); }
    });
  }

  /* ---------- Ricetta ---------- */

  function renderRicetta(r) {
    document.title = `${r.titolo} — Ricettacolo`;
    const chiaveStato = `ricettacolo:calc:${r.id}`;
    const salvato = storage.get(chiaveStato);
    const stato = salvato ?? {
      modo: r.stampo?.forma ?? "superficie",
      area: r.stampo ? Math.round(areaStampo(r.stampo) * 10) / 10 : "",
      diametro: r.stampo?.diametro ?? "",
      lunghezza: r.stampo?.lunghezza ?? "",
      larghezza: r.stampo?.larghezza ?? "",
      lato: r.stampo?.lato ?? "",
    };
    const spuntati = new Set();
    const passiFatti = new Set();
    const haPorzioni = !r.stampo && r.porzioni;
    const chiavePorz = `ricettacolo:porz:${r.id}`;
    let nPorz = haPorzioni ? (storage.get(chiavePorz) ?? r.porzioni.n) : null;
    let ultimeRighe = [];
    let doseAttuale = "";

    app.className = "wrap largo";
    app.innerHTML = `
      <div class="appbar">
        <button type="button" class="icona" id="indietro" aria-label="Indietro">${ICONE.indietro}</button>
        <span class="titolo">${esc(r.titolo)}</span>
        <button type="button" class="icona" id="preferito" aria-pressed="${preferiti.has(r.id)}" aria-label="Preferito">${ICONE.stella}</button>
      </div>
      <header class="titolo-ricetta">
        <span class="occhiello">${esc(nomeCategoria(r.categoria))}${r.sottocategoria ? " › " + esc(r.sottocategoria) : ""}</span>
        <h1>${esc(r.titolo)}</h1>
        ${r.descrizione ? `<p class="sottotitolo">${esc(r.descrizione)}</p>` : ""}
        <ul class="dati">
          ${r.tempi?.preparazione ? `<li><span>Preparazione</span>${esc(r.tempi.preparazione)}</li>` : ""}
          ${r.tempi?.riposo ? `<li><span>Riposo</span>${esc(r.tempi.riposo)}</li>` : ""}
          ${r.stampo ? `<li><span>Dosi originali</span>Stampo ${esc(descriviStampo(r.stampo))}</li>` : ""}
          ${haPorzioni ? `<li><span>Dosi originali</span>${r.porzioni.n} ${esc(r.porzioni.nome)}</li>` : ""}
        </ul>
      </header>

      <div class="impaginato">
        <aside class="colonna-laterale">
          ${r.stampo ? `
          <section class="riquadro calcolatore" aria-labelledby="calc-titolo">
            <h2 id="calc-titolo">Calcola le dosi</h2>
            <div class="segmenti" role="tablist" aria-label="Tipo di misura">
              ${[["superficie", "Superficie"], ["tonda", "Tonda"], ["rettangolare", "Rettang."], ["quadrata", "Quadrata"]]
                .map(([m, l]) => `<button type="button" role="tab" data-modo="${m}">${l}</button>`).join("")}
            </div>
            <div class="campi">
              <label data-per="superficie">Superficie <span class="campo"><input id="calc-area" inputmode="decimal" name="area"><em>cm²</em></span></label>
              <label data-per="tonda">Diametro <span class="campo"><input id="calc-diametro" inputmode="decimal" name="diametro"><em>cm</em></span></label>
              <label data-per="rettangolare">Lunghezza <span class="campo"><input id="calc-lunghezza" inputmode="decimal" name="lunghezza"><em>cm</em></span></label>
              <label data-per="rettangolare">Larghezza <span class="campo"><input id="calc-larghezza" inputmode="decimal" name="larghezza"><em>cm</em></span></label>
              <label data-per="quadrata">Lato <span class="campo"><input id="calc-lato" inputmode="decimal" name="lato"><em>cm</em></span></label>
            </div>
            <div class="esito" aria-live="polite"></div>
            <button class="btn testo ripristina" type="button">Ripristina dosi originali</button>
          </section>` : ""}

          ${haPorzioni ? `
          <section class="riquadro calcolatore" aria-labelledby="calc-titolo">
            <h2 id="calc-titolo">Calcola le dosi</h2>
            <label class="etichetta" for="calc-porz">Numero di ${esc(r.porzioni.nome)} da ottenere</label>
            <div class="passo-n">
              <button type="button" class="icona" data-delta="-1" aria-label="Uno in meno">−</button>
              <span class="campo"><input id="calc-porz" inputmode="numeric" name="porzioni"><em>${esc(r.porzioni.nome)}</em></span>
              <button type="button" class="icona" data-delta="1" aria-label="Uno in più">+</button>
            </div>
            <div class="esito" aria-live="polite"></div>
            <button class="btn testo ripristina" type="button">Ripristina dosi originali</button>
          </section>` : ""}

          <section class="riquadro">
            <h2>Ingredienti</h2>
            <ul class="ingredienti"></ul>
            <button type="button" class="btn tonale pieno" id="aggiungiSpesa">${ICONE.carrello}Aggiungi alla spesa</button>
          </section>
        </aside>

        <div class="colonna-principale">
          ${r.approfondimento ? `<details class="nota-tecnica"><summary>Perché funziona</summary><p>${esc(r.approfondimento)}</p></details>` : ""}
          <section class="procedimento">
            <div class="intesta">
              <h2>Procedimento</h2>
              ${"wakeLock" in navigator ? `<label class="interruttore"><input type="checkbox" role="switch" id="schermo"> Schermo sempre acceso</label>` : ""}
            </div>
            <p class="suggerimento">Tocca un passo quando l'hai fatto, così non perdi il segno.</p>
            <div id="fasi"></div>
          </section>
        </div>
      </div>`;

    const $ = (s) => app.querySelector(s);
    const ulIng = $(".ingredienti");
    const fasi = $("#fasi");

    const leggiNumero = (v) => {
      const n = parseFloat(String(v).replace(",", "."));
      return Number.isFinite(n) && n > 0 ? n : null;
    };

    function areaCorrente() {
      const n = (k) => leggiNumero(stato[k]);
      switch (stato.modo) {
        case "superficie": return n("area");
        case "tonda": return n("diametro") && areaStampo({ forma: "tonda", diametro: n("diametro") });
        case "rettangolare": return n("lunghezza") && n("larghezza") && n("lunghezza") * n("larghezza");
        case "quadrata": return n("lato") && n("lato") ** 2;
      }
      return null;
    }

    function aggiorna() {
      let fattore = 1;
      doseAttuale = "";
      if (r.stampo) {
        const base = areaStampo(r.stampo);
        const area = areaCorrente();
        const esito = $(".esito");
        if (area) {
          fattore = area / base;
          if (Math.abs(fattore - 1) > 0.005) doseAttuale = `stampo da ${nf(0).format(area)} cm²`;
          const avviso =
            fattore < 0.5 || fattore > 2
              ? `<p class="avviso">Scostamento ampio dallo stampo originale: le dosi mantengono la stessa altezza e lo stesso numero di strati, valuta se adattarli.</p>`
              : "";
          esito.innerHTML = `
            <div class="numeri">
              <div><span>Superficie</span><strong>${nf(1).format(area)} cm²</strong></div>
              <div><span>Fattore</span><strong>× ${fattore.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></div>
            </div>
            <p class="base">Riferimento: ${nf(1).format(base)} cm² (${esc(descriviStampo(r.stampo))})</p>${avviso}`;
        } else {
          esito.innerHTML = `<p class="avviso">Inserisci una misura valida: nel frattempo sono mostrate le dosi originali.</p>`;
        }
        app.querySelectorAll(".segmenti button").forEach((b) => b.setAttribute("aria-selected", b.dataset.modo === stato.modo));
        app.querySelectorAll(".campi label").forEach((l) => (l.hidden = l.dataset.per !== stato.modo));
        storage.set(chiaveStato, stato);
      }

      let pezzi = r.porzioni?.n;
      if (haPorzioni) {
        const esito = $(".esito");
        const n = leggiNumero(nPorz);
        if (n) {
          pezzi = Math.round(n);
          fattore = pezzi / r.porzioni.n;
          doseAttuale = `${pezzi} ${r.porzioni.nome}`;
          const avviso = fattore < 0.5 || fattore > 2
            ? `<p class="avviso">Scostamento ampio dalla dose originale: tempi di cottura e dimensioni dei pezzi possono richiedere aggiustamenti.</p>`
            : "";
          esito.innerHTML = `
            <div class="numeri">
              <div><span>${esc(r.porzioni.nome)}</span><strong>${nf(0).format(pezzi)}</strong></div>
              <div><span>Fattore</span><strong>× ${fattore.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></div>
            </div>
            <p class="base">Riferimento: ${r.porzioni.n} ${esc(r.porzioni.nome)}</p>${avviso}`;
        } else {
          esito.innerHTML = `<p class="avviso">Inserisci un numero valido: nel frattempo sono mostrate le dosi originali.</p>`;
        }
        storage.set(chiavePorz, nPorz);
      }

      const { righe, mappa } = scalaIngredienti(r.ingredienti, fattore);
      ultimeRighe = righe;
      if (r.porzioni) mappa.porzioni = { q: pezzi, unita: "" };
      (r.derivati ?? []).forEach((d) => (mappa[d.id] = { ...d, q: arrotonda(d.calcola(mappa)) }));

      ulIng.innerHTML = righe.map((i) => `
        <li>
          <label class="voce ${spuntati.has(i.id) ? "fatto" : ""}">
            <input type="checkbox" data-id="${i.id}" ${spuntati.has(i.id) ? "checked" : ""}>
            <span class="q">${fmtQ(i)}</span>
            <span class="nome">${esc(i.nome)}</span>
          </label>
          ${i.nota ? `<p class="nota">${esc(i.nota)}</p>` : ""}
          ${scostamento(i) ? `<p class="nota avviso">${esc(scostamento(i))}</p>` : ""}
          ${i.sotto ? `<ul class="sotto">${i.sotto.map((s) => `
            <li><span class="q">${s.prefisso ? esc(s.prefisso) + " " : ""}${fmtQ(s)}</span> <span class="nome">${esc(s.nome)}</span></li>`).join("")}
          </ul>` : ""}
        </li>`).join("");

      const conQuantita = (testo) =>
        esc(testo).replace(/\{([\w-]+)\}/g, (m, id) => {
          const ing = mappa[id];
          return ing ? `<strong class="q">${ing.prefisso ? esc(ing.prefisso) + " " : ""}${fmtQ(ing)}</strong>` : m;
        });

      fasi.innerHTML = r.procedimento.map((sez, n) => `
        <section class="fase">
          <h3><span class="num">${n + 1}</span>${esc(sez.titolo)}</h3>
          <ol>
            ${sez.passi.map((p, k) => `<li data-passo="${n}-${k}" class="${passiFatti.has(`${n}-${k}`) ? "fatto" : ""}"><span>${p.titolo ? `<strong>${esc(p.titolo)}.</strong> ` : ""}${conQuantita(p.testo)}</span></li>`).join("")}
          </ol>
        </section>`).join("");
    }

    ulIng.addEventListener("change", (e) => {
      const id = e.target.dataset.id;
      if (!id) return;
      e.target.checked ? spuntati.add(id) : spuntati.delete(id);
      e.target.closest(".voce").classList.toggle("fatto", e.target.checked);
    });

    fasi.addEventListener("click", (e) => {
      const li = e.target.closest("li[data-passo]");
      if (!li) return;
      const k = li.dataset.passo;
      passiFatti.has(k) ? passiFatti.delete(k) : passiFatti.add(k);
      li.classList.toggle("fatto", passiFatti.has(k));
    });

    if (r.stampo) {
      app.querySelectorAll(".campi input").forEach((inp) => {
        inp.value = String(stato[inp.name] ?? "").replace(".", ",");
        inp.addEventListener("input", () => { stato[inp.name] = inp.value; aggiorna(); });
      });
      app.querySelectorAll(".segmenti button").forEach((b) =>
        b.addEventListener("click", () => {
          stato.modo = b.dataset.modo;
          aggiorna();
          app.querySelector(`.campi label[data-per="${stato.modo}"] input`)?.focus();
        })
      );
      $(".ripristina").addEventListener("click", () => {
        const s = r.stampo;
        Object.assign(stato, {
          modo: s.forma,
          area: Math.round(areaStampo(s) * 10) / 10,
          diametro: s.diametro ?? "",
          lunghezza: s.lunghezza ?? "",
          larghezza: s.larghezza ?? "",
          lato: s.lato ?? "",
        });
        app.querySelectorAll(".campi input").forEach((inp) => (inp.value = String(stato[inp.name]).replace(".", ",")));
        aggiorna();
      });
    }

    if (haPorzioni) {
      const inp = $("#calc-porz");
      inp.value = String(nPorz ?? "");
      inp.addEventListener("input", () => { nPorz = inp.value; aggiorna(); });
      app.querySelectorAll("[data-delta]").forEach((b) =>
        b.addEventListener("click", () => {
          const attuale = Math.round(leggiNumero(nPorz) ?? r.porzioni.n);
          nPorz = Math.max(1, attuale + Number(b.dataset.delta));
          inp.value = String(nPorz);
          aggiorna();
        })
      );
      $(".ripristina").addEventListener("click", () => {
        nPorz = r.porzioni.n;
        inp.value = String(nPorz);
        aggiorna();
      });
    }

    $("#indietro").addEventListener("click", () => {
      if (navigazioni > 1) history.back();
      else location.hash = schedaOrigine === "ricette" ? "#/" : `#/${schedaOrigine}`;
    });

    const bPref = $("#preferito");
    bPref.addEventListener("click", () => {
      const ora = !preferiti.has(r.id);
      ora ? preferiti.add(r.id) : preferiti.delete(r.id);
      salvaPreferiti();
      bPref.setAttribute("aria-pressed", ora);
      toast(ora ? "Aggiunta ai preferiti" : "Tolta dai preferiti");
    });

    $("#aggiungiSpesa").addEventListener("click", () => {
      const voci = ultimeRighe.map((i) => ({ q: fmtQ(i), nome: i.nome, fatto: false }));
      const gruppo = { rid: r.id, titolo: r.titolo, dose: doseAttuale, voci };
      const i = spesa.findIndex((g) => g.rid === r.id);
      if (i >= 0) spesa[i] = gruppo; else spesa.push(gruppo);
      salvaSpesa();
      toast(i >= 0 ? "Lista della spesa aggiornata con le dosi attuali" : `${voci.length} ingredienti aggiunti alla spesa`);
    });

    const sw = $("#schermo");
    if (sw) {
      sw.addEventListener("change", async () => {
        if (sw.checked) {
          vuoleSchermo = true;
          await chiediSchermo();
          if (!blocco) { sw.checked = false; vuoleSchermo = false; toast("Il telefono non consente di tenere acceso lo schermo"); }
          else toast("Lo schermo resterà acceso finché sei in questa ricetta");
        } else rilasciaSchermo();
      });
    }

    aggiorna();
  }

  /* ---------- Navigazione ---------- */

  const schede = document.querySelectorAll(".navbar a");
  let schedaOrigine = "ricette";
  let navigazioni = 0;
  let chiaveCorrente = null;
  const scrollSalvati = {};

  const segnaScheda = (k) =>
    schede.forEach((a) => (a.dataset.tab === k ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));

  schede.forEach((a) =>
    a.addEventListener("click", (e) => {
      if (a.dataset.tab === chiaveCorrente) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    })
  );

  function route() {
    if (chiaveCorrente) scrollSalvati[chiaveCorrente] = window.scrollY;
    rilasciaSchermo();
    navigazioni++;
    const h = location.hash;
    const m = h.match(/^#\/ricetta\/([\w-]+)/);
    const r = m && ricette.find((x) => x.id === m[1]);
    if (r) {
      chiaveCorrente = "ricetta";
      segnaScheda(schedaOrigine);
      renderRicetta(r);
      window.scrollTo(0, 0);
      return;
    }
    const k = h === "#/preferiti" ? "preferiti" : h === "#/spesa" ? "spesa" : "ricette";
    schedaOrigine = chiaveCorrente = k;
    segnaScheda(k);
    ({ ricette: renderHome, preferiti: renderPreferiti, spesa: renderSpesa })[k]();
    window.scrollTo(0, scrollSalvati[k] ?? 0);
  }

  // Barra superiore della ricetta: prende colore quando si scorre
  window.addEventListener("scroll", () => {
    const bar = app.querySelector(".appbar");
    if (bar) bar.classList.toggle("ombra", window.scrollY > 40);
  }, { passive: true });

  window.addEventListener("hashchange", route);
  aggiornaBadge();
  route();
})();
