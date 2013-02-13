var express = require('express');
var server = module.exports = express();
var engine = require('./server/js/engine.js');

server.engine('.html', require('ejs').__express);
console.log(__dirname);
server.set('views', __dirname + '/client/views');
server.set('view engine', 'html');

server.get('/', function(request, response){
  engine.handle_request(request, response);
})
server.listen(8008);

console.log('Server running at http://127.0.0.1:8008/');
