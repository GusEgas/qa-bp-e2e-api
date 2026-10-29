/**
 * Evaluación QA BP - API opción 3 (Swagger Petstore v2).
 * API pública con datos compartidos: se usa un usuario único por ejecución.
 * Casos: crear, buscar, actualizar nombre/correo, buscar actualización, eliminar.
 */

describe('API | Swagger Petstore v2 | CRUD de usuarios', () => {
  it('ejecuta los cinco casos requeridos y captura entradas y salidas', () => {
    const api = Cypress.expose('petstoreApiUrl').replace(/\/$/, '');
    const identificador = `${Date.now()}_${Cypress._.random(10000, 99999)}`;
    const username = `qa_bp_${identificador}`;
    const user = {
      id: Date.now(),
      username,
      firstName: 'Prueba',
      lastName: 'Automatizada',
      email: `${username}@example.test`,
      password: 'ClaveDemoQA2026!',
      phone: '0000000000',
      userStatus: 1,
    };
    const userActualizado = {
      ...user,
      firstName: 'Actualizado',
      email: `${username}.nuevo@example.test`,
    };
    const registro = {
      ejercicio: 'Opción 3: CRUD usuarios Swagger Petstore v2',
      endpointBase: api,
      generadoEn: new Date().toISOString(),
      username,
      casos: [],
    };

    // Enmascara contraseñas tanto de entradas como de respuestas.
    const sanear = (datos) => {
      if (Array.isArray(datos)) return datos.map(sanear);
      if (datos && typeof datos === 'object') {
        return Object.fromEntries(Object.entries(datos).map(([clave, valor]) => [
          clave,
          /password/i.test(clave) ? '[REDACTED]' : sanear(valor),
        ]));
      }
      return datos;
    };

    /**
     * Captura la solicitud y respuesta auténtica. Para GET, reintenta un máximo
     * de 3 veces si existe consistencia eventual en el servidor compartido.
     */
    const solicitar = (caso, method, path, body, codigoEsperado, validar = () => true) => {
      const url = `${api}${path}`;
      const ejecutar = (reintentosRestantes) => cy.request({
        method,
        url,
        body,
        failOnStatusCode: false,
        headers: { Accept: 'application/json' },
      }).then((respuesta) => {
        const valido = respuesta.status === codigoEsperado && validar(respuesta.body);
        if (method === 'GET' && !valido && reintentosRestantes > 0) {
          return cy.wait(1200).then(() => ejecutar(reintentosRestantes - 1));
        }
        registro.casos.push({
          caso,
          solicitud: {
            metodo: method,
            url,
            cuerpo: sanear(body ?? null),
          },
          respuesta: {
            codigoHttp: respuesta.status,
            cuerpo: sanear(respuesta.body),
            duracionMs: respuesta.duration,
          },
        });
        return cy.writeFile('reports/api-evidencias.json', registro).then(() => {
          expect(respuesta.status, `HTTP ${method} ${path} (${caso})`).to.eq(codigoEsperado);
          expect(validar(respuesta.body), `Datos de respuesta (${caso})`).to.eq(true);
          return respuesta;
        });
      });
      return ejecutar(method === 'GET' ? 3 : 0);
    };

    // Caso 1: crear un usuario nuevo (POST /user).
    solicitar('1. Crear usuario', 'POST', '/user', user, 200)
      .then(() => {
        // Caso 2: localizar al usuario por el nombre único (GET /user/{username}).
        return solicitar('2. Buscar usuario creado', 'GET', `/user/${username}`, null, 200,
          (datos) => datos?.username === username && datos?.firstName === user.firstName && datos?.email === user.email);
      })
      .then((respuesta) => {
        expect(respuesta.body.username).to.eq(username);
        expect(respuesta.body.firstName).to.eq(user.firstName);
        expect(respuesta.body.email).to.eq(user.email);
        // Caso 3: actualizar tanto nombre como correo (PUT /user/{username}).
        return solicitar('3. Actualizar nombre y correo', 'PUT', `/user/${username}`, userActualizado, 200);
      })
      .then(() => {
        // Caso 4: consultar el usuario actualizado (GET /user/{username}).
        return solicitar('4. Buscar usuario actualizado', 'GET', `/user/${username}`, null, 200,
          (datos) => datos?.username === username && datos?.firstName === userActualizado.firstName && datos?.email === userActualizado.email);
      })
      .then((respuesta) => {
        expect(respuesta.body.username).to.eq(username);
        expect(respuesta.body.firstName).to.eq(userActualizado.firstName);
        expect(respuesta.body.email).to.eq(userActualizado.email);
        // Caso 5: eliminar usuario (DELETE /user/{username}).
        return solicitar('5. Eliminar usuario', 'DELETE', `/user/${username}`, null, 200);
      })
      .then(() => {
        // Validación adicional: el recurso ya no debe encontrarse.
        return solicitar('6. Verificar eliminación (adicional)', 'GET', `/user/${username}`, null, 404);
      });
  });
});
