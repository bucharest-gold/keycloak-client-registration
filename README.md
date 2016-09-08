# Keycloak Client Registration

[![Coverage Status](https://coveralls.io/repos/github/bucharest-gold/keycloak-client-registration/badge.svg?branch=master)](https://coveralls.io/github/bucharest-gold/keycloak-client-registration?branch=master)
[![Build Status](https://travis-ci.org/bucharest-gold/keycloak-client-registration.svg?branch=master)](https://travis-ci.org/bucharest-gold/keycloak-client-registration) 
[![Known Vulnerabilities](https://snyk.io/test/npm/keycloak-client-registration/badge.svg)](https://snyk.io/test/npm/keycloak-client-registration) 
[![dependencies Status](https://david-dm.org/bucharest-gold/keycloak-client-registration/status.svg)](https://david-dm.org/bucharest-gold/keycloak-client-registration)

[![NPM](https://nodei.co/npm/keycloak-client-registration.png)](https://npmjs.org/package/keycloak-client-registration)

Node.js client for the Keycloak client registration API

|                 | Project Info  |
| --------------- | ------------- |
| License:        | Apache-2.0  |
| Build:          | make  |
| Documentation:  | http://bucharest-gold.github.io/keycloak-client-registration/  |
| Issue tracker:  | https://github.com/bucharest-gold/keycloak-client-registration/issues  |
| Engines:        | Node.js 4.x, 5.x, 6.x

## Installation

`npm install keycloak-client-registration -S`

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

[1]: http://keycloak.github.io/docs/userguide/keycloak-server/html/client-registration.html

## Contributing

Please read the [contributing guide](./CONTRIBUTING.md)