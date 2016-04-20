# Keycloak Client Registration

[![Build Status](https://travis-ci.org/bucharest-gold/keycloak-admin-client.svg?branch=master)](https://travis-ci.org/bucharest-gold/keycloak-admin-client)

This package provides a Node.js client for the Keycloak [client registration API][1].
It is still a work in progress, and as yet unpublished.

## API Documentation

http://bucharest-gold.github.io/keycloak-client-registration/

## Usage

    const options = { 
      endpoint: 'http://localhost:8080/auth/realms/master/clients-registrations',
      accessToken: accessToken 
    };

    const create = require('keycloak-client-registration').create,
          get = require('keycloak-client-registration').get;
    
    create(options).then((v) => {
      t.equal(v.statusMessage, 'Created');
      t.equal(v.statusCode, 201);
      t.notEqual(v.clientId, undefined);
      t.equal(typeof v.clientId, 'string');
      t.end();
    }).catch((e) => {
      t.fail(e);
    });

## Development & Testing

To run the tests, you'll need to have a keycloak server running. Just run 
`./test/scripts/start-server.sh`. If you don't already have a server downloaded,
this script will download one for you, start it, initialize the admin user, and
then restart.

Then just run the tests.

    make test
    
To stop the server, run `./test/scripts/stop-server.sh`.

[1]: http://keycloak.github.io/docs/userguide/keycloak-server/html/client-registration.html