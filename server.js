/*  Variables and import
    
    Imports the express package and creates a server.
    Imports the game engine that handles all game logic.
    Imports http and makes a server that socket.io can listen to.
*/
var http		= require('http'),
	express     = require('express'),
    server      = module.exports = express(),
    engine      = require('./server/js/engine.js'),
    ioserver    = require('http').createServer(server),
    games       = {},
    uuid        = require('node-uuid'),
    db			= require('./database.js'),
	replay 		= require('./client/rec/js/replay.js');
	/*Configuration of express server:
    
    Makes the ejs module handle all html files.
    Sets port to 8008.
    Directs all view-requests to the views folder.
    All static files are served from the rec folder
	*/
server.engine('.html', require('ejs').__express);
server.set('views', __dirname + '/client/views');
server.use(express.static(__dirname + '/client/rec'));
server.use('/img', (__dirname + '/client/rec/img'));
server.set('view engine', 'html');
server.set('port', process.env.PORT || 8008);

console.log('View server running at http://127.0.0.1:8008/');

/*  Handle http requests:
    
    Only the '/' adress is handled, and returns the 
    index.html page that contains the canvas.
*/
server.get('/', function(request, response){
    response.render('index');
});

server.get('/expert', function(request, response){
    response.render('expert_form');
});

server.get('/replay', function (request, response){
	response.render('replay');
});

server.get('/login', function(request, response){
    console.log("Request for '/login'");
    response.render('login');
});

server.get('/game/', function(request, response){
	var id = request.params.id;
	console.log("Chose game template "+id);
    response.render('game');
});



/*	Data server
*/


http.createServer(function (req, res) {
    console.log('Data request received');
    
	
	

	if(req.method == "POST"){
		console.log("recieve template");
		
		req.on("data", function(data) {
			
			console.log(JSON.parse(data.toString()));
			db.set_template_string(data.toString());
		
		});
		
		//res.end();
		
		//console.log(req.
	}
	
	else {
	
		res.writeHead(200, {'Content-Type': 'text/plain'});
		db.get_all_templates(function(result) {

			var	gametemplates = [];
			var temp;
			for (var i = 0; i < result.length;i++){
				temp = result[i];
				gametemplates.push(JSON.stringify(temp));
			}
			
			console.log("Sending list of templates");

			res.end('templates('+JSON.stringify(gametemplates)+')');

		});
	}
	
	
}).listen(8124);
console.log('Data server running at http://127.0.0.1:8124/');


/* Configure Socket.IO:
    
    The socket.IO server listens to a http-server that listens to the express server.
*/
ioserver.listen(server.get('port'));
var socket_listener = require('socket.io').listen(ioserver, {log:false});


/*  TODO Configures the socket.io server
*/
//socket_listener.configure(function (){
//    socket_listener.set('log level', 0);
//    socket_listener.set('authorization', function //(handshakeData, callback) {
//        callback(null, true);
//    });
//});

/*  Handle client interaction through socket.io:
    
    TODO Clients are given a custom ID .
    TODO Starts a game session with the client.
    Listens for commands and sends them to the game engine.
    TODO Listens for disconnects and ends the game associated with the disconnected player.
*/   
socket_listener.sockets.on('connection', function (client) {

    // TODO Client setup
    client.userid = uuid.v1();
    client.emit('is_connected');
    console.log('**SOCKET_LISTENER** client ' + client.userid + ' connected');
    
    client.on('dp_user_id', function(o) {
        console.log("Checking for user ID");
        /* if (o.id) {
            console.log("Found client with ID "+o.id);
            client.userid = o.id;
            if (games[client.userid]) {
                games[client.userid].client = client;
                games[client.userid].start();
            }
            else{
                client.emit('not_in_game', {});
            }
        }
        else{*/
            client.emit('not_in_game', {});
        /*}*/
    });
    
    //Client sent log message
    client.on('msg', function(msg) {
        console.log('**SOCKET_LISTENER** received message: '+ msg);
    });
    

            
    client.on('end_game', function(c) {
        console.log('**SOCKET_LISTENER** received command ' + c);
        engine.end_game(client, c);
    });
	
    client.on('create_game', function(c) {
		
		console.log('**SOCKET_LISTENER** received create command ');
    	//henter ut gametemplate med gitt template id
    	console.log('Retrieving template with id: '+c.template_id);
    	db.get_template_string(c.template_id, function(result) {
			var	gametemplate = JSON.parse(result[0].json_string);
			
			console.log("Creating game object based on template..");
			var g = new engine(client.userid, client, gametemplate);
			console.log("Created.");
	    	games[g.id] = g;
	    	client.game_id = g.id;
	    	g.start(client);		
		});
    })

    client.on('join_game', function(c) {
        console.log('**SOCKET_LISTENER** received join command ' + c);
        engine.join_game(client, c);
    });
    
    client.on('leave_game', function(c) {
        console.log('**SOCKET_LISTENER** received leave command ' + c);
        engine.leave_game(client, c);
    });
    
    client.on('game_command', function(c) {
        console.log('');
        console.log('**SOCKET_LISTENER** Received:');
        var parsed = JSON.parse(c);
        
        if(games[client.userid]) games[client.game_id].command(client, parsed);
    });
	
	client.on('replay', function (c) {
		db.get_all_replays(function(result) {
			
			var r = new replay(result);
			var	replays = [];
			var temp;
			
			for (var i = 0; i < result.length;i++){
				temp = result[i];
				replays.push(JSON.stringify(temp));
			}
			res.end('replays('+JSON.stringify(replays)+')');
		});
	})
	
	client.on('next_command', function (c) {
		db.get_command(c.replay_id, c.command_id, function(result) {
			
		});
	})
	
    client.on('disconnect', function () {
        console.log('**SOCKET_LISTENER** client ' + client.userid + ' disconnected.');
       	//TODO Save to DB
        games[client.userid] = {};
    });
      
});// end onConnection

   
