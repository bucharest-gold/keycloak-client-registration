'use strict';

const requester = require('keycloak-request-token');
const baseUrl = 'http://localhost:8080/auth';

const settings = {
  username: 'admin',
  password: 'admin',
  grant_type: 'password',
  client_id: 'admin-cli'
};

module.exports = () => requester(baseUrl, settings);
