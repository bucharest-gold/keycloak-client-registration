/**
 * @module keycloak-client-registration
 */
module.exports = exports = apiClient;

const http = require('http'),
  url = require('url');

/**
 * The API client prototype for the Keycloak client registration API.
 * Provides functions to create, get, update and delete client registrations.
 * @see http://keycloak.github.io/docs/userguide/keycloak-server/html/client-registration.html  
 * @namespace Client
 */
const Client = {
  /**
   * The computed client registration API endpoint
   * @instance
   * @type string
   */
  endpoint: null,

  /**
   * The initial access token to use the client registration API.
   * @see {@link http://keycloak.github.io/docs/userguide/keycloak-server/html/client-registration.html#d4e1473}
   * @instance
   * @type string
   */
  accessToken: null,

  /**
   * Creates a new keycloak client
   * @function
   * @param {object} [clientRepresentation] - An object representing the client
   * @param {string} [clientRepresentation.clientId] - The ID of the client to be created
   * @returns {Promise} A promise that will resolve with the client object
   * @instance
   */
  create: undefined,

  /**
   * Gets an existing keycloak client
   * @function
   * @param {string} clientId - The ID of the client to get
   * @returns {Promise} A promise that will resolve with the client object
   * @instance
   */
  get: undefined
};

/**
 * Creates {keycloak-client-registration~Client} instances that can create, get, 
 * modify and delete keycloak clients.
 * @param {Object} [options] - The authentication token
 * @returns {Object} The registration client
 */
function apiClient (opts) {
  const options = opts || {};

  const client = Object.create(Client);

  client.endpoint = options.baseUrl + '/clients-registrations';

  client.accessToken = options.accessToken;

  client.get = (clientId) => {
    return doGet(client, 'default', clientId);
  };

  client.create = (clientRepresentation) => {
    const rep = clientRepresentation || {};
    return doPost(client, 'default', rep);
  };

  return Object.freeze(client);
}

function doGet (client, path, clientId) {
  return new Promise((resolve, reject) => {
    const options = url.parse([client.endpoint, path].join('/'));
    options.method = 'GET';
    options.headers = {
      Authorization: 'bearer ' + client.accessToken
    };
    options.path = options.path + '/' + clientId;
    request(options, resolve, reject).end();
  });
}

function doPost (client, path, content) {
  return new Promise((resolve, reject) => {
    const clientRepresentation = JSON.stringify(content);
    const options = url.parse([client.endpoint, path].join('/'));
    options.method = 'POST';
    options.headers = {
      Authorization: 'bearer ' + client.accessToken,
      'Content-Type': 'application/json',
      'Content-Length': clientRepresentation.length
    };
    const req = request(options, resolve, reject);
    req.write(clientRepresentation);
    req.end();
  });
}

function request (options, resolve, reject) {
  return http.request(options, (res) => {
    if (res.statusCode === 404) {
      return reject(res.statusMessage);
    }
    const body = [];
    res.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      const data = Buffer.concat(body).toString();
      const result = JSON.parse(data);
      result.headers = res.headers;
      result.statusCode = res.statusCode;
      result.statusMessage = res.statusMessage;
      resolve(result);
    }).on('error', (e) => {
      reject(e);
      console.error(e, e.stack);
    });
  });
}
