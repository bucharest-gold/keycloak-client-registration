'use strict';

const test = require('tape'),
      Client = require('../index.js'),
      getToken = require('./bearer-token.js');

getToken().then((accessToken) => {
  const options = { 
    baseUrl: 'http://localhost:8080/auth/realms/master',
    accessToken: accessToken 
  };
  execTests(options);
}).catch((e) => {
  console.error("Cannot get Initial Bearer Token. Are you sure a Keycloak server is running?");
  process.kill(process.pid);
});
      
function execTests(options) {
  test('The module should export a Client function', (t) => {
    t.equal(typeof Client, 'function');
    t.equal(Client.name, 'Client');
    t.end();
  });

  test('The Client function should return an object', (t) => {
    const client = Client();
    t.equal(typeof client, 'object');
    t.end();
  });

  test('The client object should have a provided accessToken property', (t) => {
    let client = Client();
    t.equal(client.accessToken, undefined);
    client = Client(options);
    t.deepEqual(client.accessToken, options.accessToken);
    t.end();
  });

  test('The client object should have a computed endpoint property', (t) => {
    let client = Client();
    t.equal(client.baseUrl, undefined);
    client = Client(options);
    t.deepEqual(client.endpoint, options.baseUrl + '/clients-registrations');
    t.end();
  });

  test('The client object should have a create function', (t) => {
    let client = Client(options);
    t.equal(typeof client.create, 'function');
    t.end();
  });

  test('Creating a client should return an object with a clientId', (t) => {
    let client = Client(options);
    client.create().then((v) => {
      t.equal(v.statusMessage, 'Created');
      t.equal(v.statusCode, 201);
      t.notEqual(v.clientId, undefined);
      t.equal(typeof v.clientId, 'string');
      t.end();
    }).catch((e) => {
      t.fail(e);
    });
  });

  test('Creating a client should return an object with a provided clientId', (t) => {
    const rep = { clientId: Date.now().toString() };
    let client = Client(options);
    client.create(rep).then((v) => {
      t.equal(v.statusMessage, 'Created');
      t.equal(v.statusCode, 201);
      t.equal(v.clientId, rep.clientId);
      t.end();
    }).catch((e) => {
      t.fail(e);
    });
  });
}