/*  Engine module

    This module will feature all game logic, keeping all games in memory and writing to the DB module.
*/
var ge = module.exports = {games : {}, game_count : 0};
    //models = require('./models.js');


/*  Decode command

    Executes out-of-game commands.
*/
ge.command = function(client, command){

    if (commad.type === 'create_game') {
        var game = new models.Game(command.players, command.game_template),
            id = 1234;
        game.id = id;
        ge.games[id] = game;
        ge.game_count++;
        game.start();
    }
    else if (command.type === 'end_game') {
        // TODO end the game
        ge.game_count--;
    }
    else if (command.type === 'join_game') {
        // TODO join a game
    }
    else if (command.type === 'leave_game') {
        // TODO client leaves game
    }
    else if (commend.type === 'reconnect_game') {
        // TODO client reconnects to game
    }
    else{
        ge.games[command.gameid].event(client, command);
    }

}

ge.start_game = function(game){
    

}
























