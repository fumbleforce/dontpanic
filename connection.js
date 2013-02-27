var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

var mysql = require('mysql');
new mysql.Database({
    hostname: 'studsql.idi.ntnu.no',
    user: 'dontpanic_adm',
    password: 'aebu2!Jilu',
    database: 'p_dontpanic'
}).on('error', function(error) {
    console.log('ERROR: ' + error);
}).on('ready', function(server) {
    console.log('Connected to ' + server.hostname + ' (' + server.version + ')');
}).connect();
