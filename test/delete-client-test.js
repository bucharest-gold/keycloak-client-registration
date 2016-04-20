'use strict';

const test = require('tape'),
      client = require('../index.js'),
      getToken = require('./bearer-token.js');

getToken().then((accessToken) => {
  const options = { 
    endpoint: 'http://localhost:8080/auth/realms/master/clients-registrations',
    accessToken: accessToken 
  };

  test('Deleting a client should return a 204 status code if successful', (t) => {
    client.create(options).then((v) => {
      client.remove(options, v.clientId).then((o) => {
        t.equal(o.statusCode, 204);
        t.equal(o.statusMessage, 'No Content');
        t.end();
      });
    }).catch((e) => {
      console.error(e.stack);
      t.fail(e);
    });
  });
  
  test('Deleting a non-existent client should fail with Not Found', (t) => {
    client.remove(options, 'enchilada').then((o) => {
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

