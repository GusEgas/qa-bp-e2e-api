# Reportes QA

Los reportes de ejecución se producen al ejecutar `npm run test:e2e`, `npm run test:api` o `npm test`:

- `junit/resultado-<hash>.xml`: status de pruebas desde Cypress (JUnit).
- `api-evidencias.json`: datos de solicitud y respuesta HTTP de los pasos CRUD (contraseña enmascarada).
- `logs/test-e2e.log`, `logs/test-api.log`, `logs/test-all.log`: salida completa de consola de cada ejecución, con hora de inicio/fin, código de salida y duración.
- Capturas: `../cypress/screenshots/`.
- Videos: `../cypress/videos/`.

Todas las evidencias incluidas provienen de ejecuciones reales contra SauceDemo y Swagger Petstore v2; el resumen de resultados está en `../conclusiones.txt`.
