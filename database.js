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
    debug:false,
});

connection.connect(function(err) { 
    if (err) {
        console.log('ERROR: ' + err);
    }
});


/* Query Test */

var test_query = function () {
	connection.query('SELECT text AS solution FROM test WHERE ID = 1', 
	function(err, rows, fields) {
 		if (err) throw err;
 		console.log(rows[0].solution);
	});
}
//test_query();
/*
	get_password checks if the password parameter matches the database password for the 
	given user

	Works, but dont know how to use callback.
*/

var get_password = function (username, password, callback) {
	connection.query('SELECT Password AS solution FROM User WHERE User_Name = ' + 
	connection.escape(username), function(err, rows, fields) {
		if (err) throw err;
		if (rows[0].solution === password) {
			console.log('Riktig passord: ', rows[0].solution);
			//callback.correct_password(username);
		}		
		else {
			console.log('Feil passord');
			//callback.wrong_password();
		}
	});
}

var add_node = function (is_start_position, roadblock_bool, info_senter_bool,
adjacent_zones, connects_to, var_x, var_y) {
	connection.query('INSERT INTO Nodes SET?' , {Is_start_position: is_start_position, 
	Info_senter_bool: info_senter_bool, Adjacent_zones: adjacent_zones, 
	Connects_to: connects_to, var_x: var_x, var_y: var_y},  
	function (err, result) {
		if (err) throw err;
		console.log('Succsesfully added node');
	});
}

var get_all_nodes = function () {
	var query = connection.query('SELECT * FROM Nodes');
	query.on('error', function(err) {
		throw err;
	})
	
	.on('result', function(result) {
		console.log(result);
	})
}

var add_zone = function (adjacent_zones, panic_level, people) {
	connection.query('INSERT INTO Zones SET?' , {Adjacent_zones: adjacent_zones, 
	Panic_level: panic_level, People_int: people}, function (err, rows, fields) {
		if (err) throw err;
		console.log('Successfully added new zone');
	});
}

var get_all_zones = function() {
	var query = connection.query('SELECT * FROM Zones');
	query.on('error', function(err) {
		throw err;
	})
	
	.on('result', function(result) {
		console.log(result);
	})
}

var add_info_card = function (name) {
	connection.query('INSERT INTO Info cards SET?', {Name: name}, 
	function (err, rows, fields) {
		if (err) throw err;
		console.log('Succesfully added new info card');
	});
}

add_info_card('decrease 15 in red');
//gametemplate er settings, noder og soner
var new_game = function () {
	
}
//get_password('dontpanic', '123');

/* get all Usernames, works*/ 

var get_all_usernames = function () {
	var query = connection.query('SELECT User_Name AS solution FROM User');
	query.on('error', function(err) {
		throw err;
	})
	
	.on('result', function(result) {
		console.log(result.solution);
	})
}

//get_all_usernames();

/* for å teste sql spørringene, får feil på at caller ikke har metodene?? */

function caller () {
    this.correct_password = function(username) {
        console.log('correct password for', username);
    };
    function wrong_password (username) {
    	console.log('wrong password for', username);
    }
    function wrong_password() {
    	console.log("lol");
    }
   	this.wrong_password = function () {
   		console.log("ad");
  	};
   	
    this.wrong_password = function (username) {
    	console.log(username);
    };
}


/*
	Sends a callback with the replay state for the given game id and turn id
*/

/* 
	Puts the given replay string to Replay in the database, works
*/

var set_replay_state = function (game_id, turn_id, replay_string)  {
	connection.query('INSERT INTO Replay SET?', {Game_ID: game_id, 
	Turn_id: turn_id, State_array: replay_string}, function (err, result) {
		if (err) throw err;
		console.log('Sucessfully added', replay_string, 'to replay state');
	});
}

/* 
	Gets the replay state of the given game and turn id. 
*/

var get_replay_state = function (game_id, turn_id, callback) {
	connection.query('SELECT State_array AS solution FROM Replay WHERE Game_ID = ' + 
	game_id, 'AND Turn_ID = ' + turn_id, function (err, rows, fields) {
		if (err) throw err;
		console.log(rows[0].solution);
		//callback(rows[0].solution);
	});
}


/* 
	Puts the texttest in the table test
*/
var test = function (texttest) {
	connection.query('INSERT INTO test SET ?', {text: texttest}, function(err, result) {
	  	if (err) throw err;
  		console.log(result.insertId);
	});

}
//test('hei');
/* get if User admin, works*/

var is_user_admin = function (username, callback) {
	connection.query('SELECT Is_Admin AS solution FROM User WHERE User_Name = ' + 
	connection.escape(username), function(err, rows, fields) {
		if (err) throw err;
		console.log(rows[0].solution);
		//callback(rows[0].solution);
	});
}

//is_user_admin('dontpanic');
//is_user_admin('administrator');

/* Adds new user with the giver parameters to the database, works */

var add_user = function (username, password, id, email, name, is_admin) {
	connection.query('INSERT INTO User SET?', {User_name: username, Password: password, 
	ID: id, Email: email, Name: name, Is_Admin: is_admin}, function (err, result) {
		if (err) throw err;
		console.log('Successfully added player', username, password, id, email, name, 
		is_admin);
	});
}	

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
<<<<<<< HEAD

*/
=======
>>>>>>> cc9e4ccc82e2d8392059ef1f32d074b4bd7f1eeb
