# Atles · La màquina comuna — iteració 1

07.11.2026 · Alineació amb l’informe doctoral 0.7 i l’estructura de capítols 0.5 aportats per la investigadora. Els documents complets no s’incorporen al web. El pilot intern anterior conserva les fonts i versions amb què es va construir.

## Criteri de revisió

Les 14 dimensions tenen identificadors estables C01–C14. El tipus o categoria d’un recurs no assigna un estat d’evidència. Els registres sense revisió ofereixen preguntes, sense simular observacions individualitzades. Les descripcions de l’inventari continuen sent exploratòries.

Cada revisió separa estat, observació, interpretació/límits, següent contrast, fonts amb localitzador, consulta i autoria/data de revisió. Pendent, lectura parcial, observació documentada, prova d’ús documentada i no aplicable són estats descriptius; no formen una escala de qualitat.

El primer perfil específic és PAL01 (Foundry Ontology), basat en les fonts del proveïdor ja consultades. Les observacions documentades només acrediten funcionalitats descrites. El desplegament, la comprensió d’usuaris, l’accessibilitat i els efectes continuen pendents. No s’extrapola a Gotham. L’historial Git conserva l’antiga representació en arrays; les revisions estructurades són la dada vigent.

## Persistència i exportació

Les revisions personals es guarden a `atles.reviews.v1`, només al navegador. Les notes i desats anteriors mantenen les seves claus. No s’envien continguts al servidor ni a l’analítica. Un error d’emmagatzematge no es presenta com un desament reeixit.

Cada revisió local substitueix només la dimensió corresponent. Tornar al perfil del catàleg arxiva la revisió, mantenint l’historial a l’exportació. El perfil publicat no es modifica. JSON v2 inclou criteris, estats efectius, fonts, interpretacions, revisions locals i historial, notes i desats. Encara no hi ha importació o sincronització de revisions entre dispositius.

Filtre d’estat: totes les dimensions pendents; almenys una observació/prova documentada; almenys una revisió personal activa. No són filtres d’eficàcia. Les comparacions inclouen estat, interpretació i referències per dimensió.

## Abast i pròxima iteració

Aquesta entrega implementa estats i traçabilitat per dimensió, editor local, filtre, exportació i marc doctoral actualitzat. No constitueix una revisió bibliogràfica nova ni una anàlisi íntegra dels 143 recursos.

La següent iteració pot incorporar una mostra petita de recursos amb lectura individual, correspondències bibliogràfiques i dossiers de viabilitat. L’editor de casos, importació/sincronització, operacions de representació i cadena de derivació del kit queden pendents.

`build_data.py` és el generador històric de l’inventari: no s’ha d’executar per actualitzar les revisions. La font actual és `public/data.json`.

## Validació

Proves de filtres i catàleg, perfil Palantir, revisions, exportació/historial, persistència amb fallades, escapament, exclusió de contingut D14, pilot de recerca i analítica SQLite. Revisió visual pendent: el relay de previsualització no està disponible en aquest entorn.
