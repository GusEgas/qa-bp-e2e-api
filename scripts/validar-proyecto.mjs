import { existsSync, readFileSync } from 'node:fs';

const requeridos = [
  'package.json', 'cypress.config.js',
  'cypress/e2e/compra-saucedemo.cy.js',
  'cypress/e2e/usuarios-petstore.cy.js',
  'readme.txt', 'conclusiones.txt',
  'README.md', 'docs/matriz-trazabilidad.md',
  '.github/workflows/qa.yml',
];
let fallos = 0;
for (const archivo of requeridos) {
  if (!existsSync(archivo)) {
    console.error(`FALTA: ${archivo}`);
    fallos++;
  } else {
    console.log(`OK: ${archivo}`);
  }
}
const e2e = readFileSync('cypress/e2e/compra-saucedemo.cy.js', 'utf8');
const api = readFileSync('cypress/e2e/usuarios-petstore.cy.js', 'utf8');
for (const [etiqueta, codigo, tokens] of [
  ['E2E', e2e, ['login-button', 'add-to-cart-sauce-labs-backpack', 'add-to-cart-sauce-labs-bike-light', 'cart_item', 'firstName', 'postalCode', 'finish', 'THANK YOU FOR YOUR ORDER']],
  ['API', api, ['Crear usuario', 'Buscar usuario creado', 'Actualizar nombre y correo', 'Buscar usuario actualizado', 'Eliminar usuario', "'POST'", "'GET'", "'PUT'", "'DELETE'"]],
]) {
  for (const token of tokens) {
    if (!codigo.includes(token)) {
      console.error(`FALTA ${etiqueta}: ${token}`);
      fallos++;
    }
  }
}
if (fallos) {
  console.error(`Validación estática: ${fallos} problema(s).`);
  process.exit(1);
}
console.log('Validación ESTÁTICA satisfactoria. No equivale a ejecutar los tests remotos.');
