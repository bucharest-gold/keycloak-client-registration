'use strict';

/**
 * @module keycloak-client-registration
 */
module.exports = exports = {
  create: create,
  get: get,
  remove: remove
};

const request = require('request'),
  http = require('http'),
  url = require('url');

/**
 * Creates a new keycloak client
 * @param {object} options - Request options
 * @param {string} options.endpoint - The API endpoint, e.g. http://localhost:8080/auth/realms/master/clients-registrations
 * @param {string} options.accessToken - The Initial access token @see {@link http://keycloak.github.io/docs/userguide/keycloak-server/html/client-registration.html#d4e1473}
 * @param {object} [clientRepresentation] - An object representing the client
 * @param {string} [clientRepresentation.clientId] - The ID of the client to be created
 * @returns {Promise} A promise that will resolve with the client object
 * @instance
 */
function create (opts, clientRepresentation) {
  let options = defaults(opts.accessToken, opts.endpoint, 'default');
  options.body = clientRepresentation || {};
  return new Promise((resolve, reject) => {
    request.post(options)
      .on('response', handleResponse(resolve, reject));
  });
}

/**
 * Gets an existing keycloak client
 * @param {object} options - Request options
 * @param {string} options.endpoint - The API endpoint, e.g. http://localhost:8080/auth/realms/master/clients-registrations
 * @param {string} options.accessToken - The Initial access token @see {@link http://keycloak.github.io/docs/userguide/keycloak-server/html/client-registration.html#d4e1473}
 * @param {string} clientId - The ID of the client to get
 * @returns {Promise} A promise that will resolve with the client object
 * @instance
 */
function get (opts, clientId) {
  let options = defaults(opts.accessToken, opts.endpoint, 'default', clientId); 
  return new Promise((resolve, reject) => {
    request.get(options)
      .on('response', handleResponse(resolve, reject));
  });
}

/**
 * Removes an existing keycloak client
 * @param {object} options - Request options
 * @param {string} options.endpoint - The API endpoint, e.g. http://localhost:8080/auth/realms/master/clients-registrations
 * @param {string} options.accessToken - The Initial access token @see {@link http://keycloak.github.io/docs/userguide/keycloak-server/html/client-registration.html#d4e1473}
 * @param {string} clientId - The ID of the client to get
 * @returns {Promise} A promise that will resolve with the client object
 * @instance
 */
function remove (opts, clientId) {
  let options = defaults(opts.accessToken, opts.endpoint, 'default', clientId);
  return new Promise((resolve, reject) => {
    request.delete(options)
      .on('response', handleResponse(resolve, reject));
  });
}

function handleResponse(resolve, reject) {
  return (res) => {
    const body = [];
    res.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      if (res.statusCode >= 400) {
        return reject(res.statusMessage);
      }
      let result;
      if (res.statusCode === 204) { // No Content
        result = {};
      } else {
        result = JSON.parse(Buffer.concat(body).toString());
      }
      result.headers = res.headers;
      result.statusCode = res.statusCode;
      result.statusMessage = res.statusMessage;
      resolve(result);
    }).on('error', (e) => {
      reject(e);
      console.error(e, e.stack);
    });
  };
}

function defaults (accessToken) {
  const parts = Array.prototype.slice.call(arguments);
  parts.shift(); // get rid of accessToken
  return {
      uri: parts.join('/'),
      json: true,
      auth: {
        bearer: accessToken
      }
    };
}