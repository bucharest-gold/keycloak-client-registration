const http = require('http'),
      url = require('url'),
      querystring = require('querystring'),
      options = url.parse('http://localhost:8080/auth/realms/master/protocol/openid-connect/token');

var token;

options.headers = {
  "Content-type": 'application/x-www-form-urlencoded'
};
options.data = {
  username: 'admin',
  password: 'admin',
  grant_type: 'password',
  client_id: 'admin-cli'
};
options.method = 'POST';

function getToken() {
  return new Promise((resolve, reject) => {
    if (token) resolve(token);
    else {
      const data = [];
      const req = http.request(options, (res) => {
        res.on('data', (chunk) => {
          data.push(chunk);
        }).on('end', () => {
          try {
            token = JSON.parse(Buffer.concat(data).toString()).access_token;
            resolve(token);
          } catch(e) {
            reject(e);
          }
        });
      });
      req.on('error', (e) => {
        reject(e);
      });
      req.write(querystring.stringify(options.data));
      req.end();
    }
  });
}

module.exports = getToken;