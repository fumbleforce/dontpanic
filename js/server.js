var http = require('http');
var engine = require('./engine.js');

http.createServer(function (request, response) {
  engine.handle_request(request, response);
}).listen(8124);

console.log('Server running at http://127.0.0.1:8124/');
