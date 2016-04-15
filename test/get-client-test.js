'use strict';

const test = require('tape'),
      Client = require('../index.js'),
      getToken = require('./bearer-token.js');

getToken().then((accessToken) => {
  const options = { 
    baseUrl: 'http://localhost:8080/auth/realms/master',
    accessToken: accessToken 
  };

  test('Getting a client should return an object with the provided clientId', (t) => {
    let client = Client(options);
    client.create().then((v) => {
      client.get(v.clientId).then((o) => {
        t.equal(o.clientId, v.clientId);
        t.end();
      }).catch((e) => {
        console.error(e.stack);
        t.fail(e);
      });
    }).catch((e) => {
      console.error(e.stack);
      t.fail(e);
    });    
  });
  
  test('Getting a non-existent client should return what', (t) => {
    let client = Client(options);
    client.get('tacos').then((o) => {
      t.fail('Client should not be found');
    }).catch((e) => {
      t.equal(e, 'Not Found');
      t.end();
    });
  });
  
}).catch((e) => {
  console.error("Are you sure a Keycloak server is running?");
  process.kill(process.pid);
});

