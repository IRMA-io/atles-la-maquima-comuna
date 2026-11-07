# Analítica d'ús · versió 0.3

## Què es registra

- Càrrega de l'Atles (`site_view`).
- Obertura d'una fitxa del catàleg (`resource_view`).
- Clic cap al recurs original (`external_link`).

Cada registre inclou hora del servidor, dia/hora a Europe/Madrid, identificador del recurs (si escau), etiqueta pròpia/altra visita, identificador aleatori d'esdeveniment i hash d'una sessió temporal. No s'emmagatzemen identitat del visitant, correu, IP, ubicació, termes de cerca o notes en aquesta base.

La identitat d'accés de Sites es consulta només per separar les visites de la propietària i autoritzar el panell. No s'emmagatzema en els esdeveniments. El servidor no accepta l'etiqueta d'autoria del client.

## Preferències

La propietària ha demanat registrar les seves visites: s'activen inicialment, amb control de pausa a «Registre d'ús». La resta de visitants han d'activar el registre opcional. Rebutjar-lo no impedeix utilitzar el catàleg.

La preferència es desa al navegador. La sessió és aleatòria i temporal, amb renovació després de 30 minuts d'inactivitat o en una pestanya nova. No és un identificador de persona.

## Accés i conservació

Només la propietària pot consultar `/api/analytics/summary`. La política d'accés del Site es conserva. Els filtres permeten separar visites pròpies, altres visites i totes les visites.

Els resums no mostren registres de més de 90 dies. La ingesta següent elimina físicament aquests registres; no hi ha una tasca programada de purga. Les consultes mostren una finestra mòbil de 7, 30 o 90 dies. Les franges horàries segueixen Europe/Madrid, incloent horari d'estiu.

## Límits d'interpretació

Els recomptes són accions, no persones ni lectures confirmades. No es recuperen visites anteriors. Consentiment, manca de connexió i pestanyes separades afecten el recompte. Recursos afegits localment no es registren al servidor. Els resultats no acrediten qualitat metodològica ni aprenentatge. El registre d'ús no és consentiment per participar en recerca doctoral.

## Implementació

- Configuració privada: `ANALYTICS_OWNER_EMAIL` identifica la propietària via la capçalera verificada de Sites, sense guardar el correu als esdeveniments.
- D1: binding `DB` a `.openai/hosting.json`.
- Migració: `drizzle/0000_analytics.sql` i el seu diari de migracions.
- Servidor: `worker/api.mjs`.
- Client: `public/analytics.js`.
- Construcció: `node scripts/build.mjs` genera un Worker ESM amb els recursos estàtics integrats.
- Proves: `node scripts/test-analytics.mjs`, base SQLite en memòria. No introdueix esdeveniments a producció.

La base analítica és independent dels registres operatius de la plataforma d'allotjament.
