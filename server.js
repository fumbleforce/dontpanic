//Variables and import
var express     = require('express'),
    io		= require('socket.io'),
    server      = module.exports = express(),
    engine      = require('./server/js/engine.js');
    ioserver    = require('http').createServer(server);


//Configuration
server.engine('.html', require('ejs').__express);
server.set('views', __dirname + '/client/views');
server.use(express.static(__dirname + '/client/rec'));
server.set('view engine', 'html');
server.set('port', process.env.PORT || 8008);


//Handle requests
server.get('/', function(request, response){
    response.render('index');
})
console.log('Server running at http://127.0.0.1:8008/');


// Configure Socket.IO
ioserver.listen(server.get('port'));
var socket_listener = require('socket.io').listen(ioserver);

/*
socket_listener.configure(function (){
    socket_listener.set('log level', 0);
    socket_listener.set('authorization', function (handshakeData, callback) {
        callback(null, true);
    });
});
*/

// Handle client interaction    
socket_listener.sockets.on('connection', function (client) {

    //Client setup
    client.userid = 1;
    client.emit('isconnected');
    //engine.start_game(client);
    console.log('**SOCKET_LISTENER** client ' + client.userid + ' connected');
            
    //Client said hello
    client.on('msg', function(msg) {
        console.log('**SOCKET_LISTENER** received message: '+ msg);
        if(msg === 'Hello server'){
            client.emit('msg', 'Oh hello there Client');
        }
    });     
            
    //Client sends command
    client.on('command', function(c) {
        console.log('**SOCKET_LISTENER** received command ' + c);
        engine.command(client, c);
    });

    //Client Disconnects
    client.on('disconnect', function () {
        console.log('**SOCKET_LISTENER** client ' + client.userid + ' disconnected.');
        //engine.endGame(client.game.id, client.userid);
    });       
});// end onConnection
    
   
    
    
    
