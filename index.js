module.exports = Client;

const http = require('http'),
      url = require('url');

/**
 * Creates an object that can create, get, modify and delete keycloak clients.
 * @param {Object} [options] - The authentication token
 * @return {Object} The registration client
 */
function Client(opts) {
  const options = opts || {},
        client = {
          endpoint: options.baseUrl + '/clients-registrations',
          accessToken: options.accessToken,
          create: create
        };
    
  function create(clientRepresentation = {}) {
    return doPost('default', clientRepresentation);
  }
  
  function get(clientId) {
    return doGet('default', clientId);
  }
  
  function doGet(path, clientId) {
    return new Promise((resolve, reject) => {
      const options = url.parse([client.endpoint, ].join('/'));
      options.headers = {
        Authorization: "bearer " + client.accessToken,
        'Content-Type': 'application/json',
        'Content-Length': clientRepresentation.length
      };
      options.path = options.path + '/' + clientId;
      const req = http.request(options, (res) => {
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
      req.write(clientRepresentation);
    });
  }

  function doPost(path, content) {
    return new Promise((resolve, reject) => {
      const clientRepresentation = JSON.stringify(content);
      const options = url.parse([client.endpoint, path].join('/'));
      options.method = 'POST';
      options.headers = {
        Authorization: "bearer " + client.accessToken,
        'Content-Type': 'application/json',
        'Content-Length': clientRepresentation.length
      };
      const req = http.request(options, (res) => {
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
      req.write(clientRepresentation);
    });
  }
  
  return client;
}
