'use strict';

const test = require('tape'),
  registration = require('../index.js'),
  getToken = require('./bearer-token.js');

getToken().then((accessToken) => {
  const options = {
    endpoint: 'http://localhost:8080/auth/realms/master/clients-registrations',
    accessToken: accessToken
  };

  test('Default: Creating a client should return an object with a clientId', (t) => {
    registration.create(options).then((v) => {
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

  test('Default: Creating a client should return an object with a provided clientId', (t) => {
    const rep = { clientId: Date.now().toString() };
    registration.create(options, rep).then((v) => {
      t.equal(v.statusMessage, 'Created');
      t.equal(v.statusCode, 201);
      t.equal(v.clientId, rep.clientId);
      t.end();
    }).catch((e) => {
      console.error(e.stack);
      t.fail(e);
    });
  });

  test('Default: Getting a client should return an object with the provided clientId', (t) => {
    registration.create(options).then((v) => {
      registration.get(options, v.clientId).then((o) => {
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

  test('Default: Getting a non-existent client should fail', (t) => {
    registration.get(options, 'tacos').then((o) => {
      t.fail('Client should not be found');
    }).catch((e) => {
      t.equal(e, 'Not Found');
      t.end();
    });
  });

  test('Default: Updating a client should return an object with an updated client object', (t) => {
    registration.create(options).then((v) => {
      const client = {
        clientId: v.clientId,
        attributes: {
          color: 'green'
        }
      };
      registration.update(options, client).then((o) => {
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

  test('Default: Updating a non-existent client should fail with Not Found', (t) => {
    const client = {
      clientId: 'tacos'
    };
    registration.update(options, client).then((o) => {
      t.fail('Client should not be found');
    }).catch((e) => {
      t.equal(e, 'Not Found');
      t.end();
    });
  });

  test('Default: Deleting a client should return a 204 status code if successful', (t) => {
    registration.create(options).then((v) => {
      registration.remove(options, v.clientId).then((o) => {
        t.equal(o.statusCode, 204);
        t.equal(o.statusMessage, 'No Content');
        t.end();
      });
    }).catch((e) => {
      console.error(e.stack);
      t.fail(e);
    });
  });

  test('Default: Deleting a non-existent client should fail with Not Found', (t) => {
    registration.remove(options, 'enchilada').then((o) => {
      t.fail('Client should not be found');
    }).catch((e) => {
      t.equal(e, 'Not Found');
      t.end();
    });
  });

}).catch((e) => {
  console.error('Cannot get Initial Bearer Token. Are you sure a Keycloak server is running?');
  process.kill(process.pid);
});
