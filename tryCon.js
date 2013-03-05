var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : "studsql.idi.ntnu.no",
  user     : "dontpanic_adm",
  password : "aebu2!Jilu",
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows[0].solution);
});

connection.end();