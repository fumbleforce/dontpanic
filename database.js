var db = module.exports = function () {

}

var http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');

console.log('Database server running at http://127.0.0.1:1337/');


var mysql = require('mysql');

var connection = mysql.createConnection({

	host: "studsql.idi.ntnu.no",
	user: "dontpanic_adm",
	password: "aebu2!Jilu",
	database: "p_dontpanic",
	debug:false,
});

connection.connect(function(err) { 
	if (err) {
		console.log('ERROR: ' + err);
	}
});

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
/*
	Queries
*/

db.get_replay_id = function(next) {
	connection.query('SELECT replay_id FROM replay ORDER BY replay_id DESC',
	function (err, rows, fields) {
		if (err) throw err;
		return next(rows[0].replay_id);
	});
}

console.log("hei");
db.test_query = function () {
	connection.query('SELECT text AS solution FROM test WHERE ID = 1', 
	function(err, rows, fields) {
		if (err) throw err;
		console.log(rows[0].solution);
	});
}

/*
	Returns the password of the given user, funker ikke nå
*/
db.get_password = function (username) {
	connection.query('SELECT Password AS solution FROM User WHERE User_Name = ' + 
	connection.escape(username), function(err, rows, fields) {
		if (err) throw err;
		return rows[0].solution;
	});
}


/*
	Adds a node to the database
*/

db.add_node = function (is_start_position, roadblock_bool, info_senter_bool,
adjacent_zones, connects_to, var_x, var_y, template_id) {
	connection.query('INSERT INTO Nodes SET?' , {is_start_position: is_start_position, 
	has_information_center: info_senter_bool, connects_to: adjacent_zones, 
	x: var_x, y: var_y, template_id: template_id},  
	function (err, result) {
		if (err) throw err;
		console.log('Succsesfully added node');
	});
}
/*
	Generates the nodes in the start of the game
*/

db.get_all_nodes = function (gametemplate_id, next) {
	connection.query('SELECT id, x, y, is_start_position, connects_to FROM Nodes WHERE template_ID = ' +
	gametemplate_id, function (err, rows) {
		if (err) throw err;
		return next(rows);
	});
}

/*
	Adds a zone to the database with the given parameters
*/
db.add_zone = function (adjacent_zones, panic_level, people, template_id, nodes, type, template_id) {
	connection.query('INSERT INTO Zones SET?' , {adjacent_zones: adjacent_zones, 
	panic_level: panic_level, people: people, template_id: template_id, nodes: nodes,
	type: type, template_id: template_id}, function (err, rows, fields) {
		if (err) throw err;
		console.log('Successfully added new zone');
	});
}
/*
	Gets the zones of the given template
*/

db.get_all_zones = function(gametemplate_id, next) {
	connection.query('SELECT id, adjacent_zones, nodes, people, panic_level, type FROM Zones WHERE template_ID = ' + 
	gametemplate_id, function (err, rows) {
		if (err) throw err;
		return next(rows);
	});
}

db.get_template_string = function (gametemplate_id, next) {
	connection.query('SELECT id, json_string FROM gametemplate WHERE id = ' 
	+ gametemplate_id, function (err, rows) {
		if (err) throw err;
		return next(rows);
	});
}

db.set_template_string = function (json_string) {
	connection.query('INSERT INTO gametemplate SET?', {json_string: json_string},
	function(err, rows, fields) {
		if (err) throw err;
		console.log('successfully added gametemplate to database');
	});
}


db.get_all_templates = function (next) {
	connection.query('SELECT * FROM gametemplate', function (err, rows, fields) {
		if (err) throw err;
		return next(rows);
	});
	
}

db.get_all_replays = function (next) {
	connection.query('SELECT distinct replay_id FROM replay', function (err, rows, fields) {
		if (err) throw err;
		return next(rows);
	});
}


db.set_replay = function (replay_id, command_id, command) {
	connection.query('INSERT INTO replay SET?', {replay_id: replay_id, command_id: command_id, command: command},
	function(err, rows, fields) {
		if (err) throw err;
		console.log('successfully added replay command to database');
	});
}

db.get_replay = function (replay_id, next) {
	connection.query('SELECT command FROM replay WHERE replay_id = ' + replay_id, function (err, rows, fields) {
		if (err) throw err;
		return next(rows);
	});
}

db.set_event = function(effect) {
	connection.query('INSERT INTO event SET?', {effect: effect}, 
	function (err, rows, fields) {
		if (err) throw err;
		console.log('Successfully added event to database');	
	});
}

db.get_all_events = function (next) {
	connection.query('SELECT * FROM event', function (err, rows, fields) {
		return next(rows);
	});
}

//kallet til get all templates
/*db.get_all_templates(function(result) {
	//console.log(result);
});*/
//ikke i bruk?
db.get_template = function(gametemplate_id, next) {
	var nodes = 0;
	var zones = 0;
	db.get_all_zones(gametemplate_id, function(result) {
		zones = result;
		db.get_all_nodes(gametemplate_id, function(result) {
			nodes = result;
			var gametemplate = {
				nodes : nodes,
				zones : zones,
				id	:	gametemplate_id,
			};
			next(gametemplate);
		})
	});
}

db.add_info_card = function (name) {
	connection.query('INSERT INTO Info cards SET?', {Name: name}, 
	function (err, rows, fields) {
		if (err) throw err;
		console.log('Succesfully added new info card');
	});
}

//gametemplate er settings, noder og soner
	

/* get all Usernames, works*/ 

db.get_all_usernames = function (next) {
	var query = connection.query('SELECT User_Name AS solution FROM User');
	query.on('error', function(err) {
		throw err;
	})
	
	.on('result', function(result) {
		return next(result);
	})
}

/*
	Sends a callback with the replay state for the given game id and turn id
*/

/* 
	Puts the given replay string to Replay in the database, works
*/

db.set_command = function (replay_id, command_id, command)  {
	connection.query('INSERT INTO Replay SET?', {replay_id: replay_id, 
	command_id: command_id, command: command}, function (err, result) {
		if (err) throw err;
		console.log('Sucessfully added', replay_string, 'to replay state');
	});
}

/* 
	Gets the command of the given game with given command id.
*/

db.get_command = function (replay_id, command_id, next) {
	connection.query('SELECT command AS solution FROM Replay WHERE replay_id = ' + 
	replay_id, 'AND command_id = ' + command_id, function (err, rows, fields) {
		if (err) throw err;
		return next(rows[0].solution);
	});
}


/* 
	Puts the texttest in the table test
*/
db.test = function (texttest) {
	connection.query('INSERT INTO test SET ?', {text: texttest}, function(err, result) {
		if (err) throw err;
		console.log(result.insertId);
	});

}
/* get if User admin, works*/

db.is_user_admin = function (username) {
	connection.query('SELECT Is_Admin AS solution FROM User WHERE User_Name = ' + 
	connection.escape(username), function(err, rows, fields) {
		if (err) throw err;
		console.log(rows[0].solution);
	});
}

/* Adds new user with the giver parameters to the database, works */

db.add_user = function (username, password, id, email, name, is_admin) {
	connection.query('INSERT INTO User SET?', {User_name: username, Password: password, 
	ID: id, Email: email, Name: name, Is_Admin: is_admin}, function (err, result) {
		if (err) throw err;
		console.log('Successfully added player', username, password, id, email, name, 
		is_admin);
	});
}	

