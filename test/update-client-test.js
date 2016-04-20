'use strict';

const test = require('tape'),
      get = require('../index.js').get,
      create = require('../index.js').create,
      update = require('../index.js').update,
      getToken = require('./bearer-token.js');

getToken().then((accessToken) => {
  const options = { 
    endpoint: 'http://localhost:8080/auth/realms/master/clients-registrations',
    accessToken: accessToken 
  };

  test('Updating a client should return an object with an updated client object', (t) => {
    create(options).then((v) => {
      const client = {
        clientId: v.clientId,
        attributes: {
          color: 'green'
        } 
      };
      update(options, client).then((o) => {
        t.equal(o.clientId, client.clientId);
        t.equal(o.attributes.color, client.attributes.color);
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
  
  test('Updating a non-existent client should fail with Not Found', (t) => {
    const client = {
      clientId: 'tacos'
    };
    update(options, client).then((o) => {
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

