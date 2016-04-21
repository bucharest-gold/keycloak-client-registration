# Keycloak Client Registration

[![Build Status](https://travis-ci.org/bucharest-gold/keycloak-client-registration.svg?branch=master)](https://travis-ci.org/bucharest-gold/keycloak-client-registration)

This package provides a Node.js client for the Keycloak [client registration API][1].
It is still a work in progress, and as yet unpublished.

N.B. This module uses ES6 language features, and as such depends on Node.js version 5.x.

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

## API Documentation

http://bucharest-gold.github.io/keycloak-client-registration/

If you have the github rights to do it, you can publish the API documentation by running
`./build/publish-docs.sh`. This script will generate the documentation, then clone this
repository into a temporary directory, checkout the `gh-pages` branch and update it with
the newly generated documentation

## Development & Testing

To run the tests, you'll need to have a keycloak server running. Just run 
`./build/start-server.sh`. If you don't already have a server downloaded,
this script will download one for you, start it, initialize the admin user, and
then restart.

Then just run the tests.

    make test
    
To stop the server, run `./build/stop-server.sh`.

[1]: http://keycloak.github.io/docs/userguide/keycloak-server/html/client-registration.html