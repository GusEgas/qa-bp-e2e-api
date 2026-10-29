# Evaluación técnica QA — Banco Pichincha

Proyecto único para los **dos ejercicios obligatorios** de la pregunta 22/22.

## Selección de opciones

| Bloque | Opción elegida | Tecnología | Objetivo |
|---|---|---|---|
| Automatización E2E | **2 — SauceDemo** | Cypress | Login y compra de dos artículos hasta mensaje de confirmación |
| API REST | **3 — Swagger Petstore v2** | Cypress `cy.request()` | Crear, buscar, actualizar, volver a buscar y eliminar un usuario |

Las otras 2 opciones E2E y las otras 2 opciones de API **no** se desarrollan porque el enunciado exige escoger una por bloque.

## Requisitos

- Node.js 20+ (verificado con **Node.js 24.13.0** y **npm 11.6.2**).
- **Cypress 16.2.0**, fijado en `package.json` y `package-lock.json` (se instala con `npm install`).
- Verificado en **Windows 11 Pro** con PowerShell; navegador por defecto Electron (Chrome/Edge/Firefox opcionales).
- Internet para `npm install` y para acceder a SauceDemo y Swagger Petstore.

## Ejecución en Windows PowerShell

```powershell
cd qa-bp-e2e-api
Remove-Item Env:ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue   # solo en la terminal integrada de VS Code
npm install
npm run check                 # validación de estructura y sintaxis; NO ejecuta pruebas reales
npm run test:e2e              # E2E SauceDemo
npm run test:api              # API Swagger Petstore v2
npm test                      # ambas suites
.\scripts\crear-entrega.ps1   # genera el ZIP de entrega en la carpeta superior
```

Modo interactivo: `npm run test:open`. En Linux/macOS los comandos npm son los mismos.

## E2E SauceDemo — flujo completo

1. Abrir `https://www.saucedemo.com` y autenticar con las credenciales públicas `standard_user` / `secret_sauce`.
2. Añadir **Sauce Labs Backpack** y **Sauce Labs Bike Light** al carrito.
3. Verificar badge **2**, ambos artículos y subtotal calculado.
4. Ir a checkout, rellenar nombre, apellido y código postal de prueba.
5. Verificar resumen e importe, finalizar y comprobar el mensaje **THANK YOU FOR YOUR ORDER**.

El test usa selectores de prueba `data-test` donde están disponibles, además de comprobaciones de URL y contenido. No se realiza ninguna transacción financiera real.

## API Petstore — casos exigidos

Base: `https://petstore.swagger.io/v2` (API **v2** del enunciado, no confundir con Petstore3).

| Caso | Método y ruta | Entrada | Salida / validación |
|---|---|---|---|
| 1. Crear usuario | `POST /user` | Usuario único, correo y datos sintéticos | HTTP 200 |
| 2. Buscar usuario creado | `GET /user/{username}` | `username` generado | HTTP 200 y campos coincidentes |
| 3. Actualizar nombre y correo | `PUT /user/{username}` | Objeto con `firstName` y `email` nuevos | HTTP 200 |
| 4. Buscar usuario actualizado | `GET /user/{username}` | `username` | HTTP 200 y datos actualizados |
| 5. Eliminar usuario | `DELETE /user/{username}` | `username` | HTTP 200 |
| Validación adicional | `GET /user/{username}` | `username` | HTTP 404 |

La suite genera un nombre único por ejecución para evitar colisiones y guarda peticiones y respuestas reales en `reports/api-evidencias.json`, con la contraseña enmascarada (`[REDACTED]`). Los `GET` tienen como máximo 3 reintentos acotados por la consistencia eventual de la API pública compartida.

## Estructura

```text
qa-bp-e2e-api/
├── cypress.config.js
├── cypress/
│   ├── e2e/
│   │   ├── compra-saucedemo.cy.js
│   │   └── usuarios-petstore.cy.js
│   ├── screenshots/              # evidencias E2E (generadas)
│   └── videos/                   # videos de ejecución (generados)
├── docs/matriz-trazabilidad.md
├── reports/
│   ├── README.md
│   ├── api-evidencias.json       # request/response API (generado)
│   ├── junit/                    # resultados JUnit XML (generados)
│   └── logs/                     # salida de consola de cada ejecución
├── scripts/
│   ├── validar-proyecto.mjs
│   ├── publicar-github.ps1
│   └── crear-entrega.ps1
├── readme.txt
├── conclusiones.txt
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── .github/workflows/qa.yml
```

## Reportes y evidencias

Al ejecutar las pruebas se generan los siguientes archivos (**no están simulados ni pre-rellenados**):

- `reports/junit/resultado-<hash>.xml`: resultado JUnit por spec.
- `reports/api-evidencias.json`: request, response, HTTP status y duración por cada caso.
- `reports/logs/test-e2e.log`, `reports/logs/test-api.log`, `reports/logs/test-all.log`: salida de consola de `npm run test:e2e`, `npm run test:api` y `npm test`.
- `cypress/screenshots/compra-saucedemo.cy.js/`: capturas de carrito, resumen y confirmación de compra.
- `cypress/videos/`: video de ejecución por spec.

Los resultados reales (fecha, entorno, versiones, tiempos y estado de cada prueba) están documentados en **`conclusiones.txt`**. La trazabilidad requisito → aserción → evidencia está en `docs/matriz-trazabilidad.md`. El workflow `.github/workflows/qa.yml` (ejecución manual) también conserva un artifact descargable con los reportes.

## Solución de problemas

1. **`bad option: --smoke-test` o falla `npx cypress verify` en la terminal de VS Code.** La terminal integrada hereda `ELECTRON_RUN_AS_NODE=1`, que impide arrancar el binario de Cypress. Ejecutar antes de los comandos npm:
   ```powershell
   Remove-Item Env:ELECTRON_RUN_AS_NODE
   ```
   o usar una ventana de PowerShell externa.
2. **`Cypress.env() was removed in Cypress version 16.0.0`.** Cypress 16 eliminó `Cypress.env()`. El proyecto usa el bloque `expose` de `cypress.config.js` y `Cypress.expose()`. Para sobrescribir valores desde la línea de comandos:
   ```powershell
   npx cypress run --expose sauceUser=standard_user,petstoreApiUrl=https://petstore.swagger.io/v2
   ```
3. **Sitios públicos no disponibles** (SauceDemo o Petstore caídos, timeouts, HTTP 5xx). No es un defecto del código de prueba: reportar el resultado como **BLOCKED** con fecha/hora, log de `reports/logs/`, captura y código HTTP, y reintentar más tarde.
4. **`npm install` tarda varios minutos** la primera vez: descarga el binario de Cypress en `%LOCALAPPDATA%\Cypress\Cache`.

## Entrega

1. Ejecutar `npm test`, revisar reportes y corregir cualquier fallo real.
2. Subir estos archivos a **un solo repositorio público** de GitHub (`scripts/publicar-github.ps1` lo automatiza tras `gh auth login`).
3. Regenerar el ZIP con las evidencias reales: `.\scripts\crear-entrega.ps1` desde PowerShell.
4. Adjuntar el ZIP en el portal de selección.
5. Pegar **una única URL** del repositorio en los comentarios de la prueba.
