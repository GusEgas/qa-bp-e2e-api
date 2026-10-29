# Matriz de trazabilidad de la evaluación QA

Capturas E2E en `cypress/screenshots/compra-saucedemo.cy.js/`; video en `cypress/videos/compra-saucedemo.cy.js.mp4`; casos API en `reports/api-evidencias.json`; resultados JUnit en `reports/junit/*.xml`; salida de consola en `reports/logs/`.

| ID | Requisito del enunciado | Test / sección | Verificación (aserción) | Evidencia |
|---|---|---|---|---|
| E2E-01 | Autenticarse con `standard_user` / `secret_sauce` | `compra-saucedemo.cy.js` paso 1 | Ruta `/inventory.html` e inventario visible | Video `compra-saucedemo.cy.js.mp4`; `reports/junit/*.xml` |
| E2E-02 | Agregar dos productos | `compra-saucedemo.cy.js` paso 2 | Dos artículos distintos (Sauce Labs Backpack y Sauce Labs Bike Light); badge del carrito = `2` | `01-carrito-con-dos-productos.png`; video; JUnit |
| E2E-03 | Visualizar y verificar carrito | `compra-saucedemo.cy.js` paso 3 | Ruta `/cart.html`, 2 filas con ambos nombres; suma de precios del carrito = subtotal mostrado en el resumen | `01-carrito-con-dos-productos.png`, `02-resumen-previo-a-confirmacion.png`; JUnit |
| E2E-04 | Completar formulario de compra | `compra-saucedemo.cy.js` paso 4 | Nombre, apellido y código postal; ruta `/checkout-step-two.html` con ambos artículos | `02-resumen-previo-a-confirmacion.png`; video |
| E2E-05 | Finalizar compra | `compra-saucedemo.cy.js` paso 5 | Ruta `/checkout-complete.html`, texto `THANK YOU FOR YOUR ORDER` y carrito vacío | `03-confirmacion-compra.png`; video; JUnit |
| API-01 | Crear un usuario | `usuarios-petstore.cy.js` caso 1 | `POST /user` → HTTP 200 | `reports/api-evidencias.json` caso 1; JUnit |
| API-02 | Buscar usuario creado | `usuarios-petstore.cy.js` caso 2 | `GET /user/{username}` → HTTP 200; `username`, `firstName` y `email` coinciden | `reports/api-evidencias.json` caso 2; JUnit |
| API-03 | Actualizar nombre y correo | `usuarios-petstore.cy.js` caso 3 | `PUT /user/{username}` con `firstName` y `email` nuevos → HTTP 200 | `reports/api-evidencias.json` caso 3; JUnit |
| API-04 | Buscar usuario actualizado | `usuarios-petstore.cy.js` caso 4 | `GET /user/{username}` → HTTP 200; nuevo `firstName` y nuevo `email` | `reports/api-evidencias.json` caso 4; JUnit |
| API-05 | Eliminar usuario | `usuarios-petstore.cy.js` caso 5 | `DELETE /user/{username}` → HTTP 200 | `reports/api-evidencias.json` caso 5; JUnit |
| API-06 | Validación adicional: GET tras DELETE | `usuarios-petstore.cy.js` caso 6 | `GET /user/{username}` → HTTP 404 | `reports/api-evidencias.json` caso 6; JUnit |
| ENT-01 | Pasos de ejecución | `readme.txt`, `README.md` | Instrucciones paso a paso para PowerShell | Archivos en la raíz del repositorio |
| ENT-02 | Hallazgos y conclusiones | `conclusiones.txt` | Resultados reales, hallazgos, limitaciones y recomendaciones | `conclusiones.txt`; `reports/logs/*.log` |
| ENT-03 | Archivos, scripts, reportes | Raíz, `cypress/`, `scripts/`, `reports/` | Repositorio reproducible con `package-lock.json` | `reports/junit/`, `reports/api-evidencias.json`, `reports/logs/`, `cypress/screenshots/`, `cypress/videos/` |
| ENT-04 | Único repositorio público | GitHub | Incluye tanto E2E como API | Repositorio público único (URL en `conclusiones.txt`) |
| ENT-05 | ZIP/RAR entregable | `scripts/crear-entrega.ps1` | Código, docs, scripts y evidencias; sin `node_modules`, `.git` ni secretos | `Entrega_QA_BP_E2E_API_FINAL.zip` |

## Criterios de aprobación

Los tests solo deben marcarse **PASS** si Cypress devuelve código de salida 0, genera reportes reales y se verifican los mensajes y valores esperados. El análisis de código (`npm run check`) no es sustituto de la ejecución real.
