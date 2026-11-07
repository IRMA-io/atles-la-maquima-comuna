# Atles · La màquina comuna

Instrument de treball per explorar recursos de participació, codisseny, coneixement distribuït i acció col·lectiva. Forma part del projecte doctoral **La màquina comuna · Coneixement distribuït i acció col·lectiva en l’era de la intel·ligència artificial**.

## Què inclou

- 143 registres exploratoris, filtres per necessitat, regió, tipus, llengua, suport i estat de revisió.
- 14 dimensions d’anàlisi comunes, sense puntuació agregada.
- Estats per dimensió: pendent, lectura parcial, observació documentada, prova d’ús documentada i no aplicable justificat.
- Fonts i localitzadors, separació d’observacions i interpretacions, revisions personals, notes, selecció i exportació JSON amb historial.
- Comparació de fins a quatre recursos.
- Perfil documental de Foundry Ontology i eix Palantir; pilot metodològic sobre representació, aprenentatge i decisió.

Les dimensions pendents són preguntes de treball, no revisions individualitzades ja executades. La documentació d’un proveïdor no acredita eficàcia en un desplegament. El perfil de Foundry no es generalitza a Gotham ni a tots els productes de Palantir.

## Consultar o desenvolupar

Node.js 24 permet executar totes les proves, incloses les de SQLite. No hi ha dependències de tercers per instal·lar.

```sh
npm test
npm run build
```

La versió estàtica queda a `dist/`. Es pot servir, per exemple, amb:

```sh
python3 -m http.server 8000 --directory dist
```

Obre `http://localhost:8000`. Cal un servidor HTTP; no obris directament `index.html` com a fitxer, perquè el catàleg es carrega amb `fetch`.

## GitHub Pages

`npm run build:pages` genera `docs/` amb navegació relativa per al subdirectori del projecte, els 143 registres, un avís d’autoria i les condicions d’ús. No incorpora el client d’analítica ni el backend de Sites.

La font de publicació és **main /docs** a **Settings → Pages → Deploy from a branch**. Cal activar-la a GitHub; la presència dels fitxers no acredita que el web ja estigui publicat. Els canvis enviats a aquesta carpeta es publiquen quan Pages està activat. Si es modifiquen els originals de `public/`, cal regenerar i enviar `docs/`.

Aquesta publicació és independent del web privat de Sites. Les notes, revisions i seleccions locals de cada domini no se sincronitzen automàticament.

## Dades personals i continuïtat

Les notes, desats, recursos afegits i revisions personals es guarden al navegador. No es publiquen al repositori ni se sincronitzen amb altres dispositius. «Exporta JSON» permet conservar les dades, fonts i historial; encara no hi ha importació.

Aquest repositori conté codi i dades del catàleg. No incorpora documents privats del doctorat, sessions de navegació, base de dades analítica, credencials, identificadors del compte o configuració del projecte allotjat. La còpia publicada correspon a la versió 0.4.0 i s’ha preparat per GitHub separadament del repositori de desplegament de Sites; les actualitzacions no se sincronitzen automàticament.

## Analítica opcional

La versió estàtica funciona sense servidor d’analítica; el registre d’ús i el panell no estan disponibles en aquest mode.

El codi opcional de `worker/` i `drizzle/` implementa esdeveniments agregats, separació de visites pròpies, accés de propietària i conservació de 90 dies. **Depèn de la identitat autenticada injectada per Sites.** Les capçaleres d’identitat no s’han de confiar en un desplegament que accepti peticions directes sense aquesta protecció.

Per preparar un Worker en un projecte Sites propi, configura el seu `.openai/hosting.json` local amb l’ID retornat per Sites i el binding D1 `DB`, aplica la migració i executa `npm run build:worker`. Si cal, `ATLES_OWNER_ID` es proporciona com a variable d’entorn de compilació; l’alternativa de correu propietari és una variable privada del runtime.

L’API queda desactivada per defecte a la còpia de GitHub. `ATLES_ENABLE_SITES_ANALYTICS=true` només s’ha de configurar al runtime protegit de Sites, després de configurar identitat i D1. No s’han de versionar fitxers d’entorn o credencials. Vegeu `ANALYTICS.md` per al funcionament del backend original.

## Estructura

| Ruta | Contingut |
|---|---|
| `public/` | Interfície, catàleg i pàgines de recerca |
| `worker/` | Backend opcional d’analítica |
| `drizzle/` | Migració SQLite/D1 |
| `scripts/` | Compilació i proves |
| `REVIEW-METHOD.md` | Estats, procedència i abast de les revisions |
| `RESEARCH-PILOT.md` | Fonts i límits del pilot intern |
| `ANALYTICS.md` | Disseny del registre d’ús |

## Estat i drets

Prototip de recerca amb classificacions provisionals, no un protocol doctoral aprovat ni una avaluació general dels recursos. Les proves automàtiques no substitueixen la revisió visual ni les proves amb participants; la revisió visual de l’última iteració continua pendent.

**Titular indicat: sistema-io (GitHub: IRMA-io).** Política vigent des del 7 de novembre de 2026:

- **Codi original:** [PolyForm Noncommercial 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0), amb avisos obligatoris d’atribució.
- **Textos, diagrames i materials metodològics originals sobre els quals es poden concedir drets:** [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/), amb atribució, ús no comercial i compartir igual les adaptacions distribuïdes.
- Els recursos de tercers, fets, elements de domini públic i excepcions legals queden fora d’aquest canvi. Consulta els termes complets i l’abast a [LICENSE](LICENSE).
- Les restriccions no comercials signifiquen que aquesta distribució no es presenta com a programari open source segons l’OSI.

**Transició:** la versió ja publicada amb MIT continua documentada a l’[historial](https://github.com/IRMA-io/atles-eines-collectives/blob/99a3fb80b49fb666884024d868f596d73e472237/LICENSE). Aquesta política no retira retroactivament els permisos concedits sobre còpies anteriors. Tampoc s’afirma que ningú n’hagi obtingut còpies.

**Citació suggerida:** sistema-io. (2026). *Atles · La màquina comuna*. GitHub. https://github.com/IRMA-io/atles-eines-collectives — indica també la versió o el commit utilitzat.

La citació acadèmica suggerida no substitueix els avisos i requisits de cada llicència. Per a usos fora dels permisos concedits, cal una autorització expressa de la titular.
