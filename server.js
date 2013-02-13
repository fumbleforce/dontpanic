var express = require('express'),
    server = module.exports = express(),
    engine = require('./server/js/engine.js');


//Configuration

server.engine('.html', require('ejs').__express);
server.set('views', __dirname + '/client/views');
server.use(express.static(__dirname + '/client/rec'));
server.set('view engine', 'html');

server.get('/', function(request, response){
  engine.handle_request(request, response);
})
server.listen(8008);

console.log('Server running at http://127.0.0.1:8008/');
