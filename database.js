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

//get_password('dontpanic', '123');

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
	Puts the given replay string to Replay in the database
*/

var set_replay_state = function (game_id, turn_id, replay_string)  {
	connection.query('INSERT INTO Replay SET?', {Game_ID: game_id, 
	Turn_id: turn_id, State_array: replay_string}, function (err, result) {
		if (err) throw err;
		console.log('Sucessfully added', replay_string, 'to replay state');
	});
}
//set_replay_state(2, 1, 'player1node3');

var get_replay_state = function (game_id, turn_id, callback) {
	connection.query('SELECT State_array AS solution FROM Replay WHERE Game_ID = ' + 
	game_id, 'AND Turn_ID = ' + turn_id, function (err, rows, fields) {
		if (err) throw err;
		console.log(rows[0].solution);
		//callback(rows[0].solution);
	});
}

get_replay_state(1,1);

/* 
	Puts the texttest in the table test
*/
var test = function (texttest) {
	connection.query('INSERT INTO test SET ?', {text: texttest}, function(err, result) {
  	if (err) throw err;
  	console.log(result.insertId);
});

}

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

/* get Username */ 

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
