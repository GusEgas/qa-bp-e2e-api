/**
 * Evaluación QA BP - E2E opción 2.
 * Ambiente de demostración: https://www.saucedemo.com
 * Alcance: login, dos artículos, carrito, checkout, confirmación.
 * Las credenciales son públicas de demostración.
 */

describe('E2E | SauceDemo | Flujo de compra', () => {
  it('completa una compra con dos artículos y verifica la confirmación', () => {
    const productos = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];

    // Paso 1: autenticación con un usuario estándar de demostración.
    cy.visit('/');
    cy.get('[data-test="username"]').type(Cypress.expose('sauceUser'));
    cy.get('[data-test="password"]').type(Cypress.expose('saucePassword'), { log: false });
    cy.get('[data-test="login-button"]').click();
    cy.location('pathname').should('eq', '/inventory.html');
    cy.get('.inventory_item').should('exist');

    // Paso 2: agregar exactamente dos productos identificables.
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    cy.get('.shopping_cart_badge').should('have.text', '2');

    // Paso 3: visualizar y comprobar el carrito.
    cy.get('.shopping_cart_link').click();
    cy.location('pathname').should('eq', '/cart.html');
    cy.get('.cart_item').should('have.length', 2);
    productos.forEach((nombre) => {
      cy.contains('.cart_item', nombre).should('be.visible');
    });
    cy.get('.cart_item .inventory_item_price').then(($precios) => {
      const subtotal = [...$precios].reduce((total, elemento) => {
        return total + Number(elemento.innerText.replace('$', '').trim());
      }, 0);
      expect(subtotal, 'subtotal calculado del carrito').to.be.greaterThan(0);
      cy.wrap(Number(subtotal.toFixed(2))).as('subtotalEsperado');
    });
    cy.screenshot('01-carrito-con-dos-productos');

    // Paso 4: completar los datos obligatorios del formulario de checkout.
    cy.get('[data-test="checkout"]').click();
    cy.location('pathname').should('eq', '/checkout-step-one.html');
    cy.get('[data-test="firstName"]').type('QA');
    cy.get('[data-test="lastName"]').type('Evaluacion');
    cy.get('[data-test="postalCode"]').type('170101');
    cy.get('[data-test="continue"]').click();
    cy.location('pathname').should('eq', '/checkout-step-two.html');
    productos.forEach((nombre) => {
      cy.contains('.cart_item', nombre).should('be.visible');
    });
    cy.get('@subtotalEsperado').then((subtotal) => {
      cy.get('.summary_subtotal_label').invoke('text').then((texto) => {
        const montoMostrado = Number(texto.match(/\$\s*(\d+\.\d{2})/)[1]);
        expect(montoMostrado, 'subtotal en resumen de checkout').to.eq(subtotal);
      });
    });
    cy.screenshot('02-resumen-previo-a-confirmacion');

    // Paso 5: finalizar compra y validar el mensaje exigido.
    cy.get('[data-test="finish"]').click();
    cy.location('pathname').should('eq', '/checkout-complete.html');
    cy.get('.complete-header').invoke('text').then((mensaje) => {
      expect(mensaje.trim().toUpperCase()).to.contain('THANK YOU FOR YOUR ORDER');
    });
    cy.get('.shopping_cart_badge').should('not.exist');
    cy.screenshot('03-confirmacion-compra');
  });
});
