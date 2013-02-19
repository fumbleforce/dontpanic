/*  Engine module

    This module will feature all game logic, keeping all games in memory and writing to the DB module.
*/
var ge = module.exports = {games : {}, game_count : 0},
    models = require('./models.js');


/*  Decode command

    Executes in-game commands.
*/
ge.command = function(client, c){
    var g = ge.games[c.gameid];
    switch (c.type) {
        case 'move_player':
            g.move_player(c);
            break;
        case '':
            g.event;
            break;
            
    }


}



ge.create_game = function(client, c){
    var players = [], 
        game,
        player;
    
    for (var i = 0;i<c.players.length;i++) {
        player = new models.Player(c.players[i]);
        players.push(player);
    }
    
    game = new models.Game(c.players, c.game_template);
    game.id = 1234;
    game.add_client(client);
    ge.games[id] = game;
    ge.game_count++;
    game.start_game();
}

ge.end_game = function(client, c) {
    game.save();
    ge.games.pop(c.game_id);
}

ge.join_game = function(client, c) {
    var game = ge.games[c.game_id];
    // TODO Expert joins game
}

ge.leave_game = function(client, c) {
    // TODO Expert leaves game
}

ge.reconnect_game = function(client, c) {
    // TODO Users reconnect to existing game
}
























