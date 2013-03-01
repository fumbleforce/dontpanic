var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "studsql.idi.ntnu.no",
    user: "dontpanic_adm",
    password: "aebu2!Jilu",
    database: "p_dontpanic",
    debug: true, 
});

connection.connect(function(err) {
	if (err) {
		console.log('ERROR: ' + err);
	} else {
		console.log('Connected to ' + server.hostname + ' (' + server.version + ')');
	};
});

connection.query('SELECT 1', function(err, rows) {
  // connected! (unless `err` is set)
});

connection.query('SELECT * FROM Effect', function(err, rows, fields) {
  if (err) console.log('ERROR: ' + err);

  for (x in rows) {
    console.log('Row: ', x);
  }
});

// Handle disconnect

function handleDisconnect(connection) {
  connection.on('error', function(err) {
    if (!err.fatal) {
      return;
    }

    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
      throw err;
    }

    console.log('Re-connecting lost connection: ' + err.stack);

    connection = mysql.createConnection(connection.config);
    handleDisconnect(connection);
    connection.connect();
  });
}

handleDisconnect(connection);


