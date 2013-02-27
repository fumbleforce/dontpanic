/*  Engine module

    This module will feature all game logic, keeping all games in memory and writing to the DB module.
*/
var ge = module.exports = {games : {}, game_count : 0},
    models = require('./models.js');


/*  Decode command

    Executes in-game commands.
*/
ge.command = function(client, c){
    
    var g = ge.games[c.game_id];
    var nodes = g.map.nodes;
    var players = g.players;
    
    console.log("Interpreting in-game command of type: "+c.type);
    switch (c.type) {
        case 'move_player':
            console.log("Trying to move player "+ c.player_id +
                " from "+player.node+" to "+c.node_id+ 
                " when playernode connects to "+nodes[player.node].connects_to);
            var p = players[c.player_id];
            if (nodes[p.node].connects_to.indexOf(c.node_id) > -1 && 
					(c.player_id == g.active_player)){
				if(p.minus_one_action()){
					
					p.node = c.node_id;
				
					console.log("Player was moved");
				}
            }
            else{
                console.log("Failed moving player");	
			}
			var stringed = JSON.stringify({
			    type:'moved_player',
			    player:p
			});
			client.emit('change', stringed);	
            break;
		case 'dec_panic':
			if (!g.map.zones[c.zone_id].dec_panic(g.players[c.player_id])) {
				client.emit('error', 'Failed decreasing panic');
			}
			break;
		case 'move_people':
			// TODO: find out how many people we can move
			if (!g.map.zones[c.from_zone_id]
					.move_people(g.players[c.player_id], g.zones[c.to_zone_id])) {
				client.emit('error', 'Failed moving people');
			}
			break;
		case 'create_info_center':
			if(!g.players[c.player_id].add_information_center()){
				client.emit('error', 'Failed to add information center');
			}
			break;
		case 'create_barrier':
			if(!g.player[c.player_id].add_road_block()) {
				client.emit('error', 'Failed to add barrier');
			}
			break;
		case 'remove_barrier':
			if(!g.player[c.player_id].remove_road_block()){
				client.emit('error', 'Failed to remove road block');
			}
			break;		
		case 'use_card':
			break;
		
		case 'end_turn':
		// TODO : last player gets Icards and eventcards
			ge.next_player(g);
			ge.save_state(client, c);
			break;
        case '':
            
            g.event;
            break;
        console.log("No matching command types");
    }
}



ge.create_game = function(client, c){
    /*var players = [], 
        game,
        player;
    
    for (var i = 0;i<c.players.length;i++) {
        player = new models.Player(c.players[i]);
        players.push(player);
    }
    
    game = new models.Game(c.players, c.game_template);
    game.id = 1234; // TODO: Make uniqe ID, and store to database
    game.add_client(client);
	game.active_player = 0;
    ge.games[id] = game;
    ge.game_count++;
    ge.start_game(client, c, game);
	*/
	
	// TODO: create test game
	
	var SCALE = 50;
	var nodes = [];
		conn = [
			[1, 2, 3], // 0 
			[0, 4, 6],
			[0, 5, 7],
			[0, 4, 5, 8],
			[1, 3, 9],
			[2, 3, 7, 8], // 5
			[1, 9, 11],
			[2, 5, 10],
			[3, 5, 9, 13],
			[4, 6, 8, 14],
			[7, 12, 13], //10
			[6, 14, 17],
			[10, 15],
			[8, 10, 15, 16],
			[9, 11, 17, 19],
			[13, 16, 18],//15
			[13, 15, 18],
			[11, 14, 20],
			[15, 16],
			[14, 16, 18],
			[17, 19] // 20
				];
	    posx = [
			1*SCALE, 1*SCALE, 3*SCALE, 3*SCALE, 3*SCALE,
			5*SCALE, 5*SCALE, 7*SCALE, 7*SCALE, 7*SCALE,
			9*SCALE, 10*SCALE, 11*SCALE, 11*SCALE, 12*SCALE,
			13*SCALE, 13*SCALE, 13*SCALE, 15*SCALE, 15*SCALE,
			15*SCALE
		]; 
		posy = [
			5*SCALE, 11*SCALE, 3*SCALE, 7*SCALE, 9*SCALE,
			7*SCALE, 15*SCALE, 3*SCALE, 7*SCALE, 9*SCALE,
			3*SCALE, 15*SCALE, 1*SCALE, 5*SCALE, 11*SCALE,
			3*SCALE, 7*SCALE, 15*SCALE, 8*SCALE, 11*SCALE,
			15*SCALE
		];
		player_colors = ["blue","red","yellow","grey","purple","brown","green","orange"];
	
	for(var i = 0; i < 21; i++){
			node = new models.node(i, posx[i], posy[i], true, conn[i]);
			nodes.push(node);
	}
	
	//test set road block between two nodes
	//nodes[1].has_road_block = true;
	//nodes[2].has_road_block = true;

	//test draw info center on two nodes
	//nodes[2].has_information_center = true;
	//nodes[4].has_information_center = true;
	
	
	var zones = [];
	

	
	zones[0] = new models.zone(0, [0, 1, 4, 3], [1, 2, 5]);
	zones[1] = new models.zone(1, [0, 2, 5, 3], [0, 3, 4]);
	zones[2] = new models.zone(2, [1, 4, 9, 6], [0, 5, 7]);
	zones[3] = new models.zone(3, [2, 5, 7], [1, 4, 6]);
	zones[4] = new models.zone(4, [3, 5, 8], [1, 5, 6]);
	zones[5] = new models.zone(5, [3, 4, 9, 8], [0, 2, 4, 10]);
	zones[6] = new models.zone(6, [5, 7, 10, 13, 8], [3, 4, 8, 9]);
	zones[7] = new models.zone(7, [6, 9, 14, 11], [2, 11, 12]);
	zones[8] = new models.zone(8, [10, 12, 15, 13], [6, 13]);
	zones[9] = new models.zone(9, [8, 13, 16], [6, 10, 13]);
	zones[10] = new models.zone(10, [8, 9, 16], [5, 9, 11]);
	zones[11] = new models.zone(11, [9, 14, 19, 16], [7, 10, 15, 16]);
	zones[12] = new models.zone(12, [11, 14, 17], [7, 11, 16]);
	zones[13] = new models.zone(13, [13, 15, 16], [8, 9, 14]);
	zones[14] = new models.zone(14, [15, 16, 18], [13, 15]);
	zones[15] = new models.zone(15, [16, 18, 19], [11, 14]);
	zones[16] = new models.zone(16, [14, 17, 20, 19], [11, 12]);

	zones[0].color = "aqua";
	zones[1].color = "blue";
	zones[2].color = "brown";
	zones[3].color = "darkblue";
	zones[4].color = "darkgreen";
	zones[5].color = "indigo";
	zones[6].color = "gold";
	zones[7].color = "orange";
	zones[8].color = "grey";
	zones[9].color = "peru";
	zones[10].color = "silver";
	zones[11].color = "teal";
	zones[12].color = "yellow";
	zones[13].color = "yellowgreen";
	zones[14].color = "tomato";
	zones[15].color = "seashell";
	zones[16].color = "lightgoldenrodyellow";
	var players = [];
		
	for(var i = 0; i < 4; i++){
		player = new models.Player(i, "player" + i, 0, player_colors[i], {}, 4);
		players.push(player);
	}
	//add more players to test offset
	player4 = new models.Player(4, "player" + 4, 0, player_colors[4], {}, 4);
	players.push(player4);
	player5 = new models.Player(5, "player" + 5, 0, player_colors[5], {}, 4);
	players.push(player5);
	player6 = new models.Player(6, "player" + 6, 0, player_colors[6], {}, 4);
	players.push(player6);
	player7 = new models.Player(7, "player" + 7, 0, player_colors[7], {}, 4);
	players.push(player7);
	
	
	var game = new models.game(players, client, {map: {zones:zones, nodes:nodes}, settings: {} });

    ge.games[game.id] = game;
    ge.game_count++;
    var temp = {game_id:game.id, players: game.players, map:game.map};
    client.emit('start_game', JSON.stringify(temp));
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
	ge.games[c.game_id].pop(c);
	

    // TODO Expert leaves game
}

ge.reconnect_game = function(client, c) {
    // TODO Users reconnect to existing game
}

ge.save_state = function(client, c) {
	// TODO: Save state of game	
	/*
		Requirements:
		Position and status of each player
		Panic level and information centers at each zone
		Every card each player has.
		Pause the timer. Put the timer in the client
	*/
}
ge.delete_game = function(client, c) {
}




ge.next_player = function(game) {
	game.active_player.set_actions_left(4);
	game.active_player = ge.players[(game.turn-1) % game.players-length];
}


ge.timer_tick = function(client, c) {	
	//TODO: all paniced zones get +5, unpaniced get +1, 
	// Full panic spreads, and gives +5 to neighbours
}




















