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
connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;
  console.log('The solution is: ', rows[0].solution);
});

var test_query = function () {
	connection.query('SELECT text AS solution FROM test WHERE ID = 1', 
	function(err, rows, fields) {
 		if (err) throw err;
 		return rows[0].solution;
	});
}

/*

get_password checks if the password parameter matches the database password for the 
given user, callback on correct_password or wrong_password, callback fungerer ikke nå, men 
tror selve kallet fungerer

*/

var get_password = function (username, password, callback) {
	connection.query('SELECT Password AS solution FROM User WHERE User_Name = ' + 
	connection.escape(username), function(err, rows, fields) {
		if (err) throw err;
		if (rows[0].solution === password) {
			callback.correct_password(username);
		}		
		else {
			callback.wrong_password();
		}
	});
}

/* for å teste sql spørringene */

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

//get_password('dontpanic', '1243', caller);

/*
	Sends a callback with the replay state for the given game id and turn id
*/

/*var get_replay_state = function (game_id, turn_id, callback) {
	connection.query('SELECT State_array AS solution FROM Replay WHERE Game_ID = ' + 
	game_ID, 'AND Turn_ID = ' turn_id, function (err, rows, fields) {
		if (err) throw err;
		callback(rows[0].solution);
	} 
}*/

/* 
	Puts the texttest in the table test
*/
var test = function (texttest) {
	connection.query('INSERT INTO test SET ?', {text: texttest}, function(err, result) {
  	if (err) throw err;
  	console.log(result.insertId);
});

}

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
/* get if User admin*/

var is_user_admin = function (username, callback) {
	connection.query('SELECT Is_Admin AS solution FROM User WHERE User_Name = ' + 
	connection.escape(username), function(err, rows, fields) {
		if (err) throw err;
		callback(rows[0].solution);
	});
}
/* get Username */ 

/* */
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


