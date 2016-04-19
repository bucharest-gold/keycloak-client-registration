/**
 * @module keycloak-client-registration
 */
module.exports = exports = {
  create: create,
  get: get
};

const http = require('http'),
  url = require('url');

/**
 * Creates a new keycloak client
 * @param {object} options - Request options
 * @param {string} options.endpoint - The API endpoint, e.g. http://localhost:8080/auth/realms/master/clients-registrations
 * @param {string} options.accessToken - The Initial access token @see {@link http://keycloak.github.io/docs/userguide/keycloak-server/html/client-registration.html#d4e1473}
 * @param {object} [clientRepresentation] - An object representing the client
 * @param {string} [clientRepresentation.clientId] - The ID of the client to be created
 * @returns {Promise} A promise that will resolve with the client object
 */
function create (opts, clientRepresentation) {
  const rep = clientRepresentation || {};
  return doPost(opts.endpoint, opts.accessToken, 'default', rep);
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
  return doGet(opts.endpoint, opts.accessToken, 'default', clientId);
}

function doGet (endpoint, accessToken, path, clientId) {
  return new Promise((resolve, reject) => {
    const options = url.parse([endpoint, path].join('/'));
    options.method = 'GET';
    options.headers = {
      Authorization: 'bearer ' + accessToken
    };
    options.path = options.path + '/' + clientId;
    request(options, resolve, reject).end();
  });
}

function doPost (endpoint, accessToken, path, content) {
  return new Promise((resolve, reject) => {
    const clientRepresentation = JSON.stringify(content);
    const options = url.parse([endpoint, path].join('/'));
    options.method = 'POST';
    options.headers = {
      Authorization: 'bearer ' + accessToken,
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
