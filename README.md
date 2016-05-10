# Keycloak Client Registration

[![Build Status](https://travis-ci.org/bucharest-gold/keycloak-client-registration.svg?branch=master)](https://travis-ci.org/bucharest-gold/keycloak-client-registration)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)

This package provides a Node.js client for the Keycloak [client registration API][1].
It is experimental and still a work in progress.

N.B. This module uses ES6 language features, and as such depends on Node.js version 5.x
or higher.

## Usage

    const options = {
      endpoint: 'http://localhost:8080/auth/realms/master/clients-registrations',
      accessToken: getAccessTokenFromSomehwere()
    };

    const registration = require('keycloak-client-registration');

    registration.create(options).then((v) => {
      console.log(v.statusMessage); // => Created
      console.log(v.statusCode); // => 201
      console.log('Registration access token', v.registrationAccessToken);
      console.log('Client ID', v.clientId);
    }).catch((e) => {
      console.error('Error creating client', e);
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