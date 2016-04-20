'use strict';

const test = require('tape'),
  create = require('../index.js').create,
  getToken = require('./bearer-token.js');

getToken().then((accessToken) => {
  const options = {
    endpoint: 'http://localhost:8080/auth/realms/master/clients-registrations',
    accessToken: accessToken
  };
  
  test('Creating a client should return an object with a clientId', (t) => {
    create(options).then((v) => {
      t.equal(v.statusMessage, 'Created');
      t.equal(v.statusCode, 201);
      t.notEqual(v.clientId, undefined);
      t.equal(typeof v.clientId, 'string');
      t.end();
    }).catch((e) => {
      console.error(e.stack);
      t.fail(e);
    });
  });

  test('Creating a client should return an object with a provided clientId', (t) => {
    const rep = { clientId: Date.now().toString() };
    create(options, rep).then((v) => {
      t.equal(v.statusMessage, 'Created');
      t.equal(v.statusCode, 201);
      t.equal(v.clientId, rep.clientId);
      t.end();
    }).catch((e) => {
      console.error(e.stack);
      t.fail(e);
    });
  });
}).catch((e) => {
  console.error('Cannot get Initial Bearer Token. Are you sure a Keycloak server is running?');
  process.kill(process.pid);
});
