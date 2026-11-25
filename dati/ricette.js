/*
 * RICETTACOLO — archivio ricette
 * ------------------------------------------------------------------
 * Per aggiungere una ricetta: copia un oggetto dentro `ricette` e modificalo.
 *
 * Campi principali:
 *   id            identificativo unico, usato nell'indirizzo (#/ricetta/<id>)
 *   categoria     uno degli `id` presenti in `categorie`
 *   sottocategoria testo libero (es. "Torte fredde")
 *   stampo        stampo di riferimento delle dosi, usato dal calcolatore:
 *                   { forma: "tonda", diametro: 28 }
 *                   { forma: "rettangolare", lunghezza: 30, larghezza: 20 }
 *                   { forma: "quadrata", lato: 24 }
 *                 ometti `stampo` se la ricetta non va scalata per superficie
 *   ingredienti   { id, nome, q, unita, nota?, prefisso?, sotto?: [ ...stessa forma ] }
 *                 se c'è `sotto`, il totale è calcolato come somma delle voci interne
 *   derivati      facoltativo: quantità calcolate dalle dosi già scalate, usabili come {id}
 *                 { id, unita, prefisso?, calcola: (m) => m.<idIngrediente>.q + ... }
 *   procedimento  sezioni { titolo, passi: [ { titolo?, testo } ] }
 *                 nel testo, {id} viene sostituito dalla quantità scalata
 *                 dell'ingrediente con quell'id (es. "Scaldare {nutella} di crema")
 *   approfondimento  paragrafo facoltativo "Perché funziona"
 */

window.RICETTARIO = {
  categorie: [
    { id: "antipasti", nome: "Antipasti" },
    { id: "primi", nome: "Primi" },
    { id: "secondi", nome: "Secondi" },
    { id: "contorni", nome: "Contorni" },
    { id: "lievitati", nome: "Pane e lievitati" },
    { id: "dolci", nome: "Dolci" },
    { id: "basi", nome: "Basi e salse" },
  ],

  ricette: [
    {
      id: "torta-fredda-pan-di-stelle-nocciola",
      titolo: "Torta fredda Pan di Stelle a strati di mascarpone e Nutella",
      categoria: "dolci",
      sottocategoria: "Torte fredde",
      descrizione:
        "Tre strati di Pan di Stelle inzuppati, ciascuno coperto da una crema al mascarpone e da un velo di Nutella intiepidita. Copertura di biscotti spezzati a mano.",
      tempi: { preparazione: "45 min, più 3 pause da 10–15 min", riposo: "almeno 6–8 h in frigo, meglio 24 h" },
      stampo: { forma: "tonda", diametro: 28 },

      ingredienti: [
        { id: "mascarpone", nome: "Mascarpone", q: 750, unita: "g" },
        {
          id: "zucchero",
          nome: "Zucchero a velo",
          q: 120,
          unita: "g",
          nota: "Dose piena, da crema al mascarpone classica: il mascarpone non è addolcito dalla spalmabile. Setaccialo per evitare grumi.",
        },
        {
          id: "nutella",
          nome: "Crema spalmabile alle nocciole (Nutella)",
          q: 450,
          unita: "g",
          nota: "Va stesa in tre veli sottili, uno sopra ogni strato di crema.",
        },
        {
          id: "biscotti",
          nome: "Biscotti Pan di Stelle (totali)",
          unita: "g",
          sotto: [
            { id: "biscotti_base", nome: "per i 3 strati di base", q: 650, unita: "g", prefisso: "circa" },
            { id: "biscotti_top", nome: "per la copertura a pezzi", q: 100, unita: "g", prefisso: "circa" },
          ],
        },
        { id: "latte", nome: "Latte intero (per la bagna)", q: 300, unita: "ml" },
      ],

      derivati: [
        { id: "crema_totale", unita: "g", calcola: (m) => m.mascarpone.q + m.zucchero.q },
        { id: "crema_strato", unita: "g", prefisso: "circa", calcola: (m) => (m.mascarpone.q + m.zucchero.q) / 3 },
        { id: "nutella_strato", unita: "g", prefisso: "circa", calcola: (m) => m.nutella.q / 3 },
      ],

      approfondimento:
        "Tenere separate le due creme conserva il contrasto che dà carattere alla torta: il mascarpone, appena zuccherato, resta fresco e lattico e bilancia sia la Nutella sia il cacao dei biscotti, mentre mescolandoli il sapore si appiattisce su un'unica nota dolce di cioccolato. La pausa al freddo prima di ogni velo di Nutella e la spalmabile soltanto tiepida servono a non fondere la superficie del mascarpone: la Nutella si stende così su una base soda, senza mescolarsi, e in frigorifero rapprende in uno strato sottile e quasi fondente che separa nettamente gli strati al taglio.",

      procedimento: [
        {
          titolo: "Crema al mascarpone (a mano)",
          passi: [
            {
              titolo: "Ammorbidire il mascarpone",
              testo:
                "Prendi {mascarpone} di mascarpone direttamente dal frigorifero e mettilo in una ciotola capiente con {zucchero} di zucchero a velo setacciato. Usarlo freddo lo rende più stabile e riduce le pause successive.",
            },
            {
              titolo: "Lavorare la crema",
              testo:
                "Lavora con la frusta a mano, con movimenti circolari leggeri, per circa un minuto, finché lo zucchero non si è sciolto e la crema è liscia e lucida. Non insistere oltre e non usare le fruste elettriche: il mascarpone lavorato troppo a lungo si smonta e diventa granuloso.",
            },
            {
              titolo: "Sac à poche",
              testo:
                "Trasferisci la crema ({crema_totale}) in una sac à poche capiente con bocchetta liscia da 12–15 mm, oppure con la punta tagliata. Tra uno strato e l'altro rimetti la sac à poche in frigorifero, così la crema rimasta non si scalda durante il montaggio.",
            },
          ],
        },
        {
          titolo: "Assemblaggio a strati",
          passi: [
            { titolo: "Preparazione", testo: "Disponi l'anello dello stampo direttamente sul piatto da portata finale e versa {latte} di latte per la bagna in un contenitore largo e basso." },
            {
              titolo: "Inzuppamento",
              testo:
                "Immergi i biscotti Pan di Stelle nel latte a temperatura ambiente per 1,5 secondi (operazione rapida, dentro e fuori).",
            },
            {
              titolo: "Primo strato di biscotti",
              testo:
                "Copri il fondo dello stampo affiancando i biscotti e spezzandone qualcuno per colmare gli spazi lungo il bordo.",
            },
            {
              titolo: "Strato di mascarpone",
              testo:
                "Con la sac à poche distribuisci {crema_strato} di crema (un terzo del totale) con una spirale continua dal bordo verso il centro, poi livellala delicatamente con il dorso di un cucchiaio o con una spatola. La crema si deposita senza premere sui biscotti inzuppati, che restano al loro posto.",
            },
            {
              titolo: "Rassodare la crema",
              testo:
                "Metti la torta in congelatore per 10–15 minuti (oppure 20–30 minuti in frigorifero). Anche se il mascarpone esce freddo dal frigo, mentre lo lavori, lo stendi e resta a contatto con i biscotti bagnati si ammorbidisce, e la Nutella tiepida, scorrendoci sopra, lo trascinerebbe. Il criterio è il tatto: quando la superficie non si attacca più al dito, puoi procedere, anche prima del tempo indicato.",
            },
            {
              titolo: "Intiepidire la Nutella",
              testo:
                "Mentre la crema rassoda, scalda {nutella_strato} di Nutella nel microonde a potenza media per 15–20 secondi, mescolando a metà, oppure a bagnomaria. Deve diventare fluida ma restare appena tiepida, intorno ai 30 °C: provandola sul polso non deve sembrare calda.",
            },
            {
              titolo: "Velo di Nutella",
              testo:
                "Versa la Nutella al centro della crema rassodata e allargala verso il bordo con il dorso di un cucchiaio o con una spatola, senza premere e senza tornare troppe volte sullo stesso punto. Basta un velo sottile e uniforme, che arrivi fino all'anello.",
            },
            {
              titolo: "Secondo e terzo strato",
              testo:
                "Sopra il velo di Nutella disponi un nuovo strato di biscotti inzuppati, affiancati come il primo, e ripeti da capo: crema al mascarpone, pausa al freddo, velo di Nutella. Fai lo stesso una terza volta. Alla fine avrai tre strati completi, ciascuno composto da biscotti, mascarpone e Nutella (in tutto {biscotti_base} di biscotti), e la torta si chiude con l'ultimo velo di Nutella in superficie.",
            },
          ],
        },
        {
          titolo: "Maturazione in frigorifero",
          passi: [
            {
              testo:
                "Lascia la torta scoperta in frigorifero per 15 minuti, perché la Nutella in superficie rapprenda e non resti attaccata alla pellicola; poi coprila con pellicola per alimenti e lasciala a 4 °C per almeno 6–8 ore. Durante il riposo il mascarpone si compatta e i veli di Nutella diventano consistenti, garantendo una fetta a strati ben definiti.",
            },
            {
              titolo: "Preparazione il giorno prima",
              testo:
                "La torta si può preparare anche 24 ore prima, e anzi ci guadagna: i biscotti si ammorbidiscono in modo uniforme, i sapori si amalgamano e la fetta risulta più compatta. Si conserva bene fino a 48 ore, purché resti coperta e sempre in frigorifero. In questo caso tirala fuori 15–20 minuti prima di servirla, perché dopo un giorno di freddo i veli di Nutella diventano piuttosto duri; i biscotti spezzati vanno comunque aggiunti solo al momento.",
            },
          ],
        },
        {
          titolo: "Finitura e taglio",
          passi: [
            { testo: "Passa la lama di un coltello lungo il bordo interno e rimuovi delicatamente l'anello dello stampo." },
            {
              testo:
                "Spezza a mano {biscotti_top} di Pan di Stelle rimasti, ciascuno in 4–6 pezzi irregolari, lavorando sopra una ciotola. Non usare il mattarello né il mixer: questi biscotti sono friabili e si ridurrebbero in polvere. Conserva la poca polvere che si forma, ti servirà per chiudere gli spazi tra i pezzi.",
            },
            {
              testo:
                "Subito prima di servire distribuisci i pezzi di biscotto su tutta la superficie, con la parte delle stelline rivolta verso l'alto quando capita, e premili appena perché aderiscano alla Nutella; poi spolverizza la polvere negli spazi rimasti. Aggiungerli all'ultimo momento ne preserva la croccantezza.",
            },
            {
              titolo: "Taglio",
              testo:
                "Taglia con un coltello a lama liscia scaldato sotto l'acqua calda e asciugato, ripulendolo dopo ogni fetta: così i veli di Nutella si tagliano netti senza sbavare sul mascarpone.",
            },
          ],
        },
      ],
    },
  ],
};

/* Ricetta aggiunta dalla chat: va nell'elenco prima che parta l'app */
window.RICETTARIO.ricette.push({
  id: "panini-semola-lievito-secco",
  titolo: "Panini di Russello e 00 con lievito secco",
  categoria: "lievitati",
  sottocategoria: "Panini",
  porzioni: { n: 15, nome: "panini" },
  descrizione: "15 panini da circa 100 g: Russello al 70%, idratazione al 68%, autolisi e 16 ore di maturazione in frigo. Crosta croccante e dorata, mollica morbida e alveolata, profumo di grano duro antico.",
  tempi: { preparazione: "40 min di lavoro", riposo: "16 h in frigo + 2 h di appretto" },
  ingredienti: [
    { id: "semola", nome: "Farina di Russello Molini Riggi (grano duro antico, macinato a pietra)", q: 600, unita: "g", nota: "Debole (W 140, proteine 11-12%): da sola è pensata per impasti diretti di circa 4 ore e non reggerebbe la notte in frigo; per questo la affianca la 00 forte." },
    { id: "farina", nome: "Farina 00 forte", q: 260, unita: "g", nota: "Proteine almeno 12,5%, W 280-320: dà all’impasto l’ossatura che il Russello non ha e gli permette di reggere la maturazione in frigo. Una 00 debole da dolci non basterebbe." },
    {
      id: "acqua",
      nome: "Acqua fredda di frigo (totale)",
      unita: "g",
      sotto: [
        { id: "acqua_autolisi", nome: "per l'autolisi", q: 545, unita: "g" },
        { id: "acqua_lievito", nome: "per sciogliere il lievito", q: 20, unita: "g" },
        { id: "acqua_finale", nome: "da aggiungere alla fine, solo se serve", q: 20, unita: "g" }
      ]
    },
    { id: "sale", nome: "Sale fino", q: 20, unita: "g" },
    { id: "lievito", nome: "Lievito di birra secco", q: 2000, unita: "mg", nota: "Alla dose originale da 15 panini corrisponde a 2 g, circa due terzi di cucchiaino raso. Se dopo 16 ore l’impasto è cresciuto ben oltre i due terzi, la volta dopo riducilo di un terzo; se si è mosso appena, aumentalo di un terzo." },
    { id: "miele", nome: "di miele millefiori", q: 1, unita: "cucchiaino", nota: "Il grano duro libera pochi zuccheri dall’amido: un po’ di miele nutre il lievito e aiuta la crosta a dorarsi." }
  ],
  approfondimento: "Il Russello, grano duro antico siciliano macinato a pietra, ha un glutine abbondante ma debole (W 140): il molino lo consiglia per impasti diretti di circa 4 ore, e da solo non reggerebbe una lunga maturazione. La 00 forte, al 30%, gli fornisce l’ossatura necessaria; la permanenza in frigo scende comunque da 24 a 16 ore, perché in un impasto debole, e ricco di enzimi come quelli macinati a pietra, il glutine si degrada lentamente anche al freddo, e oltre una certa soglia i panini si allargherebbero invece di crescere. Il freddo resta prezioso: rallenta il lievito più degli enzimi, sicché l’impasto sviluppa aromi e zuccheri che rendono la crosta più dorata e croccante, e permette di dividere il lavoro in due giorni. L’autolisi lascia idratare il grano duro, che assorbe lentamente, prima che entri in gioco il lievito; le pieghe danno forza all’impasto senza stressarlo, così trattiene il gas durante la notte in frigo. L’acqua scende al 68%, sotto il limite del 70% indicato per il Russello, perché un pezzo da 100 g, senza il sostegno di un cestino, tende ad allargarsi invece di crescere in altezza. Il miele compensa la scarsa attività enzimatica del grano duro, che libera pochi zuccheri dall’amido, e favorisce la doratura. La crosta dipende soprattutto dalla superficie rovente su cui il panino viene appoggiato: su una teglia fredda cresce meno e ha il fondo pallido.",
  procedimento: [
    {
      titolo: "Giorno 1 — Impasto (circa 2 ore fra lavoro e attese)",
      passi: [
        { titolo: "Autolisi, all’inizio", testo: "Nella ciotola dell'impastatrice versa {semola} di Russello, {farina} di farina e {acqua_autolisi} d'acqua. Impasta a velocità bassa per circa 2 minuti, finché non resta farina asciutta: non serve un impasto liscio. Copri e lascia riposare 45 minuti." },
        { titolo: "Lievito e sale, dopo 45 minuti", testo: "Sciogli {lievito} di lievito e {miele} di miele in {acqua_lievito} d'acqua, versali sull'impasto e impasta a velocità bassa per 3-4 minuti. Aggiungi {sale} di sale e passa a velocità media per 8-10 minuti, finché l'impasto non si stacca dalle pareti. Se ti sembra ancora sodo, versa a filo gli ultimi {acqua_finale} d'acqua. A fine impastatura non deve superare i 24 °C." },
        { titolo: "Riposo con pieghe, appena finito di impastare", testo: "Trasferisci l'impasto in un contenitore leggermente unto e lascialo un'ora a temperatura ambiente. Ogni 20 minuti, tre volte in tutto, fai un giro di pieghe: con la mano bagnata tira un lembo verso l'alto e ripiegalo sopra l'impasto, ripetendo sui quattro lati. In quest'ora l'impasto cresce appena, ed è normale." },
        { titolo: "In frigo, dopo un’ora di riposo", testo: "Chiudi bene il contenitore e mettilo in frigo a circa 4 °C per 16 ore. Non aspettare che raddoppi: deve crescere lentamente al freddo, di solito fra la metà e i due terzi del volume iniziale. Con una farina debole come il Russello, un impasto già raddoppiato in frigo sarebbe troppo maturo e i panini si allargherebbero in cottura." }
      ]
    },
    {
      titolo: "Giorno 2 — Formatura e appretto",
      passi: [
        { titolo: "Divisione e pirlatura, dopo 16 ore di frigo", testo: "Rovescia l'impasto, ancora freddo, su un piano leggermente spolverato di semola e dividilo in pezzi da circa 100 g. Per ciascuno porta i bordi verso il centro, capovolgilo con la chiusura sotto e fallo ruotare sotto la mano a coppa, su un punto non infarinato, finché la superficie non è tesa e liscia. Per i filoncini, appiattisci il pezzo, arrotolalo su se stesso e sigilla bene la chiusura." },
        { titolo: "Teglie e appretto, appena formati i panini", testo: "Disponi i panini su due teglie con carta forno, chiusura in basso, distanziati di almeno 5 cm, e coprili con un canovaccio. Lascia la prima teglia a temperatura ambiente; tieni la seconda in frigo per 30 minuti e solo dopo lasciala fuori, così sarà pronta quando la prima esce dal forno. L'appretto dura circa 2 ore: i panini sono pronti quando sono quasi raddoppiati e, premuti con un dito, l'incavo risale lentamente." }
      ]
    },
    {
      titolo: "Cottura",
      passi: [
        { titolo: "Preriscaldamento, dopo circa un’ora e un quarto di appretto", testo: "Accendi il forno statico a 240 °C con una pietra refrattaria o una teglia rovesciata sul ripiano medio, così che sia caldo quando i panini della prima teglia avranno finito di lievitare. Lascialo scaldare almeno 45 minuti: la superficie su cui appoggi i panini deve essere rovente." },
        { titolo: "Prima teglia, dopo circa 2 ore di appretto", testo: "Spennella i panini con acqua in modo generoso, senza lasciare zone asciutte: l’acqua tiene umida la superficie nei primi minuti di cottura, così il panino ha il tempo di crescere prima che la crosta si indurisca. Incidili con una lametta e falli scivolare con tutta la carta sulla superficie calda. Cuoci 10 minuti a 240 °C, poi abbassa a 210 °C e prosegui per 10-12 minuti; negli ultimi 3 minuti tieni lo sportello socchiuso. Sono cotti quando sono bruno dorati e, battuti sul fondo, suonano vuoti." },
        { titolo: "Seconda teglia, appena sfornata la prima", testo: "Riporta il forno a 240 °C e aspetta qualche minuto, perché la pietra torni rovente; poi spennella i panini con acqua e ripeti la cottura nello stesso modo." },
        { titolo: "Raffreddamento", testo: "Lascia raffreddare i panini su una griglia per almeno mezz'ora prima di tagliarli. Se la crosta resta morbida, la volta dopo allunga di qualche minuto la fase a sportello socchiuso; se i panini si allargano troppo, rinuncia agli ultimi 20 g d'acqua." }
      ]
    }
  ]
});

/* Ricetta aggiunta dalla chat: variante dei panini con semola rimacinata e Caputo Saccorosso */
window.RICETTARIO.ricette.push({
  id: "panini-semola-saccorosso-lievito-secco",
  titolo: "Panini di semola rimacinata e Caputo Saccorosso con lievito secco",
  categoria: "lievitati",
  sottocategoria: "Panini",
  porzioni: { n: 15, nome: "panini" },
  descrizione: "Variante dei panini di Russello: 15 panini da circa 100 g con semola rimacinata al 70% e Caputo Saccorosso al 30%, idratazione al 70%, autolisi di un’ora e 16 ore di maturazione in frigo. Impasto più forte e prevedibile, panini più alti e regolari, mollica gialla e alveolata, crosta croccante; in cambio, meno profumo di grano antico.",
  tempi: { preparazione: "40 min di lavoro", riposo: "16 h in frigo + 2 h di appretto" },
  ingredienti: [
    { id: "semola", nome: "Semola rimacinata di grano duro", q: 600, unita: "g", nota: "Scegline una con almeno 11,5-12% di proteine in etichetta. Ha forza media (W intorno a 170-230) ma un glutine tenace, che resiste all’allungamento, e assorbe molta acqua perché la seconda macinazione rompe parte dei granuli d’amido: per questo l’idratazione sale al 70%." },
    { id: "farina", nome: "Farina 00 Caputo Saccorosso", q: 260, unita: "g", nota: "W 300-320 e glutine estensibile (P/L 0,5-0,6): corregge la tenacità della semola, così i panini crescono in altezza invece di restare stretti e compatti, e dà all’impasto una forza che regge con margine le 16 ore di frigo." },
    {
      id: "acqua",
      nome: "Acqua fredda di frigo (totale)",
      unita: "g",
      sotto: [
        { id: "acqua_autolisi", nome: "per l'autolisi", q: 560, unita: "g" },
        { id: "acqua_lievito", nome: "per sciogliere il lievito", q: 20, unita: "g" },
        { id: "acqua_finale", nome: "da aggiungere alla fine, se l'impasto è sodo", q: 20, unita: "g" }
      ]
    },
    { id: "sale", nome: "Sale fino", q: 20, unita: "g" },
    { id: "lievito", nome: "Lievito di birra secco", q: 2000, unita: "mg", nota: "Alla dose originale da 15 panini corrisponde a 2 g, circa due terzi di cucchiaino raso, come nella versione con il Russello. Se dopo 16 ore l’impasto è cresciuto ben oltre i due terzi, la volta dopo riducilo di un terzo; se si è mosso appena, aumentalo di un terzo." },
    { id: "miele", nome: "di miele millefiori", q: 1, unita: "cucchiaino", nota: "Il grano duro ha una bassa attività amilasica e libera pochi zuccheri dall’amido: il miele nutre il lievito durante la lunga maturazione e aiuta la crosta a dorarsi." }
  ],
  approfondimento: "Semola rimacinata e Russello sono entrambi grano duro, ma in impasto si comportano in modo diverso. La semola rimacinata comune ha una forza media, con W intorno a 170-230, e un glutine tenace, che resiste all’allungamento; la seconda macinazione, inoltre, rompe parte dei granuli d’amido, che così assorbono più acqua, sicché l’idratazione può salire dal 68 al 70% senza che l’impasto diventi molle. La Caputo Saccorosso, con W 300-320 e un rapporto P/L di 0,5-0,6, è invece forte ed estensibile: al 30% bilancia la tenacità della semola, perché i panini si sviluppino in volume invece di restare stretti e fitti, e porta la forza complessiva dell’impasto sopra quella della versione con il Russello, che è più debole e, macinato a pietra, più ricco di enzimi che degradano il glutine. Ne consegue che le 16 ore di frigo, per il Russello vicine al limite, qui restano ben dentro le possibilità dell’impasto; a parità di tempo e di temperatura, il lievito resta a 2 g. L’autolisi si allunga a un’ora, sia perché la semola assorbe l’acqua lentamente, sia perché il riposo rende più estensibile un glutine tenace. Il miele resta per la stessa ragione dell’altra versione: il grano duro libera pochi zuccheri dall’amido. Rispetto ai panini di Russello si guadagnano regolarità, volume e una maggiore tolleranza agli scarti di tempo; si perde parte del profumo del grano antico macinato a pietra, e la mollica, più gialla, tende a essere un poco più fitta. La crosta, come sempre, dipende soprattutto dalla superficie rovente su cui il panino viene appoggiato.",
  procedimento: [
    {
      titolo: "Giorno 1 — Impasto (circa 2 ore e un quarto fra lavoro e attese)",
      passi: [
        { titolo: "Autolisi, all’inizio", testo: "Nella ciotola dell'impastatrice versa {semola} di semola rimacinata, {farina} di Saccorosso e {acqua_autolisi} d'acqua. Impasta a velocità bassa per circa 2 minuti, finché non resta farina asciutta: non serve un impasto liscio. Copri e lascia riposare un’ora: la semola assorbe l’acqua lentamente, e il riposo ne ammorbidisce la tenacità." },
        { titolo: "Lievito e sale, dopo un’ora", testo: "Sciogli {lievito} di lievito e {miele} di miele in {acqua_lievito} d'acqua, versali sull'impasto e impasta a velocità bassa per 3-4 minuti. Aggiungi {sale} di sale e passa a velocità media per 8-10 minuti, finché l'impasto non si stacca dalle pareti e si avvolge al gancio. Rispetto a quello con il Russello risulterà più sodo e meno appiccicoso: se ti sembra duro, versa a filo gli ultimi {acqua_finale} d'acqua, aspettando che vengano assorbiti. A fine impastatura non deve superare i 24 °C." },
        { titolo: "Riposo con pieghe, appena finito di impastare", testo: "Trasferisci l'impasto in un contenitore leggermente unto e lascialo un'ora a temperatura ambiente. Ogni 20 minuti, tre volte in tutto, fai un giro di pieghe: con la mano bagnata tira un lembo verso l'alto e ripiegalo sopra l'impasto, ripetendo sui quattro lati. In quest'ora l'impasto cresce appena, ed è normale." },
        { titolo: "In frigo, dopo un’ora di riposo", testo: "Chiudi bene il contenitore e mettilo in frigo a circa 4 °C per 16 ore. Non aspettare che raddoppi: deve crescere lentamente al freddo, fra la metà e i due terzi del volume iniziale. A differenza di quello con il Russello, questo impasto tollera bene qualche ora di ritardo, se ti serve." }
      ]
    },
    {
      titolo: "Giorno 2 — Formatura e appretto",
      passi: [
        { titolo: "Divisione e pirlatura, dopo 16 ore di frigo", testo: "Rovescia l'impasto, ancora freddo, su un piano leggermente spolverato di semola e dividilo in pezzi da circa 100 g. Per ciascuno porta i bordi verso il centro, capovolgilo con la chiusura sotto e fallo ruotare sotto la mano a coppa, su un punto non infarinato, finché la superficie non è tesa e liscia. Per i filoncini, appiattisci il pezzo, arrotolalo su se stesso e sigilla bene la chiusura." },
        { titolo: "Teglie e appretto, appena formati i panini", testo: "Disponi i panini su due teglie con carta forno, chiusura in basso, distanziati di almeno 5 cm, e coprili con un canovaccio. Lascia la prima teglia a temperatura ambiente; tieni la seconda in frigo per 30 minuti e solo dopo lasciala fuori, così sarà pronta quando la prima esce dal forno. L'appretto dura circa 2 ore: i panini sono pronti quando sono quasi raddoppiati e, premuti con un dito, l'incavo risale lentamente." }
      ]
    },
    {
      titolo: "Cottura",
      passi: [
        { titolo: "Preriscaldamento, dopo circa un’ora e un quarto di appretto", testo: "Accendi il forno statico a 240 °C con una pietra refrattaria o una teglia rovesciata sul ripiano medio, così che sia caldo quando i panini della prima teglia avranno finito di lievitare. Lascialo scaldare almeno 45 minuti: la superficie su cui appoggi i panini deve essere rovente." },
        { titolo: "Prima teglia, dopo circa 2 ore di appretto", testo: "Spennella i panini con acqua in modo generoso, senza lasciare zone asciutte: l’acqua tiene umida la superficie nei primi minuti di cottura, così il panino ha il tempo di crescere prima che la crosta si indurisca. Incidili con una lametta e falli scivolare con tutta la carta sulla superficie calda. Cuoci 10 minuti a 240 °C, poi abbassa a 210 °C e prosegui per 10-12 minuti; negli ultimi 3 minuti tieni lo sportello socchiuso. Sono cotti quando sono bruno dorati e, battuti sul fondo, suonano vuoti." },
        { titolo: "Seconda teglia, appena sfornata la prima", testo: "Riporta il forno a 240 °C e aspetta qualche minuto, perché la pietra torni rovente; poi spennella i panini con acqua e ripeti la cottura nello stesso modo." },
        { titolo: "Raffreddamento e correzioni", testo: "Lascia raffreddare i panini su una griglia per almeno mezz'ora prima di tagliarli. Se la mollica risulta fitta e i panini bassi, la volta dopo usa anche gli ultimi 20 g d’acqua o allunga l’appretto di mezz’ora; se invece si allargano, rinuncia a quei 20 g. Se la crosta resta morbida, allunga di qualche minuto la fase a sportello socchiuso." }
      ]
    }
  ]
});

/* Ricetta aggiunta dalla chat: cantucci proteici */
window.RICETTARIO.ricette.push({
  id: "cantucci-proteici-yogurt-greco",
  titolo: "Cantucci proteici di Maiorca al burro, agrumi e mandorle",
  categoria: "dolci",
  sottocategoria: "Biscotti",
  porzioni: { n: 30, nome: "cantucci" },
  descrizione: "Circa 30 cantucci proteici a doppia cottura, friabili e asciutti fino al cuore, profumati di limone e arancia. Farina di grano antico Maiorca, whey, uova, burro, poco zucchero e mandorle tostate, senza yogurt né latte in polvere: l’impasto è quello di un vero cantuccio, non quello di un pane proteico. Peso totale dell’impasto: circa 580 g.",
  tempi: { preparazione: "30 min di lavoro + circa 1 h di forno", riposo: "1 h in frigo + 10 min fra le due cotture + 15 min a forno spento" },
  ingredienti: [
    { id: "burro", nome: "Burro non salato", q: 50, unita: "g", nota: "Si usa fuso e intiepidito. Il burro montato con lo zucchero, come nella frolla, separa le particelle di farina e rende il biscotto sabbioso; fuso, invece, le avvolge in modo uniforme e dà un morso croccante e compatto." },
    { id: "zucchero", nome: "Zucchero semolato", q: 40, unita: "g", nota: "Poco rispetto a un cantuccio classico, ma indispensabile: sciolto nelle uova, in cottura forma una matrice vitrea che lega le particelle di farina e proteine e fa spezzare il biscotto di netto invece di sfaldarlo in sabbia. Sotto i 30 g questo effetto si perde." },
    { id: "limone", nome: "solo la scorza grattugiata (circa 3 g a limone; sceglilo non trattato)", q: 1, unita: "limone", intero: true },
    { id: "arancia", nome: "solo la scorza grattugiata (circa 6 g ad arancia; sceglila non trattata)", q: 1, unita: "arancia", intero: true, nota: "Grattugia soltanto la parte colorata: quella bianca sottostante è amara." },
    { id: "uovo", nome: "di taglia media (circa 55 g senza guscio ciascuno), a temperatura ambiente", q: 3, unita: "uovo", intero: true, nota: "Sono l’unico liquido dell’impasto, come nei cantucci tradizionali, e le loro proteine legano le particelle. Se il cantuccio risultasse ancora sabbioso, la prima correzione da provare è un quarto uovo." },
    { id: "whey", nome: "Proteine whey concentrate, neutre o alla vaniglia, senza cacao", q: 60, unita: "g", nota: "Due misurini da circa 30 g. Meglio la whey concentrata dell’isolata, che in forno tende a dare un biscotto più gommoso; meglio anche neutra, perché molte versioni aromatizzate contengono sucralosio, che è preferibile non scaldare oltre i 120 °C. Va sciolta nelle uova, non mescolata a secco con la farina: idratata prima, non lascia granelli gessosi." },
    { id: "farina", nome: "Farina di grano tenero Maiorca tipo 1 (Molini Riggi)", q: 200, unita: "g", nota: "Grano antico siciliano macinato a pietra, debole (W intorno a 100): sviluppa poco glutine, sicché il cantuccio si spezza invece di resistere sotto i denti, e contiene meno crusca dell’integrale, il che riduce il rischio di sabbiosità. In alternativa va bene la Maiorca integrale, con qualche fibra in più: in quel caso l’impasto assorbe più liquido e può richiedere il cucchiaio di latte." },
    { id: "mandorle", nome: "Mandorle, tostate e spezzate grossolanamente", q: 50, unita: "g", nota: "Fra gli ingredienti sono la fonte principale di nichel." },
    { id: "lievito", nome: "di lievito per dolci (circa 4 g ciascuno)", q: 1, unita: "cucchiaino" },
    { id: "sale", nome: "di sale (circa 1 g ciascuno)", q: 1, unita: "pizzico" }
  ],
  derivati: [
    { id: "impasto_totale", unita: "g", prefisso: "circa", calcola: (m) => m.burro.q + m.zucchero.q + 3 * m.limone.q + 6 * m.arancia.q + 55 * m.uovo.q + m.whey.q + m.farina.q + m.mandorle.q + 4 * m.lievito.q + m.sale.q },
    { id: "n_filoni", unita: "filone", calcola: (m) => Math.max(1, Math.round(m.impasto_totale.q / 270)) },
    { id: "impasto_filone", unita: "g", prefisso: "circa", calcola: (m) => m.impasto_totale.q / m.n_filoni.q },
    { id: "fette_filone", unita: "", calcola: (m) => m.porzioni.q / m.n_filoni.q }
  ],
  approfondimento: "Un cantuccio riesce friabile senza essere sabbioso quando nell’impasto c’è poca acqua e una struttura continua tiene insieme le particelle di farina e proteine. La prima versione di questa ricetta mancava di entrambe le condizioni: lo yogurt greco portava oltre un etto d’acqua, che rendeva l’impasto simile a quello di un pane, mentre il latte in polvere, la whey mescolata a secco e la farina restavano particelle distinte, che in bocca si avvertivano come sabbia. Qui, come nei cantucci tradizionali, l’unico liquido sono le uova, e il latte in polvere è stato eliminato, perché era ridondante accanto alla whey e dava una consistenza gessosa. La whey viene sciolta nelle uova prima di incontrare la farina, sicché si idrata completamente, e il riposo di un’ora in frigo dà alla crusca il tempo di ammorbidirsi. Lo zucchero, pur restando poco, circa un quindicesimo dell’impasto contro quasi un quarto nei cantucci classici, si scioglie nelle uova e in cottura diventa una matrice vitrea che lega le particelle e fa spezzare il biscotto di netto. Il burro è fuso e non montato: montato con lo zucchero, come nella frolla, separerebbe le particelle e renderebbe il cantuccio proprio sabbioso, mentre fuso le avvolge in modo uniforme e dà un morso croccante. La farina consigliata è la Maiorca tipo 1 di Molini Riggi, un grano tenero antico siciliano macinato a pietra: essendo debole, sviluppa poco glutine e lascia il biscotto friabile, e contenendo meno crusca dell’integrale riduce il rischio di sabbiosità; la versione integrale resta possibile, a prezzo di un impasto più assetato e di qualche granello in più. La whey resta a 60 g, poco meno di un quarto delle polveri: oltre un terzo i prodotti da forno proteici tendono a diventare gommosi. Le scorze strofinate nello zucchero cedono i loro oli essenziali, che il grasso trattiene durante la cottura. Infine la seconda cottura si chiude a forno spento: il calore residuo asciuga il cuore delle fette senza colorirle né indurire ulteriormente la whey. Se il cantuccio risultasse ancora sabbioso, la prima correzione da provare è un quarto uovo, le cui proteine legano le particelle; se invece fosse ben riuscito, la prova successiva sarà aumentare la whey di 10-20 g, per recuperare le proteine perse rispetto alla prima versione, circa 3,4 g a cantuccio contro 4. Quanto al nichel, si stimano 3-6 µg a cantuccio. I cantucci finiti pesano in tutto circa 430 g, cioè circa 14 g ciascuno. Valori indicativi per cantuccio: circa 67 kcal, 3,4 g di proteine, 6,3 g di carboidrati (di cui 1,6 g di zuccheri), 3 g di grassi (di cui 1,2 g saturi), 0,5 g di fibre (0,8 g con la farina integrale) e 0,1 g di sale; dodici cantucci forniscono circa 800 kcal e 41 g di proteine.",
  procedimento: [
    {
      titolo: "Impasto",
      passi: [
        { titolo: "Un’ora prima", testo: "Tira fuori dal frigo {uovo}: a temperatura ambiente sciolgono meglio zucchero e whey e non fanno rapprendere il burro fuso in grumi." },
        { titolo: "Mandorle", testo: "Accendi il forno statico a 170 °C. Quando è caldo, distribuisci {mandorle} di mandorle intere su una teglia e tostale per 7-8 minuti, finché profumano e, spezzandone una, l’interno risulta appena dorato. Lasciale raffreddare su un piatto, poi spezzale grossolanamente al coltello, in due o tre pezzi ciascuna. Spegni il forno: lo riaccenderai durante il riposo dell’impasto." },
        { titolo: "Burro fuso", testo: "Sciogli {burro} di burro a fuoco bassissimo, o al microonde a brevi intervalli, senza farlo bollire né colorire, e lascialo intiepidire finché è appena tiepido al tatto: caldo cuocerebbe le uova." },
        { titolo: "Zucchero agli agrumi", testo: "In una ciotola di vetro versa {zucchero} di zucchero e grattugiaci sopra la scorza di {limone} e di {arancia}, soltanto la parte colorata. Strofina scorze e zucchero fra le dita per un minuto, finché lo zucchero diventa umido e profumato: i granelli lacerano le cellule della buccia e ne liberano gli oli essenziali." },
        { titolo: "Uova e whey", testo: "Aggiungi le uova allo zucchero aromatizzato e sbattile con una frusta a mano per un paio di minuti, finché lo zucchero è quasi sciolto e il composto appena spumoso. Unisci {whey} di whey a cucchiaiate, frustando dopo ognuna finché non restano grumi: otterrai una crema densa e liscia. Lasciala riposare 5 minuti, perché le proteine finiscano di idratarsi, poi versa il burro fuso a filo, mescolando finché non si è legato del tutto." },
        { titolo: "Farina", testo: "In un’altra ciotola mescola con una frusta {farina} di farina, {lievito} di lievito e {sale} di sale, così che il lievito si distribuisca in modo uniforme. Versa la farina nella crema in due volte e incorporala con una spatola, poi impasta con le mani solo il tempo necessario perché non resti farina asciutta: lavorare a lungo sviluppa il glutine e indurisce il biscotto. Alla fine incorpora le mandorle. Appena fatto, l’impasto è morbido e un po’ untuoso, ed è normale: il burro rassoderà in frigo. Se invece resta sbriciolato e non si lega, aggiungi un cucchiaio di latte; se attacca alle mani, non aggiungere farina." },
        { titolo: "Riposo in frigo", testo: "Avvolgi l’impasto nella pellicola e mettilo in frigo per un’ora. Il burro si rapprende e l’impasto si modella senza attaccare, mentre la crusca della farina si ammorbidisce: è uno dei passaggi che evitano la sabbiosità, perciò non accorciarlo. Negli ultimi 15 minuti riaccendi il forno statico a 170 °C e fodera la teglia con carta forno." },
        { titolo: "Filoni", testo: "Otterrai {impasto_totale} di impasto. Con le mani appena infarinate forma {n_filoni} da {impasto_filone} ciascuno, larghi 5-6 cm e alti circa 2 cm, e disponili sulla teglia ben distanziati, perché in cottura si allargano un poco. Filoni bassi danno fette meno spesse al centro, che si asciugano in modo uniforme." }
      ]
    },
    {
      titolo: "Prima cottura",
      passi: [
        { titolo: "Cottura dei filoni", testo: "Cuoci i filoni a 170 °C per 22-25 minuti, finché la superficie è dorata chiara e, premendoli al centro con un dito, risultano sodi. Non devono scurirsi: completeranno la cottura nella seconda fase." },
        { titolo: "Intiepidimento", testo: "Sforna e lascia intiepidire i filoni sulla teglia per 10 minuti: da caldi si sbriciolerebbero sotto la lama, da freddi si spezzerebbero. Intanto abbassa il forno a 140 °C, lasciando lo sportello socchiuso per un minuto se vuoi che la temperatura scenda più in fretta." }
      ]
    },
    {
      titolo: "Seconda cottura",
      passi: [
        { titolo: "Taglio", testo: "Con un coltello seghettato taglia i filoni in obliquo in fette di circa un centimetro e mezzo: ne verranno circa {porzioni}. Se una mandorla fa resistenza, premi la lama dall’alto invece di segare. Disponi le fette distese sulla teglia, una accanto all’altra." },
        { titolo: "Asciugatura", testo: "Cuoci a 140 °C per 20 minuti, girando le fette a metà cottura, finché sono appena dorate su entrambi i lati. Se le fette richiedono due teglie, cuocile insieme con il forno ventilato a 130 °C, scambiando le teglie a metà cottura." },
        { titolo: "A forno spento", testo: "Spegni il forno, apri lo sportello di un paio di centimetri, bloccandolo con il manico di un cucchiaio di legno, e lascia i cantucci dentro per 15 minuti. Il calore residuo, che cala lentamente, asciuga il cuore delle fette senza colorirle e senza indurire la whey: è il passaggio che evita il centro pastoso." },
        { titolo: "Raffreddamento e prova", testo: "Lascia raffreddare i cantucci completamente su una griglia, perché diventano croccanti solo da freddi. Poi spezzane uno: deve rompersi di netto, con il centro asciutto e friabile. Se il cuore è ancora elastico, rimettili a 140 °C per altri 5 minuti e ripeti la prova a forno spento. Conservali in un barattolo di vetro ben chiuso, al riparo dall’umidità, fino a due settimane; se perdono croccantezza, bastano 5 minuti a 140 °C per ravvivarli." }
      ]
    }
  ]
});

/* Ricetta aggiunta dalla chat: variante dei cantucci proteici con semola rimacinata */
window.RICETTARIO.ricette.push({
  id: "cantucci-proteici-semola",
  titolo: "Cantucci proteici di semola rimacinata allo yogurt greco e mandorle",
  categoria: "dolci",
  sottocategoria: "Biscotti",
  porzioni: { n: 30, nome: "cantucci" },
  descrizione: "Variante della prima versione dei cantucci proteici integrali, quella con olio, yogurt greco e latte in polvere, con la semola rimacinata di grano duro al posto della farina integrale. Per un cantuccio più friabile e meno stopposo è preferibile la versione aggiornata, al burro e agli agrumi. Il cantuccio viene più dorato, dal sapore leggermente dolce e dallo scrocchio più netto. Circa 30 cantucci; peso totale dell’impasto circa 650 g.",
  tempi: { preparazione: "25 min di lavoro + circa 1 h di forno", riposo: "15 min per l’impasto + 10 min fra le due cotture" },
  ingredienti: [
    { id: "olio", nome: "Olio extravergine d’oliva dal fruttato leggero", q: 35, unita: "g", nota: "Un olio molto amaro o piccante coprirebbe vaniglia e limone. La dose è più alta del solito per compensare l’effetto asciugante della whey." },
    { id: "zucchero", nome: "Zucchero", q: 10, unita: "g" },
    { id: "uovo", nome: "di taglia media (circa 55 g senza guscio ciascuno)", q: 2, unita: "uovo", intero: true },
    { id: "yogurt", nome: "Yogurt greco bianco intero o al 2%", q: 150, unita: "g", nota: "Un vasetto standard pesa 150 g. Va bene anche magro." },
    { id: "limone", nome: "solo la scorza grattugiata (circa 3 g a limone; sceglilo non trattato)", q: 1, unita: "limone", intero: true },
    { id: "whey", nome: "Proteine whey neutre o alla vaniglia, senza cacao", q: 60, unita: "g", nota: "Due misurini da circa 30 g. Meglio neutre: molte versioni aromatizzate contengono sucralosio, che è preferibile non scaldare oltre i 120 °C." },
    { id: "latte_polvere", nome: "Latte scremato in polvere", q: 40, unita: "g" },
    { id: "farina", nome: "Semola rimacinata di grano duro", q: 190, unita: "g", nota: "Se dopo il riposo l’impasto attacca ancora, aggiungine fino a 2 cucchiai. Variante facoltativa: puoi sostituirne 40 g con farina di soia, guadagnando circa 10 g di proteine nell’intera infornata, a costo di un sapore più marcato, di un colore più scuro e del fatto che la soia è fra gli alimenti più ricchi di nichel." },
    { id: "mandorle", nome: "Mandorle, tostate e tritate grossolanamente", q: 50, unita: "g" },
    { id: "lievito", nome: "di lievito per dolci (circa 4 g ciascuno)", q: 1, unita: "cucchiaino" },
    { id: "sale", nome: "di sale (circa 1 g ciascuno)", q: 1, unita: "pizzico" }
  ],
  derivati: [
    { id: "impasto_totale", unita: "g", prefisso: "circa", calcola: (m) => m.olio.q + m.zucchero.q + 55 * m.uovo.q + m.yogurt.q + 3 * m.limone.q + m.whey.q + m.latte_polvere.q + m.farina.q + m.mandorle.q + 4 * m.lievito.q + m.sale.q },
    { id: "n_filoni", unita: "filone", calcola: (m) => Math.max(1, Math.round(m.impasto_totale.q / 270)) },
    { id: "impasto_filone", unita: "g", prefisso: "circa", calcola: (m) => m.impasto_totale.q / m.n_filoni.q }
  ],
  approfondimento: "La semola rimacinata ha un contenuto proteico simile a quello della farina integrale, ma è raffinata: contiene circa un terzo delle fibre e ha un indice glicemico un po’ più alto, mentre il suo glutine, più tenace che elastico, dà al cantuccio asciutto uno scrocchio più netto e quasi vitreo. Assorbe però l’acqua più lentamente della farina di grano tenero: per questo l’impasto riposa un quarto d’ora prima di formare i filoni, e appena impastato può sembrare più molle di quanto sarà dopo. La farina di soia, invece, non può sostituire da sola la farina integrale: non contiene glutine, assorbe molta acqua, colora in fretta e ha un sapore deciso, sicché usata in quantità renderebbe il cantuccio duro e scuro; entro il 20% delle farine, come nella variante facoltativa indicata fra gli ingredienti, aumenta le proteine senza compromettere la struttura. Per il resto valgono le regole della versione integrale: la doppia cottura asciuga il biscotto senza bisogno di zucchero, l’uovo in più e l’olio compensano l’effetto asciugante della whey, e la seconda cottura a bassa temperatura evita che il cantuccio diventi troppo duro. Quanto al nichel, con la semola si stimano 2-4 µg a cantuccio. Valori indicativi per cantuccio: circa 66 kcal, 4 g di proteine, 6,1 g di carboidrati (di cui 1,5 g di zuccheri), 2,7 g di grassi (di cui 0,5 g saturi), 0,4 g di fibre e 0,1 g di sale; dodici cantucci forniscono circa 790 kcal e 49 g di proteine.",
  procedimento: [
    {
      titolo: "Impasto",
      passi: [
        { titolo: "Forno e mandorle", testo: "Accendi il forno statico a 170 °C. Quando è caldo, distribuisci {mandorle} di mandorle intere su una teglia e tostale per 7-8 minuti, finché profumano e, spezzandone una, l’interno risulta appena dorato. Lasciale raffreddare su un piatto, perché da calde si sbriciolerebbero, poi tritale grossolanamente al coltello. Fodera la stessa teglia con carta forno: ti servirà per i filoni." },
        { titolo: "Base umida", testo: "In una ciotola di vetro sbatti {uovo} con {zucchero} di zucchero per circa un minuto, finché il composto diventa leggermente spumoso. Incorpora {yogurt} di yogurt greco, poi {olio} di olio versato a filo mentre continui a mescolare, così che si leghi alla crema invece di separarsi, e infine la scorza grattugiata di {limone}." },
        { titolo: "Polveri", testo: "In un’altra ciotola mescola con una frusta {farina} di semola rimacinata, {whey} di whey, {latte_polvere} di latte in polvere, {lievito} di lievito e {sale} di sale, in modo che lievito e polveri proteiche si distribuiscano in modo uniforme e non formino grumi." },
        { titolo: "Unione", testo: "Versa le polveri nella crema e mescola prima con un cucchiaio, poi impasta brevemente con le mani per un minuto o due, giusto il tempo di ottenere un impasto omogeneo: lavorarlo troppo renderebbe il cantuccio duro. Alla fine incorpora le mandorle tritate, distribuendole in modo uniforme." },
        { titolo: "Riposo", testo: "Copri la ciotola e lascia riposare l’impasto per 15 minuti a temperatura ambiente. In questo tempo la semola assorbe l’umidità e l’impasto, che all’inizio può sembrare troppo morbido, diventa più sodo e lavorabile. Solo se dopo il riposo attacca ancora alle mani, aggiungi semola un cucchiaio alla volta, fino a un massimo di due." },
        { titolo: "Filoni", testo: "Otterrai {impasto_totale} di impasto. Con le mani leggermente infarinate di semola forma {n_filoni} da {impasto_filone} ciascuno, alti un paio di centimetri, e disponili sulla teglia ben distanziati, perché in cottura si allargano un poco." }
      ]
    },
    {
      titolo: "Prima cottura",
      passi: [
        { titolo: "Cottura dei filoni", testo: "Cuoci i filoni a 170 °C per circa 25 minuti, finché la superficie è dorata e, premendoli al centro con un dito, risultano sodi. La semola dà un colore più giallo e dorato della farina integrale: valuta la cottura al tatto più che al colore." },
        { titolo: "Intiepidimento", testo: "Sforna e lascia intiepidire i filoni sulla teglia per 10 minuti, così che si possano affettare senza sbriciolarsi; intanto abbassa il forno a 140 °C, lasciando lo sportello socchiuso per un minuto se vuoi che la temperatura scenda più in fretta." }
      ]
    },
    {
      titolo: "Seconda cottura",
      passi: [
        { titolo: "Taglio", testo: "Con un coltello seghettato taglia i filoni in obliquo, a occhio, in fette di circa un centimetro e mezzo: ne verranno circa {porzioni}. Se una mandorla fa resistenza, premi la lama dall’alto invece di segare. Disponi le fette distese sulla teglia, una accanto all’altra." },
        { titolo: "Asciugatura", testo: "Cuoci a 140 °C per 20-25 minuti, girando le fette a metà cottura, finché sono asciutte e appena dorate su entrambi i lati. Non prolungare oltre il necessario: la whey colora e indurisce in fretta, ed è questa la fase in cui il biscotto rischia di diventare troppo secco. Se le fette richiedono due teglie, cuocile insieme con il forno ventilato a 130 °C, scambiando le teglie a metà cottura." },
        { titolo: "Raffreddamento e prova", testo: "Lascia raffreddare i cantucci completamente su una griglia, perché diventano croccanti solo da freddi. Poi spezzane uno: se il cuore è ancora elastico, rimettili a 140 °C per altri 5 minuti e ripeti la prova. Conservali in un barattolo di vetro ben chiuso, al riparo dall’umidità, fino a due settimane." }
      ]
    }
  ]
});

/* Ricetta aggiunta dalla chat: carbonara con uova intere */
window.RICETTARIO.ricette.push({
  id: "carbonara-uova-intere",
  titolo: "Carbonara con uova intere",
  categoria: "primi",
  sottocategoria: "Pasta",
  porzioni: { n: 4, nome: "porzioni" },
  descrizione: "La carbonara romana nella versione con sole uova intere: niente albumi avanzati, crema sostenuta da un po' più di pecorino. Senza panna, aglio o cipolla.",
  tempi: { preparazione: "20 min", riposo: "nessuno" },
  ingredienti: [
    { id: "pasta", nome: "Spaghetti (o rigatoni)", q: 400, unita: "g" },
    { id: "guanciale", nome: "Guanciale", q: 150, unita: "g", nota: "In mancanza, pancetta tesa non affumicata: il sapore è meno dolce e meno aromatico." },
    { id: "uova", nome: "di taglia media, a temperatura ambiente (circa 55 g senza guscio ciascuno)", q: 4, unita: "uovo", intero: true },
    { id: "pecorino", nome: "Pecorino romano grattugiato fine", q: 120, unita: "g", nota: "Più abbondante che nella versione con i soli tuorli: serve a dare corpo alla crema, che con l'albume resta più fluida." },
    { id: "pepe", nome: "di pepe nero macinato al momento", q: 1, unita: "cucchiaino" },
    { id: "sale", nome: "di sale grosso per l'acqua", q: 1, unita: "cucchiaio" },
    { id: "acqua_cottura", nome: "Acqua di cottura della pasta, da mettere da parte prima di scolare", q: 150, unita: "ml", nota: "Un mestolo scarso. Non va aggiunta tutta: serve per regolare la densità della crema, dunque se ne usa quanta ne occorre." }
  ],
  approfondimento: "La crema della carbonara è un'emulsione fra il grasso del guanciale, l'amido dell'acqua di cottura e la proteina dell'uovo: tiene finché la temperatura resta sotto i 70 °C circa, oltre i quali l'uovo coagula e si separa in grumi. L'albume contiene proteine che si rapprendono prima di quelle del tuorlo e porta con sé molta più acqua, sicché la versione con le uova intere è insieme più fragile al calore e più liquida di quella con i soli tuorli; da qui le due correzioni, ossia la pausa più lunga a fuoco spento e il pecorino aumentato di un quinto, che restituisce densità senza alterare il sapore. Il guanciale va avviato in padella fredda perché il grasso fonda lentamente prima che la parte magra si asciughi: buttato in padella già calda, diventa duro fuori e crudo dentro.",
  procedimento: [
    {
      titolo: "Preparazione",
      passi: [
        { titolo: "Acqua", testo: "Metti sul fuoco una pentola capiente con circa quattro litri d'acqua e, quando bolle, aggiungi {sale} di sale grosso: una dose volutamente scarsa, perché pecorino e guanciale sono già molto sapidi e il condimento finirà per salare la pasta una seconda volta." },
        { titolo: "Guanciale", testo: "Prendi {guanciale} di guanciale, eliminane la cotenna e taglialo prima a fette spesse mezzo centimetro, poi a listarelle della stessa larghezza. Mettilo in una padella ampia ancora fredda, senza aggiungere né olio né burro, e solo allora accendi a fuoco medio-basso: partendo da freddo il grasso ha il tempo di sciogliersi prima che la parte magra si asciughi. In 8-10 minuti il grasso diventa trasparente e le listarelle croccanti all'esterno ma ancora morbide dentro; a quel punto spegni, raccogli il guanciale in un piattino e lascia tutto il grasso fuso nella padella, perché è lì che sta metà del sapore del piatto." },
        { titolo: "Crema", testo: "In una ciotola capiente rompi le {uova} e sbattile con una forchetta; unisci {pecorino} di pecorino romano grattugiato fine e {pepe} di pepe nero macinato al momento, quindi lavora finché non ottieni una crema densa, omogenea e senza grumi di formaggio. Grattugia il pecorino il più finemente possibile, perché i granuli grossi non si sciolgono nel breve tempo della mantecatura e restano in bocca." }
      ]
    },
    {
      titolo: "Cottura e mantecatura",
      passi: [
        { titolo: "Pasta", testo: "Cala i {pasta} di spaghetti e cuocili un minuto in meno rispetto al tempo indicato sulla confezione, perché finiranno di cuocere in padella. Un paio di minuti prima di scolarli, preleva con un mestolo {acqua_cottura} di acqua di cottura e tienila da parte: è ricca di amido e servirà a legare la crema." },
        { titolo: "Stemperare la crema", testo: "Versa due cucchiai dell'acqua messa da parte, ancora bollente, nella ciotola delle uova mescolando senza fermarti. Questo passaggio, che molte ricette omettono, scalda la crema in modo graduale e la rende assai meno sensibile al calore della padella: è la precauzione più utile quando si usano uova intere." },
        { titolo: "Salto", testo: "Scola gli spaghetti e versali nella padella del guanciale, dove è rimasto il grasso fuso; saltali a fuoco vivo per una trentina di secondi, così che si insaporiscano e cedano amido al condimento." },
        { titolo: "Mantecatura", testo: "Spegni il fuoco, sposta la padella dal fornello e aspetta un minuto buono, finché il fondo non è soltanto tiepido: l'albume coagula a temperatura più bassa del tuorlo, sicché una padella ancora rovente trasformerebbe la crema in frittata. Versa allora la crema sulla pasta e mescola con energia per una ventina di secondi, allungando con l'acqua di cottura rimasta un cucchiaio alla volta, finché la salsa non vela gli spaghetti e risulta lucida e scorrevole. Unisci da ultimo il guanciale tenuto da parte, serbandone qualche pezzo per la decorazione." }
      ]
    },
    {
      titolo: "Servizio e rimedi",
      passi: [
        { titolo: "In tavola", testo: "Impiatta subito, con il guanciale croccante in superficie, un'ultima grattugiata di pecorino e una macinata di pepe. La carbonara non ammette attese: raffreddandosi la crema si rapprende e la pasta la assorbe, perdendo la scorrevolezza che la definisce." },
        { titolo: "Crema troppo liquida", testo: "Rimetti la padella sul fuoco al minimo per cinque o dieci secondi, mescolando senza sosta e togliendola appena la salsa si addensa; in alternativa, e con meno rischio, aggiungi una manciata di pecorino, che addensa a freddo." },
        { titolo: "Crema impazzita", testo: "Se si è già formato il grumo non c'è rimedio, giacché la proteina coagulata non torna fluida. La volta successiva attendi di più prima di unire le uova e non saltare il passaggio in cui la crema viene stemperata con l'acqua bollente." }
      ]
    }
  ]
});

/* Ricetta aggiunta dalla chat: hamburger di vitello con provola fresca */
window.RICETTARIO.ricette.push({
  id: "hamburger-vitello-provola",
  titolo: "Hamburger di vitello con provola fresca, pancetta croccante e salsa allo yogurt",
  categoria: "secondi",
  sottocategoria: "Hamburger",
  porzioni: { n: 4, nome: "hamburger" },
  descrizione: "Un solo medaglione alto per panino, da cuocere in padella e friggitrice, solo in padella o solo in friggitrice ad aria, con provola fresca fusa, pancetta arrotolata resa croccante, lattuga, pomodoro, cipolla rossa cruda e una salsa di yogurt greco e maionese all’aglio.",
  tempi: { preparazione: "40 min", riposo: "30 min per la salsa" },
  ingredienti: [
    { id: "vitello", nome: "Carne di vitello macinata", q: 600, unita: "g", nota: "Se usi hamburger già formati, te ne servono 4 da 150-180 g: salta l’aggiunta di grasso e, se in etichetta risultano «preparato di carne» con sale, non salarli in cottura." },
    { id: "grasso", nome: "Lardo o grasso di manzo, macinato insieme alla carne", q: 100, unita: "g", nota: "Il vitello è molto magro: senza questa quota un medaglione spesso si asciuga prima di arrivare a cottura al centro." },
    { id: "panini", nome: "brioche o al latte", q: 4, unita: "panino", unitaPlurale: "panini", intero: true },
    { id: "provola", nome: "di provola fresca, spesse 3-4 mm", q: 4, unita: "fetta", unitaPlurale: "fette", intero: true },
    { id: "pancetta", nome: "di pancetta arrotolata stagionata, spesse 2-3 mm", q: 8, unita: "fetta", unitaPlurale: "fette", intero: true, nota: "Due fette per panino. La pancetta è già salata e speziata: per questo il sale sugli hamburger è ridotto. Non va macinata con la carne al posto del grasso, perché il suo sale renderebbe l’impasto compatto ed elastico come una salsiccia." },
    { id: "lattuga", nome: "di lattuga iceberg", q: 4, unita: "foglia", unitaPlurale: "foglie", intero: true },
    { id: "pomodoro", nome: "maturo ma sodo", q: 1, unita: "pomodoro", unitaPlurale: "pomodori", intero: true },
    { id: "cipolla", nome: "rossa", q: 1, unita: "cipolla", unitaPlurale: "cipolle", intero: true },
    { id: "burro", nome: "Burro per tostare i panini", q: 20, unita: "g" },
    { id: "sale_carne", nome: "di sale fino per la carne", q: 0.5, unita: "cucchiaino", nota: "Dose ridotta rispetto al normale perché la pancetta porta già molta sapidità." },
    { id: "pepe", nome: "di pepe nero macinato al momento", q: 1, unita: "cucchiaino" },
    { id: "yogurt", nome: "di yogurt greco intero", q: 4, unita: "cucchiaio", nota: "Per una salsa più fresca e leggera puoi usare solo yogurt: 8 cucchiai, cioè circa un vasetto da 150 g, al posto di yogurt e maionese." },
    { id: "maionese", nome: "di maionese", q: 4, unita: "cucchiaio" },
    { id: "aglio", nome: "d’aglio", q: 1, unita: "spicchio", unitaPlurale: "spicchi", intero: true },
    { id: "olio", nome: "di olio extravergine d’oliva", q: 1, unita: "cucchiaio" },
    { id: "sale_salsa", nome: "di sale fino per la salsa", q: 1, unita: "pizzico" }
  ],
  derivati: [
    { id: "peso_medaglione", unita: "g", prefisso: "circa", calcola: (m) => (m.vitello.q + m.grasso.q) / m.porzioni.q }
  ],
  approfondimento: "Il vitello è una carne magra e dal sapore delicato, e da qui discendono quasi tutte le scelte della ricetta. Il grasso macinato insieme alla carne mantiene succoso un medaglione alto, che deve restare sul fuoco più a lungo di uno smash. La cottura mista divide i compiti fra due strumenti: la padella rovente forma la crosta per conduzione, mentre la friggitrice ad aria porta il centro a cottura in modo uniforme senza bruciare l’esterno. La fossetta al centro evita che il medaglione si gonfi a cupola quando le fibre si contraggono. Poiché vitello e provola fresca sono entrambi miti, il carattere del panino è affidato alla pancetta croccante, che porta sapidità e una consistenza diversa da tutte le altre, alla salsa, con aglio e pepe, e alla cipolla cruda. La pancetta si cuoce partendo da padella fredda perché il grasso si sciolga lentamente e la fetta diventi croccante in modo uniforme, senza bruciarsi fuori e restare gommosa dentro. La provola, infine, è un formaggio a pasta filata: fonde bene, ma raffreddandosi torna gommosa, sicché il panino va mangiato appena composto.",
  procedimento: [
    {
      titolo: "Salsa",
      passi: [
        { titolo: "Preparazione", testo: "In una ciotola mescola {yogurt} di yogurt greco e {maionese} di maionese. Unisci {aglio} grattugiato finissimo, {olio} di olio extravergine, {sale_salsa} di sale e una macinata abbondante di pepe. Copri e lascia riposare in frigo almeno 30 minuti: l’aglio appena grattugiato è aspro, mentre dopo il riposo si ammorbidisce e si distribuisce in tutta la salsa." }
      ]
    },
    {
      titolo: "Hamburger e verdure",
      passi: [
        { titolo: "Impasto", testo: "Se non l’ha già fatto il macellaio, mescola {vitello} di carne con {grasso} di grasso macinato, lavorando il meno possibile e senza aggiungere sale: salato in anticipo, l’impasto diventa compatto ed elastico come quello di una salsiccia." },
        { titolo: "Formatura", testo: "Dividi l’impasto in {porzioni} medaglioni da {peso_medaglione} ciascuno, alti circa 2 cm e un po’ più larghi del panino, perché in cottura si restringono. Premi leggermente il centro di ognuno con il pollice per creare una piccola fossetta, poi tienili in frigo fino al momento di cuocerli." },
        { titolo: "Verdure", testo: "Lava e asciuga {lattuga}, taglia {pomodoro} a fette spesse mezzo centimetro e {cipolla} ad anelli sottilissimi. Se la cipolla ti sembra troppo pungente, lasciala 10 minuti in acqua fredda e asciugala bene. Taglia {provola} sottili e, se appaiono umide, tamponale con carta da cucina." },
        { titolo: "Pancetta", testo: "Disponi {pancetta} in una padella ancora fredda, senza olio, e solo allora accendi a fiamma media. Lasciala cuocere 6-8 minuti, girandola di tanto in tanto, finché il grasso diventa trasparente e le fette sono dorate e croccanti; poi scolala su carta da cucina. Versa in una tazzina il grasso rimasto e tienine da parte un cucchiaio, che servirà per la padella degli hamburger. Se scegli la cottura solo in friggitrice, cuoci invece la pancetta nel cestello a 180 °C per 6-8 minuti, prima degli hamburger." },
        { titolo: "Panini", testo: "Asciuga la padella con carta da cucina, lasciando appena un velo di grasso. Taglia a metà {panini}, spalma {burro} di burro sul lato tagliato e tostali in padella a fiamma media finché sono dorati, prima di alzare il fuoco per la carne: a fiamma alta il burro brucia e rende il pane amaro. Se scegli la cottura solo in friggitrice, tostali invece come indicato nell’opzione 3. Tienili da parte." }
      ]
    },
    {
      titolo: "Cottura, opzione 1: padella e friggitrice",
      passi: [
        { titolo: "Friggitrice", testo: "Accendi la friggitrice ad aria a 180 °C, così da trovarla calda al momento del passaggio." },
        { titolo: "Crosta in padella", testo: "Scalda al massimo una padella di ghisa o di ferro e ungila con un velo del grasso della pancetta tenuto da parte, che dà alla crosta un sapore più ricco. Sala gli hamburger con {sale_carne} di sale e un po’ di pepe solo in questo momento, poi appoggiali nella padella con la fossetta verso l’alto. Cuocili circa 2 minuti per lato, senza schiacciarli mai con la spatula, finché non si forma una crosta scura." },
        { titolo: "Finitura in friggitrice", testo: "Trasferisci gli hamburger nel cestello e cuocili 4-5 minuti a 180 °C. Nell’ultimo minuto appoggia su ciascuno una fetta di provola, che deve fondere senza colare. Se hai un termometro, il centro deve arrivare a circa 70 °C: oltre questa soglia il vitello si asciuga." },
        { titolo: "Riposo", testo: "Lascia riposare gli hamburger un paio di minuti, il tempo di comporre il primo panino." }
      ]
    },
    {
      titolo: "Cottura, opzione 2: solo padella",
      passi: [
        { titolo: "Padella", testo: "Usa una padella di ghisa o di ferro, oppure di acciaio a fondo spesso, abbastanza ampia da contenere gli hamburger senza che si tocchino: le padelle antiaderenti sottili si raffreddano al contatto con la carne e non reggono il calore necessario. Scaldala al massimo per qualche minuto, finché una goccia d’acqua non evapora all’istante, poi ungila con un velo del grasso della pancetta tenuto da parte." },
        { titolo: "Prima faccia", testo: "Sala gli hamburger con {sale_carne} di sale e un po’ di pepe solo in questo momento e appoggiali con la fossetta verso l’alto. Cuocili 2-3 minuti senza muoverli né schiacciarli, finché non si forma una crosta scura e si staccano facilmente dal fondo." },
        { titolo: "Seconda faccia e provola", testo: "Girali e cuocili altri 2 minuti a fiamma alta, poi abbassa a media, appoggia la provola su ciascuno e copri con un coperchio per 3-4 minuti: il vapore completa la cottura interna e intanto fonde il formaggio. Il centro deve arrivare a circa 70 °C." },
        { titolo: "Grasso", testo: "Se cuoci gli hamburger in due giri, prima del secondo togli con carta da cucina il grasso rimasto nella padella: lasciato sul fuoco brucia, fuma e dà un sapore amaro." }
      ]
    },
    {
      titolo: "Cottura, opzione 3: solo friggitrice ad aria",
      passi: [
        { titolo: "Preriscaldamento", testo: "Accendi la friggitrice a 200 °C e lasciala scaldare 5 minuti con il cestello inserito: un cestello già caldo colorisce subito la superficie della carne invece di cuocerla lentamente." },
        { titolo: "Cottura", testo: "Sala gli hamburger con {sale_carne} di sale e un po’ di pepe, ungili con un velo d’olio, che favorisce la doratura, e disponili nel cestello senza carta forno e senza che si tocchino, con la fossetta verso l’alto. Cuocili 10-12 minuti a 200 °C, girandoli una volta a metà cottura." },
        { titolo: "Provola", testo: "Nell’ultimo minuto appoggia la provola su ciascun hamburger e richiudi. Controlla che il centro sia a circa 70 °C. La superficie resterà più chiara che in padella o alla griglia: è il limite di questo metodo, che in cambio non fa fumo e non richiede sorveglianza." },
        { titolo: "Panini e pulizia", testo: "Mentre gli hamburger riposano, tosta i panini con il lato imburrato verso l’alto per 1-2 minuti a 180 °C, controllandoli spesso. Se devi cuocere un secondo giro di hamburger, prima svuota il grasso raccolto sul fondo, che altrimenti fuma." }
      ]
    },
    {
      titolo: "Composizione",
      passi: [
        { titolo: "Assemblaggio", testo: "Sulla metà inferiore del panino appoggia una foglia di lattuga, che protegge il pane dai succhi della carne; sopra metti l’hamburger e appoggia subito due fette di pancetta sulla provola ancora fusa, che le tiene ferme e impedisce che scivolino al primo morso; poi aggiungi il pomodoro e la cipolla. Spalma la salsa sulla metà superiore e chiudi: così la salsa non tocca la carne bollente e non diventa liquida." },
        { titolo: "Servizio", testo: "Servi subito ogni panino appena composto, perché la provola, raffreddandosi, torna compatta e gommosa." }
      ]
    }
  ]
});

/* Ricetta aggiunta dalla chat: brownies light croccanti in friggitrice ad aria */
window.RICETTARIO.ricette.push({
  id: "brownies-light-croccanti-friggitrice",
  titolo: "Brownies light croccanti in friggitrice ad aria",
  categoria: "dolci-light",
  sottocategoria: "Brownies",
  porzioni: { n: 12, nome: "pezzi" },
  descrizione: "Brownies alleggeriti, con poco burro, cioccolato fondente dolce e un cucchiaio di yogurt greco, una crosticina lucida e friabile in superficie e un interno compatto e umido, dal gusto orientato al dolce più che all’amaro. Si cuociono in friggitrice ad aria in uno stampo quadrato di silicone da 16 × 16 cm, senza carta forno, in uno strato alto circa 2 cm, e danno il meglio serviti freddi. Circa 130 kcal a pezzo con la granella e 120 senza (stima indicativa), contro le 300 circa di un brownie classico di pari dimensioni.",
  tempi: { preparazione: "25 min + 22-26 min in friggitrice", riposo: "30 min per portare uova e yogurt a temperatura ambiente + almeno 1 ora di raffreddamento" },
  ingredienti: [
    { id: "cioccolato", nome: "Cioccolato fondente al 50-55%", q: 50, unita: "g", nota: "Un fondente dolce, al 50-55% di cacao, ha quasi le stesse calorie di un 70% ma è molto meno amaro. Se preferisci un gusto ancora più morbido, puoi usare cioccolato al latte nella stessa dose. Spezzettalo finemente, così si scioglie in modo uniforme e in meno tempo." },
    { id: "burro", nome: "Burro", q: 40, unita: "g", nota: "Sostituisce l’olio: il burro contiene circa l’80% di grasso, perciò 40 g ne apportano all’incirca quanto 30 g di olio, con un sapore più rotondo, e raffreddandosi rassodano l’interno, che risulta più compatto quando si servono i brownies freddi. Meglio un burro di buona qualità, non salato." },
    { id: "uovo", nome: "intere, di taglia media", q: 2, unita: "uovo", intero: true, nota: "Tirale fuori dal frigorifero almeno mezz’ora prima: le uova a temperatura ambiente si montano più in fretta e trattengono meglio l’aria." },
    { id: "zucchero", nome: "Zucchero semolato", q: 100, unita: "g", nota: "Non ridurlo e non sostituirlo con dolcificanti: è lo zucchero sciolto nell’uovo a formare la crosticina croccante. Meglio il semolato di quello di canna, i cui cristalli più grossi si sciolgono con difficoltà." },
    { id: "yogurt", nome: "Yogurt greco magro, ben denso", q: 80, unita: "g", nota: "Usalo a temperatura ambiente e scarta il siero che affiora in superficie: ogni goccia d’acqua in più toglie croccantezza alla crosta." },
    { id: "cacao", nome: "Cacao in polvere alcalinizzato (o amaro)", q: 30, unita: "g", nota: "Il cacao alcalinizzato, detto anche «olandese», è più scuro ma decisamente meno aspro e amaro del cacao naturale, a parità di calorie: in etichetta compare la dicitura «alcalinizzato» o la sigla E501. Va sempre setacciato, perché i grumi non si sciolgono nell’impasto e restano come granelli amari." },
    { id: "farina", nome: "Farina 00", q: 60, unita: "g", nota: "È dosata leggermente più alta del consueto per compensare il cacao ridotto rispetto a una versione più amara, così l’impasto conserva la stessa consistenza." },
    { id: "sale", nome: "abbondante di sale fino", q: 1, unita: "pizzico", nota: "Esalta il cacao e la percezione di dolcezza; in assenza di vaniglia puoi abbondare leggermente." },
    { id: "cacao_stampo", nome: "di cacao per lo stampo", q: 1, unita: "cucchiaino" },
    { id: "granella", nome: "Granella di nocciole (facoltativa)", q: 15, unita: "g", nota: "Va solo in superficie, quindi la dose dipende dall’area dello stampo e non dallo spessore: per questo non raddoppia insieme al resto. Resta croccante più a lungo della crosta, ed è utile soprattutto se prepari i brownies con qualche ora d’anticipo." }
  ],
  approfondimento: "La croccantezza dipende da due condizioni, poca acqua e zucchero ben sciolto. Per questo lo yogurt è dosato con parsimonia, giacché l’acqua che evapora in cottura ammorbidisce la superficie, mentre le uova vengono montate a lungo con lo zucchero, che sciogliendosi migra verso l’alto e forma una sottile crosta simile a una meringa; burro e cioccolato, fusi insieme e aggiunti ancora caldi, completano lo scioglimento. Il burro prende il posto dell’olio: 40 g ne apportano all’incirca la stessa quantità di grasso, con appena 2-3 calorie in più a pezzo, e a differenza dell’olio solidificano raffreddandosi, sicché l’interno risulta più compatto e si taglia meglio, un vantaggio per brownies destinati a essere serviti freddi. Per orientare il gusto verso il dolce si è agito anzitutto sulle fonti dell’amaro, che costano poco in calorie: il cacao è ridotto e, se possibile, alcalinizzato, cioè trattato in modo da perdere buona parte dell’asprezza, mentre il cioccolato è un fondente al 50-55%, di energia quasi identica a un 70% ma assai più morbido; solo in secondo luogo si è aggiunto un poco di zucchero, che oltre ad addolcire rinforza la crosta. La friggitrice ad aria favorisce la crosta, perché l’aria in movimento asciuga in fretta la superficie, ma per la stessa ragione rischia di colorirla prima che l’interno sia cotto: da qui la temperatura di 160 °C, una ventina di gradi sotto quella del forno statico, e il foglio d’alluminio di riserva. Lo stampo di silicone, antiaderente, rende superflua la carta forno; conducendo però il calore meno del metallo, lascia bordi e fondo più morbidi e allunga la cottura di qualche minuto. Lo strato alto circa 2 cm dà un brownie dall’aspetto classico, con un interno più ampio e fondente; la croccantezza si concentra perciò nella crosta e nella granella, che hanno lo stesso spessore di prima ma pesano meno in proporzione al resto. Raddoppiare lo spessore non raddoppia il tempo di cottura, perché il calore penetra anche dai lati, ma lo allunga abbastanza da rendere quasi sempre necessario il foglio d’alluminio. Rispetto a un brownie classico, le calorie sono poco più di un terzo.",
  procedimento: [
    {
      titolo: "Prima di cominciare",
      passi: [
        { titolo: "Ingredienti a temperatura ambiente", testo: "Almeno mezz’ora prima tira fuori dal frigorifero {uovo} e lo yogurt. Intanto pesa tutti gli ingredienti e disponili a portata di mano: una volta montato l’uovo, i passaggi si susseguono senza pause, e un composto montato lasciato fermo perde rapidamente l’aria incorporata." },
        { titolo: "Attrezzatura", testo: "Ti servono una ciotola stretta e alta, perché con due sole uova, in una ciotola larga, le fruste girerebbero in parte a vuoto; le fruste elettriche; un setaccino; una spatola di silicone; una tazza adatta al microonde, o un pentolino per il bagnomaria; uno stecchino di legno; un coltello affilato per il taglio." },
        { titolo: "Stampo", testo: "Spolvera fondo e pareti dello stampo di silicone con {cacao_stampo} di cacao, ruotandolo perché la polvere aderisca ovunque, poi capovolgilo e battilo leggermente per eliminare l’eccesso: la carta forno non serve. Verifica che lo stampo entri nel cestello lasciando almeno un dito di spazio tutt’attorno, perché l’aria deve poter circolare anche ai lati. Le dosi originali sono pensate per uno stampo da 16 × 16 cm e uno strato di circa 2 cm; se cambi il numero di pezzi, cambia di conseguenza la superficie dello stampo oppure cuoci in più riprese, perché uno strato più alto richiederebbe tempi molto diversi." }
      ]
    },
    {
      titolo: "Impasto",
      passi: [
        { titolo: "Sciogliere burro e cioccolato", testo: "Spezzetta {cioccolato} di cioccolato in una tazza, aggiungi {burro} di burro a cubetti e scalda al microonde a intervalli di 20 secondi, mescolando ogni volta; di solito bastano tre o quattro intervalli. In alternativa sciogli tutto a bagnomaria, con l’acqua appena sotto il bollore e senza che il fondo della ciotola la tocchi. Smetti di scaldare quando rimane ancora qualche scaglia intera e lasciala sciogliere mescolando: il cioccolato surriscaldato diventa opaco e granuloso, e il burro che sfrigola comincia a cuocere. Il composto deve risultare liscio e lucido e restare ben caldo al dito fino al momento di usarlo; se nel frattempo si raffredda, riscaldalo per qualche secondo." },
        { titolo: "Montare uovo e zucchero", testo: "Nella ciotola stretta rompi le {uovo}, aggiungi {zucchero} di zucchero e avvia le fruste a bassa velocità per una trentina di secondi, poi passa alla velocità massima per 5-6 minuti: con questa quantità di zucchero serve un po’ più di tempo perché si sciolga. Il composto è pronto quando ha almeno raddoppiato di volume, è passato dal giallo a un color crema chiaro e, sollevando le fruste, ricade formando un nastro che resta visibile in superficie per qualche secondo. Strofina una goccia fra pollice e indice: se senti ancora i granelli di zucchero, monta un altro minuto." },
        { titolo: "Unire burro e cioccolato", testo: "Riporta le fruste alla velocità minima e versa burro e cioccolato caldi a filo sottile, lungo il bordo della ciotola, senza interrompere. Il composto perderà parte del volume e diventerà scuro e lucido: è normale e non va corretto. Il calore del composto scioglie gli ultimi cristalli di zucchero, e proprio da questo dipende la crosta." },
        { titolo: "Unire lo yogurt", testo: "Aggiungi {yogurt} di yogurt greco e mescola con le fruste a bassa velocità per pochi secondi, solo finché non scompaiono le striature bianche. Da qui in avanti metti da parte le fruste." },
        { titolo: "Aggiungere le polveri", testo: "Setaccia direttamente sul composto {cacao} di cacao, {farina} di farina e {sale} di sale. Incorporali con la spatola, con movimenti ampi dal basso verso l’alto, ruotando la ciotola di un quarto di giro a ogni passata, e fermati appena non vedi più tracce di polvere asciutta. Mescolare oltre questo punto sviluppa il glutine della farina e rende il brownie gommoso. L’impasto finito è denso, lucido e cade dalla spatola a grossi nastri; non preoccuparti se è più sostenuto di un comune impasto per torte." }
      ]
    },
    {
      titolo: "Cottura in friggitrice ad aria",
      passi: [
        { titolo: "Preriscaldamento", testo: "Preriscalda la friggitrice a 160 °C per 3 minuti, con il cestello vuoto. Se il tuo modello non ha una funzione apposita, impostalo a 160 °C e lascialo funzionare a vuoto per lo stesso tempo." },
        { titolo: "Stampo nel cestello", testo: "Estrai il cestello caldo, appoggialo su un sottopentola e sistemaci dentro lo stampo vuoto: il silicone è flessibile e, se lo riempissi prima, si deformerebbe durante il trasporto. Versa l’impasto raccogliendolo tutto con la spatola, spingilo fino agli angoli e livellalo; poi batti delicatamente il cestello sul sottopentola due o tre volte, perché le bolle d’aria più grosse salgano in superficie. Distribuisci {granella} di granella, premendola appena perché aderisca." },
        { titolo: "Cottura", testo: "Reinserisci il cestello e cuoci a 160 °C per 22-26 minuti. Nei primi 10 minuti non aprire: la crosta si forma proprio in questa fase e ogni apertura raffredda la camera di cottura. Verso il dodicesimo minuto controlla la superficie: quando è già screpolata e ben colorita, coprila con un foglio d’alluminio rimboccato sotto i bordi dello stampo, così che la ventola non lo sollevi, e prosegui la cottura. Con questo spessore il foglio serve quasi sempre, perché la superficie sarebbe pronta molto prima del centro." },
        { titolo: "Prova di cottura", testo: "Dal ventesimo minuto controlla con uno stecchino infilato al centro: deve uscire con qualche briciola umida attaccata, non pulito e nemmeno coperto d’impasto liquido. A cottura giusta la superficie è asciutta, opaca e screpolata, i bordi si staccano leggermente dalle pareti e il centro, premuto con un dito, cede ancora un poco: si rassoderà raffreddandosi, anche perché il burro solidifica. Se lo stecchino esce bagnato, prosegui a intervalli di 2 minuti. Alla prima prova annota il tempo giusto per la tua friggitrice, perché la potenza effettiva varia molto da un modello all’altro." }
      ]
    },
    {
      titolo: "Raffreddamento, taglio e servizio",
      passi: [
        { titolo: "Primo riposo", testo: "Estrai il cestello e lascia lo stampo al suo interno per 10 minuti. Trasferiscilo poi su una griglia sostenendolo da sotto con una paletta larga o con un tagliere: da caldo il silicone è molle e, sollevato dai bordi, si piegherebbe spaccando il brownie." },
        { titolo: "Raffreddamento completo", testo: "Lascialo raffreddare completamente, senza coprirlo, per almeno un’ora: un coperchio o un canovaccio tratterrebbero il vapore, che condensando ammorbidirebbe subito la crosta. Da caldo, inoltre, l’interno è ancora troppo tenero per essere tagliato in modo netto." },
        { titolo: "Sformatura e taglio", testo: "Piega delicatamente le pareti di silicone per staccarle, capovolgi lo stampo su un tagliere e rigira il brownie con la crosta verso l’alto. Taglialo in {porzioni} pezzi con un coltello affilato, per esempio con tre tagli in un senso e due nell’altro, premendo la lama dall’alto verso il basso invece di segare, e pulendola con un panno umido tra un taglio e l’altro: la crosta resta integra e i bordi vengono netti." },
        { titolo: "Servizio", testo: "Servili freddi, anche a distanza di ore: raffreddandosi l’interno si compatta e il sapore del cacao si assesta. La crosta resta friabile per tutta la giornata; il giorno dopo i brownies sono più morbidi, ma ancora buoni." }
      ]
    },
    {
      titolo: "Conservazione",
      passi: [
        { titolo: "Dove tenerli", testo: "Conservali a temperatura ambiente in una scatola di latta o sotto una campana di vetro, fino a due o tre giorni. Evita i contenitori ermetici di plastica e soprattutto il frigorifero, dove l’umidità ammorbidisce la crosta in poche ore e il burro indurisce l’interno più del dovuto." },
        { titolo: "Per renderli di nuovo croccanti", testo: "Se la crosta si è ammorbidita, passali 2-3 minuti in friggitrice a 150 °C, poi lasciali raffreddare una decina di minuti prima di servirli: il calore asciuga la superficie e, una volta freddi, tornano croccanti." }
      ]
    },
    {
      titolo: "Se qualcosa va storto",
      passi: [
        { titolo: "Niente crosticina lucida", testo: "Di solito lo zucchero non si è sciolto del tutto, perché le uova sono state montate poco o burro e cioccolato erano ormai tiepidi quando li hai aggiunti. Può dipendere anche da uno yogurt troppo acquoso. La volta successiva prolunga la montatura finché lo zucchero non scompare al tatto e unisci burro e cioccolato ben caldi." },
        { titolo: "Superficie scura e interno crudo", testo: "Con uno strato alto è il rischio principale, e significa che la tua friggitrice scalda più della media. La volta successiva abbassa a 150 °C, allunga la cottura di qualche minuto e applica il foglio d’alluminio già al decimo minuto." },
        { titolo: "Asciutti come un biscotto", testo: "La cottura è stata troppo lunga: toglili quando lo stecchino esce ancora con qualche briciola umida, ricordando che il centro continua a rassodarsi fuori dalla friggitrice." },
        { titolo: "Interno gommoso", testo: "L’impasto è stato lavorato troppo dopo l’aggiunta della farina. Incorpora le polveri con la spatola e fermati appena spariscono le tracce asciutte." },
        { titolo: "Attaccati allo stampo", testo: "Sono stati sformati ancora caldi, oppure il cacao non copriva bene il fondo. Aspetta il raffreddamento completo e, se serve, passa la lama di un coltello a punta tonda lungo i bordi prima di piegare le pareti." },
        { titolo: "Ancora troppo amari", testo: "Se usi il cacao comune e il gusto ti sembra troppo deciso, passa a quello alcalinizzato o al cioccolato al latte, che addolciscono senza aggiungere calorie apprezzabili. Per una dolcezza maggiore senza zucchero in più puoi aggiungere 20 g di eritritolo, mantenendo però invariato lo zucchero semolato, da cui dipende la crosta: l’eritritolo addolcisce, ma ha un lieve retrogusto fresco e non forma la crosticina." }
      ]
    }
  ]
});

/* Ricetta aggiunta dalla chat: pizza con farina Scirocco a bordo sottile */
window.RICETTARIO.ricette.push({
  id: "pizza-scirocco-bordo-sottile",
  titolo: "Pizza a bordo sottile con farina Scirocco e lievito secco",
  categoria: "lievitati",
  sottocategoria: "Pizza",
  porzioni: { n: 4, nome: "pizze" },
  descrizione: "4 pizze da circa 30 cm a bordo sottile con la farina Pizza Maestro Scirocco di Molini Riggi: idratazione al 70%, lievito secco e due tempi possibili, 16 ore di frigo oppure tutto in giornata a temperatura ambiente. Fondo strutturato e croccante, mollica morbida, senza effetto biscotto.",
  tempi: { preparazione: "1 h di lavoro", riposo: "16 h in frigo + 3-4 h di appretto, oppure circa 6 h in giornata" },
  ingredienti: [
    { id: "farina", nome: "Farina Pizza Maestro Scirocco (Molini Riggi, tipo 0, W 270-300)", q: 600, unita: "g", nota: "Pensata per la pizza tonda classica, regge fino a 48 ore di frigo e idratazioni fino al 75%. Ha una forza simile a quella di una 00 da 300 W, che in mancanza può sostituirla." },
    {
      id: "acqua",
      nome: "Acqua (totale)",
      unita: "g",
      nota: "Fredda di frigo per l’opzione con il frigo. Per l’opzione in giornata usala a temperatura ambiente, o fresca se la cucina supera i 24 °C.",
      sotto: [
        { id: "acqua_autolisi", nome: "per l'autolisi", q: 380, unita: "g" },
        { id: "acqua_lievito", nome: "per sciogliere il lievito", q: 20, unita: "g" },
        { id: "acqua_finale", nome: "da aggiungere alla fine", q: 20, unita: "g" }
      ]
    },
    { id: "lievito", nome: "Lievito di birra secco", q: 1000, unita: "mg", nota: "Alla dose originale corrisponde a 1 g, circa un quarto di cucchiaino raso, ed è la stessa per entrambe le opzioni: con il frigo il freddo rallenta il lievito, in giornata la lievitazione è più breve. Nell’opzione in giornata, se la cucina supera i 25 °C, scendi a mezzo grammo. Se dopo 16 ore di frigo l’impasto è cresciuto ben oltre i due terzi, la volta dopo riducilo di un terzo; se si è mosso appena, aumentalo di un terzo." },
    { id: "sale", nome: "Sale fino", q: 15, unita: "g" },
    { id: "olio", nome: "Olio extravergine d’oliva", q: 15, unita: "g", nota: "Nel forno di casa, meno caldo di quello a legna, aiuta la crosta a dorarsi e a diventare croccante." }
  ],
  derivati: [
    { id: "peso_panetto", unita: "g", prefisso: "circa", calcola: (m) => (m.farina.q + m.acqua.q + m.sale.q + m.olio.q) / m.porzioni.q }
  ],
  approfondimento: "La Scirocco è una farina tipo 0 di forza media, che dà impasti estensibili: per questo si lascia stendere sottile, bordo compreso, senza ritirarsi, a differenza delle farine più forti pensate per la pizza contemporanea. L’idratazione al 70% è il punto di equilibrio fra struttura e morbidezza: più acqua darebbe un impasto soffice e arioso, meno acqua, nelle cotture di 6-8 minuti di un forno domestico, renderebbe il disco secco come un biscotto. L’autolisi lascia idratare la farina prima che entri in gioco il lievito e rende l’impasto più estensibile, condizione necessaria per un bordo sottile. Le 16 ore di frigo sono il cuore della ricetta: il freddo rallenta il lievito più degli enzimi, sicché l’impasto sviluppa aromi e scompone parte degli zuccheri e dell’amido, a vantaggio del sapore, della doratura e della digeribilità. L’opzione in giornata rinuncia a parte di questi aromi in cambio della rapidità, ma resta una pizza ben fatta, purché i panetti arrivino al forno ben lievitati. Con disco e bordo sottili il rischio principale è l’effetto biscotto, che nasce da una cottura troppo lunga a temperatura troppo bassa: la difesa è una superficie rovente, che cuoce il fondo in pochi minuti mentre il grill finisce il bordo.",
  procedimento: [
    {
      titolo: "Impasto, per entrambe le opzioni",
      passi: [
        { titolo: "Autolisi, all’inizio", testo: "Nella ciotola dell'impastatrice versa {farina} di farina e {acqua_autolisi} d'acqua. Impasta a velocità bassa per circa 2 minuti, finché non resta farina asciutta: non serve un impasto liscio. Copri e lascia riposare 45 minuti." },
        { titolo: "Lievito, dopo 45 minuti", testo: "Sciogli {lievito} di lievito in {acqua_lievito} d'acqua, versalo sull'impasto e impasta a velocità bassa per 3-4 minuti, finché non è del tutto assorbito." },
        { titolo: "Sale, ultima acqua e olio", testo: "Aggiungi {sale} di sale e impasta a velocità media per circa 6 minuti. Versa a filo {acqua_finale} d'acqua, aspettando che venga assorbita, poi aggiungi {olio} di olio, sempre a filo. Prosegui finché l'impasto non si stacca dalle pareti e si avvolge al gancio, liscio e lucido: in tutto, dall'aggiunta del sale, circa 10-12 minuti. A fine impastatura l'impasto non deve superare i 24 °C." }
      ]
    },
    {
      titolo: "Opzione 1: con 16 ore di frigo",
      passi: [
        { titolo: "Riposo con pieghe, appena finito di impastare", testo: "Trasferisci l'impasto in un contenitore leggermente unto e lascialo un'ora a temperatura ambiente. Ogni 20 minuti, tre volte in tutto, fai un giro di pieghe: con la mano bagnata tira un lembo verso l'alto e ripiegalo sull'impasto, ripetendo sui quattro lati. In quest'ora l'impasto cresce appena, ed è normale." },
        { titolo: "In frigo, dopo un’ora di riposo", testo: "Chiudi bene il contenitore e mettilo in frigo a circa 4 °C per 16 ore. Deve crescere lentamente, fra la metà e i due terzi del volume iniziale. Se ti serve più tempo, puoi lasciarlo fino a 24 ore." },
        { titolo: "Divisione e pirlatura, dopo 16 ore di frigo", testo: "Rovescia l'impasto ancora freddo su un piano appena spolverato di semola e dividilo in {porzioni} panetti da {peso_panetto} ciascuno. Per ciascuno porta i bordi verso il centro, capovolgilo e fallo ruotare sotto la mano a coppa, su un punto non infarinato, finché la superficie non è tesa. Disponili distanziati in un contenitore o su un vassoio coperto, affinché non formino crosta." },
        { titolo: "Appretto, appena formati i panetti", testo: "Lascia lievitare i panetti a temperatura ambiente per 3-4 ore. Sono pronti quando sono cresciuti di circa una volta e mezza e, premuti con un dito, l'incavo risale lentamente." }
      ]
    },
    {
      titolo: "Opzione 2: in giornata, solo a temperatura ambiente",
      passi: [
        { titolo: "Quando iniziare", testo: "Comincia l'impasto circa 7 ore prima di infornare, a una temperatura della cucina intorno ai 20-22 °C. In una cucina più calda i tempi si accorciano, in una più fredda si allungano: regolati sull'aspetto dell'impasto più che sull'orologio." },
        { titolo: "Puntata, appena finito di impastare", testo: "Trasferisci l'impasto in un contenitore leggermente unto e coperto e lascialo 2 ore a temperatura ambiente. Nella prima ora fai tre giri di pieghe, uno ogni 20 minuti, come nell'opzione 1. Alla fine l'impasto deve essere cresciuto di circa la metà." },
        { titolo: "Divisione e pirlatura, dopo 2 ore", testo: "Dividi l'impasto in {porzioni} panetti da {peso_panetto} ciascuno e formali come nell'opzione 1, disponendoli distanziati in un contenitore coperto." },
        { titolo: "Appretto, appena formati i panetti", testo: "Lascia lievitare i panetti a temperatura ambiente per circa 4 ore: 3 se la cucina è calda, fino a 5 se è fresca. Sono pronti quando sono cresciuti di circa una volta e mezza e, premuti con un dito, l'incavo risale lentamente. Rispetto all'opzione con il frigo la pizza avrà un aroma un po' meno complesso: è il prezzo della rapidità." }
      ]
    },
    {
      titolo: "Stesura e cottura",
      passi: [
        { titolo: "Preriscaldamento, un’ora prima della fine dell’appretto", testo: "Accendi il forno alla massima temperatura, statico, con una pietra refrattaria o un acciaio sul ripiano medio-alto, e lascialo scaldare almeno 45-60 minuti: la pietra impiega molto più tempo dell'aria a diventare rovente, e da lei dipende la struttura del fondo." },
        { titolo: "Stesura a bordo sottile", testo: "Su un velo di semola, schiaccia il panetto con i polpastrelli partendo dal centro e spingendo fino a mezzo centimetro dal bordo, poi schiaccia leggermente anche il bordo stesso, così che resti appena accennato. Allarga il disco fino a circa 30 cm sollevandolo e facendolo ruotare sul dorso delle mani. Non usare il mattarello: un disco già sottile, privato anche del gas, cuocerebbe come un biscotto. Se il panetto si ritira, è ancora freddo o poco lievitato: aspetta un'altra mezz'ora." },
        { titolo: "Cottura", testo: "Condisci e fai scivolare la pizza sulla pietra con una pala spolverata di semola. Cuoci 6-8 minuti in tutto, accendendo il grill nell'ultimo minuto. Con i bordi sottili il cornicione si colora prima del solito: sforna appena è dorato, perché ogni minuto in più secca il disco." }
      ]
    },
    {
      titolo: "Se qualcosa non va",
      passi: [
        { titolo: "Troppo secca o biscottata", testo: "Alza l'acqua di 10 g per volta, fino a un massimo di 450 g in totale, e controlla che la pietra sia davvero rovente: una pietra tiepida allunga la cottura e asciuga il disco." },
        { titolo: "Troppo morbida", testo: "Prima di toccare l'impasto, accorcia di un minuto la cottura o sposta la pietra un ripiano più in basso, così che il fondo cuocia di più rispetto al condimento." },
        { titolo: "Disco più sottile", testo: "Imposta 5 pizze invece di 4: i panetti scendono a circa 210 g e il disco diventa più sottile, con la stessa larghezza." }
      ]
    }
  ]
});

/* Sezione «Dolci light» e ricetta aggiunta dalla chat: brownies croccanti con banana o mela e yogurt greco */
(() => {
  const R = window.RICETTARIO;
  if (!R.categorie.some((c) => c.id === "dolci-light")) {
    const i = R.categorie.findIndex((c) => c.id === "dolci");
    R.categorie.splice(i + 1, 0, { id: "dolci-light", nome: "Dolci light" });
  }
})();

window.RICETTARIO.ricette.push({
  id: "brownies-light-banana-mela-yogurt",
  titolo: "Brownies light croccanti con banana (o mela) e yogurt greco",
  categoria: "dolci-light",
  sottocategoria: "Brownies",
  porzioni: { n: 12, nome: "pezzi" },
  descrizione: "Brownies in cui una banana molto matura, oppure una mela cotta e ridotta in purea densa, prende il posto di gran parte del burro e di un quarto dello zucchero, mentre lo yogurt greco dà umidità e una nota fresca. In superficie resta la crosticina lucida e friabile, sostenuta da una granella di nocciole; l’interno è morbido e umido, più vicino a un fudge che a una torta. Si cuociono in friggitrice ad aria, oppure in forno, nello stampo quadrato di silicone da 16 × 16 cm, in uno strato di circa 2 cm. Circa 100 kcal a pezzo senza granella e 110 con la granella (stima indicativa), contro le 300 circa di un brownie classico di pari dimensioni.",
  tempi: { preparazione: "30 min + 25-30 min di cottura", riposo: "30 min per portare uova e yogurt a temperatura ambiente + almeno 1 ora di raffreddamento" },
  ingredienti: [
    { id: "cioccolato", nome: "Cioccolato fondente al 50-55%", q: 40, unita: "g", nota: "Un fondente dolce, al 50-55% di cacao, ha quasi le stesse calorie di un 70% ma è molto meno amaro, e con la frutta si sposa meglio. Spezzettalo finemente, così si scioglie in modo uniforme e in meno tempo." },
    { id: "burro", nome: "Burro", q: 20, unita: "g", nota: "Metà della dose dei brownies light al burro: il resto della morbidezza lo dà la frutta. Non eliminarlo del tutto, perché serve a sciogliere il cioccolato in modo liscio e a dare all’interno il gusto rotondo di un vero brownie." },
    { id: "uovo", nome: "intere, di taglia media", q: 2, unita: "uovo", intero: true, nota: "Tirale fuori dal frigorifero almeno mezz’ora prima: a temperatura ambiente si montano più in fretta e trattengono meglio l’aria." },
    { id: "zucchero", nome: "Zucchero semolato", q: 80, unita: "g", nota: "Un quinto in meno rispetto ai brownies light al burro, perché la frutta matura addolcisce da sé. Non scendere oltre e non sostituirlo con dolcificanti: è lo zucchero sciolto nell’uovo montato a formare la crosticina." },
    { id: "frutta", nome: "molto matura, con la buccia punteggiata di nero", q: 1, unita: "banana", unitaPlurale: "banane", intero: true, nota: "Una banana media dà circa 110-120 g di polpa. In alternativa, per ogni banana, usa una mela media (circa 180 g, meglio Golden o Renetta) cotta e ridotta in purea densa come spiegato nel procedimento, oppure circa 110 g di purea di mela 100% frutta senza zuccheri aggiunti. La banana dà un gusto più dolce e riconoscibile; la mela è più neutra, lascia emergere il cioccolato e rende l’interno un poco più umido." },
    { id: "yogurt", nome: "Yogurt greco magro, ben denso", q: 60, unita: "g", nota: "Usalo a temperatura ambiente e scarta il siero che affiora in superficie: con la frutta l’impasto contiene già parecchia acqua, e ogni goccia in più toglie croccantezza alla crosta." },
    { id: "cacao", nome: "Cacao in polvere alcalinizzato (o amaro)", q: 25, unita: "g", nota: "Il cacao alcalinizzato, riconoscibile in etichetta dalla dicitura «alcalinizzato» o dalla sigla E501, è più scuro e assai meno aspro di quello naturale, a parità di calorie. Va sempre setacciato." },
    { id: "farina", nome: "Farina 00", q: 50, unita: "g" },
    { id: "sale", nome: "abbondante di sale fino", q: 1, unita: "pizzico", nota: "Esalta il cacao e la percezione di dolcezza." },
    { id: "cannella", nome: "di cannella in polvere (facoltativa, solo con la mela)", q: 1, unita: "pizzico", nota: "Con la mela dà profumo senza calorie apprezzabili; con la banana è superflua." },
    { id: "cacao_stampo", nome: "di cacao per lo stampo", q: 1, unita: "cucchiaino" },
    { id: "granella", nome: "Granella di nocciole (facoltativa, ma consigliata)", q: 15, unita: "g", nota: "In questa versione conta più che in quella al burro, perché la crosta, a causa dell’acqua della frutta, è più sottile e si ammorbidisce prima: la granella resta croccante anche il giorno dopo. Va solo in superficie, quindi la dose dipende dall’area dello stampo." }
  ],
  approfondimento: "Togliere grassi e zucchero da un brownie senza renderlo gommoso o stopposo richiede di sostituirli con qualcosa che ne faccia le veci: il grasso dà morbidezza e scioglievolezza, lo zucchero dolcezza, umidità e struttura. La banana matura e la purea di mela svolgono in parte entrambe le funzioni, perché contengono zuccheri, fibre e pectine che trattengono l’acqua e mantengono l’interno umido; per questo il burro scende a 20 g e lo zucchero a 80 g, con un risparmio di circa un quarto delle calorie rispetto ai brownies light al burro. Il prezzo di questa scelta è l’acqua: una banana ne contiene circa tre quarti del proprio peso, e l’acqua che evapora in cottura è la principale nemica della crosta. Da qui tre accorgimenti, che vanno rispettati tutti. Il primo è montare a lungo le uova con lo zucchero, finché questo non si scioglie del tutto e, migrando in superficie, forma la sottile pellicola simile a una meringa che in cottura diventa crosticina. Il secondo è aggiungere la frutta ridotta a una crema liscia e densa, insieme allo yogurt e soltanto dopo il cioccolato, a velocità minima e per pochi secondi, così da non sgonfiare la spuma; la mela, che cruda sarebbe troppo acquosa e lascerebbe pezzetti umidi, va prima cotta e asciugata. Il terzo è la granella, che garantisce una croccantezza indipendente dall’umidità. Bisogna comunque essere onesti sul risultato: la crosta di questa versione è più sottile e meno duratura di quella dei brownies al burro, dà il meglio nelle prime ore e il giorno dopo va ravvivata con un breve passaggio in friggitrice; in compenso l’interno resta morbido più a lungo, proprio grazie alla frutta. La cottura a temperatura moderata, 160 °C in friggitrice o 170 °C in forno statico, serve a dare all’acqua il tempo di evaporare dal centro prima che la superficie scurisca troppo.",
  procedimento: [
    {
      titolo: "Prima di cominciare",
      passi: [
        { titolo: "Ingredienti a temperatura ambiente", testo: "Almeno mezz’ora prima tira fuori dal frigorifero {uovo} e lo yogurt. Pesa tutti gli ingredienti e disponili a portata di mano: una volta montate le uova i passaggi si susseguono senza pause, e un composto montato lasciato fermo perde l’aria incorporata." },
        { titolo: "Attrezzatura", testo: "Ti servono una ciotola stretta e alta, perché con due sole uova, in una ciotola larga, le fruste girerebbero in parte a vuoto; le fruste elettriche; una forchetta e una ciotolina per la frutta, oppure un frullatore a immersione; un setaccino; una spatola di silicone; una tazza adatta al microonde; uno stecchino di legno; un coltello affilato." },
        { titolo: "Stampo", testo: "Spolvera fondo e pareti dello stampo di silicone con {cacao_stampo} di cacao, ruotandolo perché la polvere aderisca ovunque, poi capovolgilo e battilo leggermente per eliminare l’eccesso: la carta forno non serve. Se cuoci in friggitrice, verifica che lo stampo entri nel cestello lasciando almeno un dito di spazio tutt’attorno. Le dosi originali sono pensate per uno stampo da 16 × 16 cm e uno strato di circa 2 cm; se cambi il numero di pezzi, cambia di conseguenza la superficie dello stampo, perché uno strato più alto richiederebbe tempi molto diversi e, con la frutta, resterebbe crudo al centro." }
      ]
    },
    {
      titolo: "Crema di frutta e yogurt",
      passi: [
        { titolo: "Con la banana", testo: "Sbuccia {frutta} e schiacciala con una forchetta, poi lavorala ancora finché non diventa una crema senza grumi; il frullatore a immersione rende il lavoro più rapido e il risultato più liscio. Aggiungi {yogurt} di yogurt greco e mescola fino a ottenere una crema omogenea. I pezzetti di banana lasciati interi diventerebbero, in cottura, piccole sacche umide e collose." },
        { titolo: "Con la mela: cottura", testo: "Se usi la mela al posto della banana, sbucciala, eliminane il torsolo e tagliala a cubetti di circa 1 cm. Mettili in una ciotola adatta al microonde, coprili con un piattino e cuocili alla massima potenza per 3-4 minuti, mescolando a metà, finché non si schiacciano senza sforzo con la forchetta. In alternativa cuocili in un pentolino coperto, a fuoco basso, con un cucchiaio d’acqua, per circa 10 minuti." },
        { titolo: "Con la mela: purea densa", testo: "Riduci la mela in purea con il frullatore a immersione o con la forchetta, poi, se sul fondo vedi del liquido, rimettila nel microonde scoperta per 30-60 secondi, oppure asciugala in padella a fuoco medio mescolando: è pronta quando, raccolta con un cucchiaio, resta in piedi a cupola senza colare. Lasciala intiepidire, poi unisci {yogurt} di yogurt greco e, se ti piace, {cannella} di cannella. Se usi una purea già pronta, versala in un colino fine per qualche minuto e scarta il liquido che cola." },
        { titolo: "Temperatura giusta", testo: "La crema di frutta e yogurt deve essere a temperatura ambiente quando la userai: se fosse fredda farebbe rapprendere il cioccolato in granelli, se fosse calda cuocerebbe in parte le uova." }
      ]
    },
    {
      titolo: "Impasto",
      passi: [
        { titolo: "Sciogliere burro e cioccolato", testo: "Spezzetta {cioccolato} di cioccolato in una tazza, aggiungi {burro} di burro a cubetti e scalda al microonde a intervalli di 20 secondi, mescolando ogni volta; di solito ne bastano due o tre. Smetti quando rimane ancora qualche scaglia intera e lasciala sciogliere mescolando: il cioccolato surriscaldato diventa opaco e granuloso. Il composto deve restare ben caldo fino al momento di usarlo; se si raffredda, riscaldalo per qualche secondo." },
        { titolo: "Montare uova e zucchero", testo: "Nella ciotola stretta rompi le {uovo}, aggiungi {zucchero} di zucchero e avvia le fruste a bassa velocità per una trentina di secondi, poi passa alla velocità massima per 5-6 minuti. Il composto è pronto quando ha almeno raddoppiato di volume, è diventato color crema chiaro e, sollevando le fruste, ricade formando un nastro che resta visibile in superficie per qualche secondo. Strofina una goccia fra pollice e indice: se senti ancora i granelli di zucchero, monta un altro minuto. Da questo passaggio dipende quasi tutta la crosta." },
        { titolo: "Unire burro e cioccolato", testo: "Riporta le fruste alla velocità minima e versa burro e cioccolato caldi a filo sottile, lungo il bordo della ciotola, senza interrompere. Il composto perderà parte del volume e diventerà scuro e lucido: è normale." },
        { titolo: "Unire la crema di frutta", testo: "Aggiungi la crema di frutta e yogurt in due volte, mescolando con le fruste a velocità minima per pochi secondi ciascuna, solo finché non scompaiono le striature chiare. Da qui in avanti metti da parte le fruste: un impasto con la frutta, lavorato troppo, perde l’aria e diventa compatto." },
        { titolo: "Aggiungere le polveri", testo: "Setaccia direttamente sul composto {cacao} di cacao, {farina} di farina e {sale} di sale. Incorporali con la spatola, con movimenti ampi dal basso verso l’alto, ruotando la ciotola di un quarto di giro a ogni passata, e fermati appena non vedi più tracce di polvere asciutta: mescolare oltre sviluppa il glutine e rende il brownie gommoso. L’impasto finito è morbido e lucido, un poco più fluido di quello dei brownies al burro." }
      ]
    },
    {
      titolo: "Cottura in friggitrice ad aria",
      passi: [
        { titolo: "Preriscaldamento", testo: "Preriscalda la friggitrice a 160 °C per 3 minuti, con il cestello vuoto." },
        { titolo: "Stampo nel cestello", testo: "Estrai il cestello caldo, appoggialo su un sottopentola e sistemaci dentro lo stampo vuoto: il silicone, riempito prima, si deformerebbe durante il trasporto. Versa l’impasto raccogliendolo tutto con la spatola, spingilo fino agli angoli e livellalo; batti delicatamente il cestello due o tre volte, perché le bolle d’aria più grosse salgano in superficie. Distribuisci {granella} di granella, premendola appena perché aderisca." },
        { titolo: "Cottura", testo: "Reinserisci il cestello e cuoci a 160 °C per 25-30 minuti, qualche minuto in più della versione al burro, perché la frutta porta acqua che deve evaporare. Nei primi 10 minuti non aprire: la crosta si forma proprio in questa fase. Verso il dodicesimo minuto controlla la superficie: quando è già screpolata e ben colorita, coprila con un foglio d’alluminio rimboccato sotto i bordi dello stampo, così che la ventola non lo sollevi, e prosegui." },
        { titolo: "Prova di cottura", testo: "Dal ventitreesimo minuto controlla con uno stecchino infilato al centro: deve uscire con qualche briciola umida attaccata, non pulito e nemmeno coperto d’impasto liquido. A cottura giusta la superficie è asciutta, opaca e screpolata, i bordi si staccano leggermente dalle pareti e il centro, premuto con un dito, cede appena. Con la frutta il centro resta per natura un po’ più umido: non scambiarlo per crudo se lo stecchino porta briciole e non impasto. Se esce bagnato, prosegui a intervalli di 2 minuti." }
      ]
    },
    {
      titolo: "In alternativa, cottura in forno",
      passi: [
        { titolo: "Forno e stampo", testo: "Preriscalda il forno statico a 170 °C, con la griglia a metà altezza. Appoggia lo stampo di silicone vuoto su una teglia di metallo, che lo rende stabile e trasmette meglio il calore al fondo, poi riempilo e completa con la granella come sopra." },
        { titolo: "Cottura", testo: "Cuoci per 28-32 minuti, senza aprire lo sportello nei primi 15. Se dopo 20 minuti la superficie è già scura, coprila con un foglio d’alluminio. La prova dello stecchino è la stessa della friggitrice. Il forno ventilato asciuga meglio la crosta ma scurisce prima: se usi quello, abbassa a 160 °C e controlla dal ventesimo minuto." }
      ]
    },
    {
      titolo: "Raffreddamento, taglio e servizio",
      passi: [
        { titolo: "Primo riposo", testo: "Lascia lo stampo nel cestello, o sulla teglia, per 10 minuti, poi trasferiscilo su una griglia sostenendolo da sotto con una paletta larga o un tagliere: da caldo il silicone è molle e, sollevato dai bordi, si piegherebbe spaccando il brownie." },
        { titolo: "Raffreddamento completo", testo: "Lascialo raffreddare del tutto, senza coprirlo, per almeno un’ora: un coperchio tratterrebbe il vapore, che condensando ammorbidirebbe subito la crosta. Con la frutta questa attesa è ancora più importante, perché da caldo l’interno è troppo tenero per essere tagliato." },
        { titolo: "Sformatura e taglio", testo: "Piega le pareti di silicone per staccarle, capovolgi lo stampo su un tagliere e rigira il brownie con la crosta verso l’alto. Taglialo in {porzioni} pezzi con un coltello affilato, con tre tagli in un senso e due nell’altro, premendo la lama dall’alto invece di segare e pulendola con un panno umido tra un taglio e l’altro." },
        { titolo: "Servizio", testo: "Danno il meglio nelle prime ore dopo il raffreddamento, quando la crosta è ancora friabile. Sono ottimi anche con un cucchiaio di yogurt greco a parte, che con la versione alla mela richiama un dolce di mele e cannella." }
      ]
    },
    {
      titolo: "Conservazione",
      passi: [
        { titolo: "Dove tenerli", testo: "Per la giornata tienili a temperatura ambiente, sotto una campana di vetro o in una scatola di latta. Se devono durare di più, passali in frigorifero in un contenitore chiuso, dove si conservano fino a tre giorni: la frutta e lo yogurt li rendono più deperibili dei brownies al burro. In frigorifero la crosta si ammorbidisce, ma l’interno resta umido e diventa quasi cremoso." },
        { titolo: "Per renderli di nuovo croccanti", testo: "Tirali fuori dal frigorifero un quarto d’ora prima, poi passali 3 minuti in friggitrice a 150 °C, o 5 minuti in forno alla stessa temperatura, e lasciali raffreddare una decina di minuti prima di servirli: il calore asciuga la superficie e, una volta tiepidi, tornano croccanti." }
      ]
    },
    {
      titolo: "Se qualcosa va storto",
      passi: [
        { titolo: "Crosta assente o troppo sottile", testo: "Di solito lo zucchero non si è sciolto del tutto, perché le uova sono state montate poco o il cioccolato era ormai tiepido, oppure la frutta era troppo acquosa. La volta successiva prolunga la montatura, asciuga meglio la purea e scola lo yogurt. Se vuoi una superficie ancora più croccante, prima di infornare spolvera la superficie con un cucchiaino raso di zucchero semolato insieme alla granella: aggiunge circa 3 kcal a pezzo e forma una crosticina zuccherina che resiste più a lungo." },
        { titolo: "Interno crudo o colloso", testo: "La frutta era troppa o non abbastanza asciutta, oppure la cottura è stata breve. Usa una sola banana media per la dose originale, asciuga bene la mela e prolunga la cottura di qualche minuto, coprendo con l’alluminio se la superficie scurisce." },
        { titolo: "Puntini o sacche umide nell’interno", testo: "La banana non era ridotta del tutto in crema, oppure la mela è stata usata cruda. La volta successiva frullala insieme allo yogurt." },
        { titolo: "Troppo sapore di banana", testo: "Usa una banana matura ma non nera del tutto, oppure passa alla mela, che è più neutra e lascia emergere il cioccolato." },
        { titolo: "Gommosi o compatti", testo: "L’impasto è stato lavorato troppo dopo l’aggiunta della frutta o della farina. Unisci la crema di frutta con pochi giri di fruste a velocità minima e le polveri a mano, fermandoti appena spariscono le tracce asciutte." },
        { titolo: "Attaccati allo stampo", testo: "Sono stati sformati ancora caldi, oppure il cacao non copriva bene il fondo. Aspetta il raffreddamento completo e, se serve, passa la lama di un coltello a punta tonda lungo i bordi prima di piegare le pareti." }
      ]
    }
  ]
});
