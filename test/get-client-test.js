'use strict';

const test = require('tape'),
      get = require('../index.js').get,
      create = require('../index.js').create,
      getToken = require('./bearer-token.js');

getToken().then((accessToken) => {
  const options = { 
    endpoint: 'http://localhost:8080/auth/realms/master/clients-registrations',
    accessToken: accessToken 
  };

  test('Getting a client should return an object with the provided clientId', (t) => {
    create(options).then((v) => {
      get(options, v.clientId).then((o) => {
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
  
  test('Getting a non-existent client should fail', (t) => {
    get(options, 'tacos').then((o) => {
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

