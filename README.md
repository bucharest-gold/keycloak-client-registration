# Keycloak Client Registration

[![Build Status](https://travis-ci.org/keycloak/keycloak-client-registration.svg?branch=master)](https://travis-ci.org/keycloak/keycloak-client-registration) 
[![Known Vulnerabilities](https://snyk.io/test/npm/keycloak-client-registration/badge.svg)](https://snyk.io/test/npm/keycloak-client-registration) 
[![dependencies Status](https://david-dm.org/keycloak/keycloak-client-registration/status.svg)](https://david-dm.org/keycloak/keycloak-client-registration)

Node.js client for the Keycloak client registration API

## Installation

`npm install keycloak-client-registration -S`

## Usage

```js
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
```

[1]: http://keycloak.github.io/docs/userguide/keycloak-server/html/client-registration.html

## Contributing

Please read the [contributing guide](./CONTRIBUTING.md)Please read the [contributing guide](./CONTRIBUTING.md)

## Reporting security vulnerabilities

If you've found a security vulnerability, please look at the [instructions on how to properly report it](http://www.keycloak.org/security.html)
