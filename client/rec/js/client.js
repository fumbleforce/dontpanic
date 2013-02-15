var socket = io.connect('http://localhost');


socket.on('isconnected', function () {
    console.log('Connected');
    socket.emit('msg', 'Hello server');
});

socket.on('msg', function (msg) {
    console.log(msg);
    socket.emit('msg', 'Server said "' + msg + '" to me.');
});

socket.on('data', function (data) {
    var d = JSON.parse(data);
    console.log('Received data ' + data);
    //game_client.onData(d);
});

function command(c){
    var send = JSON.stringify(c)
    console.log('Sending command "' + send + '"');
    socket.emit('command', send);
}

function msg(m){
    console.log('Sending message "' + c + '"');
    socket.emit('msg', m);
}




// Testing ground

var Player = {
    title : {},
    health : 0
}

var Title = {
    title : 'Lord of the Rings'
}

var playerFunction = function(age, stuff){
    this.age = age;
    this.stuff = stuff;
}
playerFunction.prototype.add = function(){
    return this.age + this.stuff;
}

var p = new playerFunction(2, 15);

if (typeof Object.beget !== 'function') {
    Object.beget = function (o) {
        var F = function () {};
        F.prototype = o;
        return new F();
    };
}


var test = function(){
    var newplayer = Object.beget(Player);
    newplayer.title = Title;
    console.log(newplayer.title.title);
    var jsontext = JSON.stringify(newplayer);
    console.log(jsontext);
    var stringtext = JSON.parse(jsontext);
    console.log(stringtext);
    console.log(p);
    var functiontext = JSON.stringify(p);
    console.log(functiontext);
    var functionjson = JSON.parse(functiontext);
    console.log(functionjson);
    console.log(p.add());
    console.log(functionjson.age + functionjson.stuff);
}
test();
