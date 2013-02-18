/*  Engine module

    This module will feature all game logic, keeping all games in memory and writing to the DB module.
*/
var ge = module.exports = {games : {}, game_count : 0};
    models = require('./models.js');


/*  Decode command

    Executes out-of-game commands.
*/
ge.command = function(client, command){



}

ge.start_game = function(game){
    

}

ge.create_game = function(){
    var game = new models.Game(command.players, command.game_template),
            id = 1234;
        game.id = id;
        ge.games[id] = game;
        ge.game_count++;
        game.start();
}
























