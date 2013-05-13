/**
	Provides connection for a mySQL-connection	

	@class Database 
	@constructor
**/


var db = module.exports = function () {

}

var http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');

console.log('Database server running at http://127.0.0.1:1337/');

var mysql = require('mysql');

/**
	The connection-object containing the connection parameters 

	@property connection
	@type Object
**/

var connection = mysql.createConnection({

	host: "studsql.idi.ntnu.no",
	user: "dontpanic_adm",
	password: "aebu2!Jilu",
	database: "p_dontpanic",
	debug:false,
});

/*
	Connected unless err is set
*/

connection.connect(function(err) { 
	if (err) {
		console.log('(If you are outside the NTNU network, the database connection is stopped by the IDI firewall. By using VPN to access the NTNU network this will be fixed) ERROR: ' + err);
	}
});

/**
	Handles disconnects from the MySQL-server.	

	@method handleDisconnect
	@params {Object} connection
**/

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

/**
	Checking if the tables for the database exists, if they dont, they will be made and a 
	a default gametemplate will be put in the database. This method is never called in the 
	code, has to be called to set up the database tables.

	@method set_up_database
**/

db.set_up_database = function () {
	connection.query('show tables like "gametemplate"', function (err, rows, fields) {
		if (err) throw err;
		if (rows[0] === undefined) {
			console.log("gametemplate does not exist, creating table");
			connection.query('CREATE TABLE `gametemplate` (\n  `id` int(11) NOT NULL AUTO_INCREMENT,\n  `json_string` longtext COLLATE latin1_danish_ci NOT NULL,\n  PRIMARY KEY (`id`)\n) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=latin1 COLLATE=latin1_danish_ci');
			console.log("putting in default game template");
			
			//default gametemplate
			//db.set_template_string("gametemplate");
		}
		else {
			console.log("gametemplate exists");
		}
	}); 
	connection.query('show tables like "replay"', function (err, rows, fields) {
		if (err) throw err;
		if (rows[0] === undefined) {
			console.log("replay does not exist, creating table");
			connection.query('CREATE TABLE `replay` (\n  `replay_id` int(10) NOT NULL,\n  `state_id` int(10) NOT NULL,\n  `state` longtext COLLATE latin1_danish_ci NOT NULL,\n  PRIMARY KEY (`replay_id`,`state_id`)\n) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_danish_ci');
		}
		else {
			console.log("replay exists");
		}
	});
}

/*
	Queries
*/

/**
	Gets the maximum replay id that exists in the database

	@method get_replay_id
	@param {function} next
**/

db.get_replay_id = function(next) {
	connection.query('SELECT replay_id FROM replay ORDER BY replay_id DESC',
	function (err, rows, fields) {
		if (err) throw err;
		if (rows[0] === undefined) {
			return next(0);
		}
		else {
			return next(rows[0].replay_id);
		}
	});
}

/**
	Gets a gametemplate from the database with the given id

	@method get_template_string
	@param {int} gametemplate_id
	@param {function} next
**/

db.get_template_string = function (gametemplate_id, next) {
	connection.query('SELECT id, json_string FROM gametemplate WHERE id = ' 
	+ gametemplate_id, function (err, rows) {
		if (err) throw err;
		return next(rows);
	});
}

/**
	Sets the given gametemplate to the database, auto increment on ID

	@method set_template_string
	@param {String} json_string
**/

db.set_template_string = function (json_string) {
	connection.query('INSERT INTO gametemplate SET?', {json_string: json_string},
	function(err, rows, fields) {
		if (err) throw err;
		console.log('successfully added gametemplate to database');
	});
}

/**
	Gets all the gametemplates from the database

	@method get_all_templates
	@param {function} next
**/
db.get_all_templates = function (next) {
	connection.query('SELECT * FROM gametemplate', function (err, rows, fields) {
		if (err) throw err;
		return next(rows);
	});
	
}

/**
	Gets all the replays from the database

	@method get_all_replays
	@param {function} next
**/
db.get_all_replays = function (next) {
	connection.query('SELECT distinct replay_id FROM replay', function (err, rows, fields) {
		if (err) throw err;
		return next(rows);
	});
}

/**
	Sets a game state to the given replay
	
	@method set_replay
	@param {int} replay_id
	@param {int} state_id
	@param {String} state
**/

db.set_replay = function (replay_id, state_id, state) {
	connection.query('INSERT INTO replay SET?', {replay_id: replay_id, state_id: state_id, state: state},
	function(err, rows, fields) {
		if (err) throw err;
		console.log('successfully added replay state to database');
	});
}

/**
	Gets all the game states of the given replay

	@method get_replay
	@param {int} replay_id
	@param {function} next
**/

db.get_replay = function (replay_id, next) {
	connection.query('SELECT state FROM replay WHERE replay_id = ' + replay_id, function (err, rows, fields) {
		if (err) throw err;
		return next(rows);
	});
}
/**
	Sets an event in the database

	@method set_event
	@param {String} effect
**/

db.set_event = function(effect) {
	connection.query('INSERT INTO event SET?', {effect: effect}, 
	function (err, rows, fields) {
		if (err) throw err;
		console.log('Successfully added event to database');	
	});
}

/**
	Gets the gamestate of the given state id and replay id

	@method get_command
	@param {int} replay_id
	@param {int} state_id
	@param {function} next
**/

db.get_command = function (replay_id, state_id, next) {
	connection.query('SELECT state AS solution FROM Replay WHERE replay_id = ' + 
	replay_id, 'AND state_id = ' + state_id, function (err, rows, fields) {
		if (err) throw err;
		return next(rows[0].solution);
	});
}



