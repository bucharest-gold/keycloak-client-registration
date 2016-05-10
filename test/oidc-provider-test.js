'use strict';

const test = require('tape');
const registration = require('../index.js');
const getToken = require('./bearer-token.js');

getToken().then((accessToken) => {
  const options = {
    endpoint: 'http://localhost:8080/auth/realms/master/clients-registrations',
    accessToken: accessToken,
    client_name: 'RegistrationAccessTokensTest',
    client_uri: 'http://root',
    redirect_uris: ['http://redirect'],
    provider: 'openid-connect'
  };

  test('OIDC: Creating a client should return an object with a client_id', (t) => {
    registration.create(options).then((v) => {
      t.equal(v.statusMessage, 'Created');
      t.equal(v.statusCode, 201);
      t.notEqual(v.client_id, undefined);
      t.equal(typeof v.client_id, 'string');
      t.end();
    }).catch((e) => {
      console.error(e.stack);
      t.fail(e);
    });
  });

  test('OIDC: Getting a client should return an object with the provided client_id', (t) => {
    registration.create(options).then((v) => {
      registration.get(options, v.client_id).then((o) => {
        t.equal(o.client_id, v.client_id);
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

  test('OIDC: Getting a non-existent client should fail', (t) => {
    registration.get(options, 'tacos').then((o) => {
      t.fail('Client should not be found');
    }).catch((e) => {
      t.equal(e, 'Not Found');
      t.end();
    });
  });

  test('OIDC: Updating a client should return an object with an updated client object', (t) => {
    registration.create(options).then((v) => {
      v.redirect_uris = ['http://new-redirect'];
      registration.update(options, v).then((o) => {
        t.deepEqual(o.redirect_uris, v.redirect_uris);
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

  test('OIDC: Updating a non-existent client should fail with Not Found', (t) => {
    const client = {
      client_id: 'tacos'
    };
    registration.update(options, client).then((o) => {
      t.fail('Client should not be found');
    }).catch((e) => {
      t.equal(e, 'Not Found');
      t.end();
    });
  });

  test('OIDC: Deleting a client should return a 204 status code if successful', (t) => {
    registration.create(options).then((v) => {
      registration.remove(options, v.client_id).then((o) => {
        t.equal(o.statusCode, 204);
        t.equal(o.statusMessage, 'No Content');
        t.end();
      });
    }).catch((e) => {
      console.error(e.stack);
      t.fail(e);
    });
  });

  test('OIDC: Deleting a non-existent client should fail with Not Found', (t) => {
    registration.remove(options, 'enchilada').then((o) => {
      t.fail('Client should not be found');
    }).catch((e) => {
      t.equal(e, 'Not Found');
      t.end();
    });
  });
}).catch((e) => {
  console.error('Are you sure a Keycloak server is running?');
  process.kill(process.pid);
});
