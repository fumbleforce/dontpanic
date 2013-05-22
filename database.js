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
		console.log('Database error: ' + err);
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
			
			//putting the default gametemplate into the database
			//db.set_template_string("{"type":"template","map":{"nodes":[{"id":0,"x":60,"y":118,"is_start_position":true,"has_information_center":false,"connects_to":[14,1,13,12]},{"id":1,"x":452,"y":54,"is_start_position":true,"has_information_center":false,"connects_to":[14,0,2]},{"id":2,"x":778,"y":56,"is_start_position":true,"has_information_center":false,"connects_to":[1,14,3]},{"id":3,"x":1172,"y":70,"is_start_position":true,"has_information_center":false,"connects_to":[2,15,4,5]},{"id":4,"x":1444,"y":180,"is_start_position":true,"has_information_center":false,"connects_to":[3,5,6]},{"id":5,"x":1114,"y":584,"is_start_position":true,"has_information_center":false,"connects_to":[4,3,15,6,9]},{"id":6,"x":1448,"y":910,"is_start_position":true,"has_information_center":false,"connects_to":[5,4,9,7]},{"id":7,"x":1124,"y":1146,"is_start_position":true,"has_information_center":false,"connects_to":[6,9,8]},{"id":8,"x":720,"y":1244,"is_start_position":true,"has_information_center":false,"connects_to":[11,7]},{"id":9,"x":898,"y":818,"is_start_position":true,"has_information_center":false,"connects_to":[6,5,7,15,10]},{"id":10,"x":524,"y":944,"is_start_position":true,"has_information_center":false,"connects_to":[13,9,11,15]},{"id":11,"x":362,"y":1166,"is_start_position":true,"has_information_center":false,"connects_to":[12,10,8]},{"id":12,"x":62,"y":912,"is_start_position":true,"has_information_center":false,"connects_to":[0,13,11]},{"id":13,"x":342,"y":602,"is_start_position":true,"has_information_center":false,"connects_to":[15,14,10,0,12]},{"id":14,"x":526,"y":326,"is_start_position":true,"has_information_center":false,"connects_to":[1,0,2,15,13]},{"id":15,"x":796,"y":532,"is_start_position":true,"has_information_center":false,"connects_to":[3,14,5,9,13,10]}],"zones":[{"id":0,"nodes":[1,14,0],"type":"largecity","people":"10","panic_level":"20","adjacent_zones":[1,10],"centroid":[346,166]},{"id":1,"nodes":[14,1,2],"type":"residential","people":"5","panic_level":"0","adjacent_zones":[0,2],"centroid":[585.3333333333334,145.33333333333334]},{"id":2,"nodes":[14,2,3,15],"type":"industry","people":"30","panic_level":"15","adjacent_zones":[1,4,9],"centroid":[818,246]},{"id":3,"nodes":[3,4,5],"type":"residential","people":"20","panic_level":"5","adjacent_zones":[5,4],"centroid":[1243.3333333333333,278]},{"id":4,"nodes":[15,3,5],"type":"residential","people":"10","panic_level":"5","adjacent_zones":[2,3,8],"centroid":[1027.3333333333333,395.3333333333333]},{"id":5,"nodes":[4,5,6],"type":"largecity","people":"30","panic_level":"25","adjacent_zones":[3,6],"centroid":[1335.3333333333333,558]},{"id":6,"nodes":[5,9,6],"type":"residential","people":"20","panic_level":"0","adjacent_zones":[8,7,5],"centroid":[1153.3333333333333,770.6666666666666]},{"id":7,"nodes":[9,6,7],"type":"largecity","people":"20","panic_level":"10","adjacent_zones":[6,13],"centroid":[1156.6666666666667,958]},{"id":8,"nodes":[9,5,15],"type":"park","people":"10","panic_level":"0","adjacent_zones":[6,4,14],"centroid":[936,644.6666666666666]},{"id":9,"nodes":[14,13,15],"type":"park","people":"10","panic_level":"5","adjacent_zones":[10,15,2],"centroid":[554.6666666666666,486.6666666666667]},{"id":10,"nodes":[0,14,13],"type":"park","people":"10","panic_level":"10","adjacent_zones":[0,9,11],"centroid":[309.3333333333333,348.6666666666667]},{"id":11,"nodes":[13,0,12],"type":"residential","people":"10","panic_level":"5","adjacent_zones":[10,12],"centroid":[154.66666666666666,544]},{"id":12,"nodes":[10,13,12,11],"type":"largecity","people":"20","panic_level":"15","adjacent_zones":[15,11,13],"centroid":[322.5,906]},{"id":13,"nodes":[7,9,10,11,8],"type":"industry","people":"30","panic_level":"30","adjacent_zones":[7,14,12],"centroid":[725.6,1063.6]},{"id":14,"nodes":[10,9,15],"type":"residential","people":"10","panic_level":"10","adjacent_zones":[13,8,15],"centroid":[739.3333333333334,764.6666666666666]},{"id":15,"nodes":[13,10,15],"type":"industry","people":"10","panic_level":"20","adjacent_zones":[12,14,9],"centroid":[554,692.6666666666666]}]},"players":[{"id":0,"user":"player0","x":60,"y":118,"node":0,"role":"crowd manager","actions_left":4},{"id":1,"user":"player1","x":898,"y":818,"node":9,"role":"crowd manager","actions_left":4},{"id":2,"user":"player2","x":342,"y":602,"node":13,"role":"driver","actions_left":4},{"id":3,"user":"player3","x":1172,"y":70,"node":3,"role":"driver","actions_left":4},{"id":4,"user":"player4","x":62,"y":912,"node":12,"role":"operation expert","actions_left":4},{"id":5,"user":"player5","x":1114,"y":584,"node":5,"role":"operation expert","actions_left":4}],"info_cards":[{"name":"Calm financial","desc":"Calm financial districts by 5","effects":[{"name":"financ calm","domain":"zone","type":"panic","panic":-5,"affects":"largecity"}]},{"name":"Calm industry","desc":"Calm industry districts by 5","effects":[{"name":"indus calm","domain":"zone","type":"panic","panic":-5,"affects":"industry"}]},{"name":"Calm residental","desc":"Calm residental districts by 5","effects":[{"name":"resid calm","domain":"zone","type":"panic","panic":-5,"affects":"residential"}]}],"events":[{"name":"Fire in industrial","desc":"Fire engulfs industrial complex! Workers in all districts gives into panic.\nPanic increased by 20 in all industrial districts","effects":[{"name":"industry + 20 panic","domain":"zone","type":"panic","panic":20,"affects":"industry"}]},{"name":"Power outage in residential","desc":"Power outage in all residential districts!\nPanic increased by 5 in all residential districts","effects":[{"name":"residential +5 panic","domain":"zone","type":"panic","panic":5,"affects":"residential"}]},{"name":"Terrorist attack in the city","desc":"Terrorist attack in the city!\nPanic increased by 10 in all largecity districts","effects":[{"name":"largecity + 10 panic","domain":"zone","type":"panic","panic":10,"affects":"largecity"}]},{"name":"Power outage in residential","desc":"Power outage in all residential districts\nPanic increased by 10 in all residential districts!","effects":[{"name":"residential +10 panic","domain":"zone","type":"panic","panic":10,"affects":"residential"}]},{"name":"Shout about epedemic","desc":"Shouting about an epedemic can be heard.\nPanic increased by 10 in all districts","effects":[{"name":"largecity + 10 panic","domain":"zone","type":"panic","panic":10,"affects":"largecity"},{"name":"residential + 10 panic","domain":"zone","type":"panic","panic":10,"affects":"residential"},{"name":"park + 10 panic","domain":"zone","type":"panic","panic":10,"affects":"park"},{"name":"industry + 10 panic","domain":"zone","type":"panic","panic":10,"affects":"industry"}]},{"name":"Explosion in industry","desc":"An explosion has occured!\nPanic increased by 10 in all industry districts","effects":[{"name":"industry + 10 panic","domain":"zone","type":"panic","panic":10,"affects":"industry"}]},{"name":"Rabid dogs in the park","desc":"Rabid dogs roam the park!\nPanic increased by 10 in all parks","effects":[{"name":"park + 10 panic","domain":"zone","type":"panic","panic":10,"affects":"park"}]},{"name":"Pipe bomb in residential","desc":"Viable pipe bomb has been found near a school!\nPanic increased by 10 in all residential districts","effects":[{"name":"residential + 10 panic","domain":"zone","type":"panic","panic":10,"affects":"residential"}]},{"name":"Gunshots in residential","desc":"Gunshots can be heard through a school cooridor!\nPanic increased by 10 in all residential districts","effects":[{"name":"residential + 10 panic","domain":"zone","type":"panic","panic":10,"affects":"residential"}]},{"name":"Anthrax spread underground","desc":"Anthrax has been spread on an undergroud!\nPanic increased by 10 in all financial districts","effects":[{"name":"largecity + 10 panic","domain":"zone","type":"panic","panic":10,"affects":"largecity"}]},{"name":"Bacteria in residential","desc":"Large occurenses of MRSA Staph Bacteria Infections have been reported!\nPanic increased by 10 in all residential districts","effects":[{"name":"residential +10 panic","domain":"zone","type":"panic","panic":10,"affects":"residential"}]},{"name":"Gunshot in residential","desc":"Gunshots can be heard through a school cooridor!\nPanic increased by 10 in all residential districts","effects":[{"name":"residential + 10 panic","domain":"zone","type":"panic","panic":10,"affects":"residential"}]}],"author":"Group 10","desc":"Default game for testing","timestep":"180","eventstep":"2"}");
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



