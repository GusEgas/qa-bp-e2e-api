EVALUACIÓN PRÁCTICA QA BP — INSTRUCCIONES DE EJECUCIÓN
===================================================

SELECCIÓN SEGÚN ENUNCIADO
- E2E: opción 2 - SauceDemo, compra con dos productos.
- API: opción 3 - Swagger Petstore v2, CRUD de usuarios.
- Las opciones alternativas NO se implementan por indicación expresa del examen.

REQUISITOS (VERIFICADOS)
- Node.js 20 o superior (verificado con Node.js 24.13.0 y npm 11.6.2).
- Cypress 16.2.0 (fijado en package.json y package-lock.json).
- Verificado en Windows 11 Pro con PowerShell.
- Conexión a Internet (npm install, SauceDemo y Petstore).

PASOS EN WINDOWS POWERSHELL
1. Descomprimir el ZIP y abrir PowerShell en la carpeta qa-bp-e2e-api:
     cd qa-bp-e2e-api
2. SOLO si se usa la terminal integrada de VS Code:
     Remove-Item Env:ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue
3. Instalar dependencias:      npm install
4. Validación estática:         npm run check
5. Ejecutar E2E SauceDemo:      npm run test:e2e
6. Ejecutar API Petstore:       npm run test:api
7. Ejecutar ambas suites:       npm test
8. Generar ZIP de entrega:      .\scripts\crear-entrega.ps1
   Modo interactivo opcional:   npm run test:open

ESCENARIOS
- E2E: login standard_user/secret_sauce -> agregar Sauce Labs Backpack y
  Sauce Labs Bike Light -> badge 2 -> carrito con 2 artículos y subtotal ->
  checkout (nombre, apellido, código postal) -> resumen con el mismo subtotal
  -> Finish -> mensaje THANK YOU FOR YOUR ORDER.
- API (https://petstore.swagger.io/v2): POST /user -> GET /user/{username}
  -> PUT /user/{username} (nuevo firstName y email) -> GET (verifica cambios)
  -> DELETE /user/{username} -> GET adicional esperando 404.

EVIDENCIAS GENERADAS AL EJECUTAR
- reports/junit/resultado-<hash>.xml : resultado JUnit por spec.
- reports/api-evidencias.json : request/response y código HTTP de cada caso.
- reports/logs/test-e2e.log, test-api.log, test-all.log : salida de consola.
- cypress/screenshots/compra-saucedemo.cy.js/ : 01 carrito, 02 resumen,
  03 confirmación de compra.
- cypress/videos/ : video de ejecución por spec.
- Los resultados reales (fecha, entorno, tiempos, estado) están en
  conclusiones.txt. Trazabilidad en docs/matriz-trazabilidad.md.

RESULTADOS VERIFICADOS (2026-10-28, Windows 11, Node 24.13.0, Cypress 16.2.0)
- npm run check     : PASS
- npm run test:e2e  : PASS (1/1)
- npm run test:api  : PASS (1/1; 6/6 códigos HTTP esperados, incluido 404)
- npm test          : PASS (2/2, "All specs passed!")
- GitHub Actions    : PASS (2/2, workflow qa.yml en ubuntu-latest)
- Detalle, hallazgos y limitaciones: conclusiones.txt

SOLUCIÓN DE PROBLEMAS
1. "bad option: --smoke-test" o falla "npx cypress verify" en VS Code:
   la terminal integrada hereda ELECTRON_RUN_AS_NODE=1. Ejecutar
     Remove-Item Env:ELECTRON_RUN_AS_NODE
   o usar una ventana de PowerShell externa.
2. "Cypress.env() was removed in Cypress version 16.0.0": Cypress 16 eliminó
   Cypress.env(). El proyecto usa el bloque "expose" de cypress.config.js y
   Cypress.expose(). Para sobrescribir valores:
     npx cypress run --expose sauceUser=standard_user
3. Sitios públicos no disponibles (timeouts, HTTP 5xx): reportar BLOCKED con
   fecha/hora, log de reports/logs, captura y código HTTP; reintentar luego.
4. npm install tarda varios minutos la primera vez (descarga Cypress).

NOTAS IMPORTANTES
- SauceDemo es una demo pública: no se efectúa ningún pago real.
- Petstore v2 es una API pública con datos compartidos: se genera un username
  único en cada ejecución y se elimina al terminar.
- No se guardan contraseñas en el JSON de evidencias ([REDACTED]).
- El ZIP NO incluye node_modules ni .git: npm install descarga dependencias.

GITHUB
Repositorio PÚBLICO único con ambas soluciones:
  https://github.com/GusEgas/qa-bp-e2e-api
El workflow .github/workflows/qa.yml permite lanzar las pruebas en
Actions > Run workflow. scripts/publicar-github.ps1 publica con GitHub CLI
(requiere gh auth login).

Más información: README.md, docs/matriz-trazabilidad.md, conclusiones.txt.
