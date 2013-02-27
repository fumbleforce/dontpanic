/*  Engine module

    This module will be a game "Class".
*/

var ge = module.exports = function (id, client) {

	this.id = 0;
	this.map = {};
	this.settings = {};
	this.players = [];
	this.client = client;
	this.active_player = 0;
	this.turn = 0;
	var SCALE= 10;
    this.map.nodes = [];
    this.map.zones = [];
    
    var conn = [
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
           ],
    posx = [
        1*SCALE, 1*SCALE, 3*SCALE, 3*SCALE, 3*SCALE,
        5*SCALE, 5*SCALE, 7*SCALE, 7*SCALE, 7*SCALE,
        9*SCALE, 10*SCALE, 11*SCALE, 11*SCALE, 12*SCALE,
        13*SCALE, 13*SCALE, 13*SCALE, 15*SCALE, 15*SCALE,
        15*SCALE
    ],
    posy = [
        5*SCALE, 11*SCALE, 3*SCALE, 7*SCALE, 9*SCALE,
        7*SCALE, 15*SCALE, 3*SCALE, 7*SCALE, 9*SCALE,
        3*SCALE, 15*SCALE, 1*SCALE, 5*SCALE, 11*SCALE,
        3*SCALE, 7*SCALE, 15*SCALE, 8*SCALE, 11*SCALE,
        15*SCALE
    ],
    posx = [100, 350, 700, 100, 450, 600],
    posy = [60, 140, 80, 320, 420, 320],
	player_colors = ["blue","red","yellow","grey","purple","brown","green","orange"];

    for(var i = 0; i < 21; i++){
		    node = new ge.Node(i, posx[i], posy[i], true, conn[i]);
		    this.map.nodes.push(node);
    }


    var zones = [];

    zones[0] = new ge.Zone(0, [0, 1, 3, 4], [1, 2, 5]);
    zones[1] = new ge.Zone(1, [0, 2, 3, 5], [0, 3, 4]);
    zones[2] = new ge.Zone(2, [1, 4, 6, 9], [0, 5, 7]);
    zones[3] = new ge.Zone(3, [2, 5, 7], [1, 4, 6]);
    zones[4] = new ge.Zone(4, [3, 5, 8], [1, 5, 6]);
    zones[5] = new ge.Zone(5, [3, 4, 8, 9], [0, 2, 4, 10]);
    zones[6] = new ge.Zone(6, [5, 7, 8, 10, 13], [3, 4, 8, 9]);
    zones[7] = new ge.Zone(7, [6, 9, 11, 14], [2, 11, 12]);
    zones[8] = new ge.Zone(8, [10, 12, 13, 15], [6, 13]);
    zones[9] = new ge.Zone(9, [8, 13, 16], [6, 10, 13]);
    zones[10] = new ge.Zone(10, [8, 9, 16], [5, 9, 11]);
    zones[11] = new ge.Zone(11, [9, 14, 16, 19], [7, 10, 15, 16]);
    zones[12] = new ge.Zone(12, [11, 14, 17], [7, 11, 16]);
    zones[13] = new ge.Zone(13, [13, 15, 16], [8, 9, 14]);
    zones[14] = new ge.Zone(14, [15, 16, 18], [13, 15]);
    zones[15] = new ge.Zone(15, [16, 18, 19], [11, 14]);
    zones[16] = new ge.Zone(16, [14, 17, 19, 20], [11, 12]);

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
    
    this.map.zones = zones;
    
    this.players = [];
    player_colors = ["blue","red","yellow","grey","purple","brown","green","orange"];

    for(var i = 0; i < 8; i++){
	    player = new ge.Player(i, "player" + i, 0, player_colors[i], {}, 4);
	    this.players.push(player);
    }



	
}




/*  Decode command

    Executes in-game commands.
*/
ge.command = function(client, c){
    var nodes = ge.map.nodes,
        players = ge.players;
    
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



ge.prototype.start = function(client){
    var g = {players:this.players, map:this.map};
    console.log(g);
    client.emit('start_game', JSON.stringify(g));
}




ge.prototype.reconnect_game = function(client, c) {
    // TODO Users reconnect to existing game
}

ge.prototype.save_state = function(client, c) {

}
ge.prototype.delete_game = function(client, c) {
}




ge.prototype.next_player = function(game) {
	game.active_player.set_actions_left(4);
	game.active_player = ge.players[(game.turn-1) % game.players-length];
}


ge.prototype.timer_tick = function(client, c) {	
	//TODO: all paniced zones get +5, unpaniced get +1, 
	// Full panic spreads, and gives +5 to neighbours
}






//----------------------------
//---------MODELS-------------
//----------------------------




ge.Player = function(id, user, node, color, role, actions_left) {
	this.id = id;
	this.user = user;
	this.node = node;//Position of the player
	this.color = color;
	this.role = role;
	this.info_cards = [];
	this.actions_left = actions_left;
	this.class = 'player';
	
}
ge.Player.prototype.set_actions_left = function (actions_left) {
	this.actions_left = actions_left;
}
ge.Player.prototype.minus_one_action = function () {
	if (this.actions_left != 0) {
		this.actions_left -= 1;	
		return true;
	}
	return false;
	//update gui?
}
ge.Player.prototype.remove_info_card = function(info_card) {
	for (var i = 0; i < this.info_cards.length; i++) {
		if (this.info_cards[i] === info_card) {
			this.info_cards.splice(i, 1);
			//update gui?
		}
	}
}
ge.Player.prototype.add_info_card = function(info_card) {
	this.info_cards.push(info_card);
	//update gui?
}
ge.Player.prototype.move_player = function (node) {
	if (this.node === node) {
		return false
	} else if (this.node.connects_to(node.id)) {
		this.node = node;
		this.minus_one_action();
		return true;
	}
	return false;
}
ge.Player.prototype.add_information_center = function () {
	if (this.node.has_information_center){
		return false;
	}
	else if (this.actions_left < 4){ // TODO: finne max antall actions for player
		return false;
	}
	else {
		this.node.has_information_center = true;
		this.set_actions_left(0);
		return true;
	}
}
ge.Player.prototype.add_road_block = function () {
	if(this.node.has_road_block){
		return false;
	}
	else if(this.minus_one_action){
		return this.node.add_road_block();
	}
	return false;
}
ge.Player.prototype.remove_road_block = function () {
	if(!this.node.has_road_block){
		return false;
	}
	else if(this.minus_one_action){
		return this.node.remove_road_block();
	}
	return false;
}



ge.User = function (username, password, name, email, is_admin) {
	this.username = username;
	this.password = password;
	this.name = name;
	this.email = email;
	this.is_admin = is_admin;
}












ge.Node = function (id, x, y, is_start_position, connects_to) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.is_start_position = is_start_position;
	this.connects_to = connects_to; // Nodes
	this.has_information_center = false;
	this.has_road_block = false;
	
}
ge.Node.prototype.add_information_center = function () {
	if (this.has_information_center){
	    return false;
	}
	else { 
		this.has_information_center = true;
		return true;	
	}
}

ge.Node.prototype.add_road_block = function () {
	if (this.has_road_block) {
		return false;
	}
	else {
		this.has_road_block = true;
		return true;	
	}
	return true;
}

ge.Node.prototype.remove_road_block = function () {
	if (this.has_road_block = false) {
		return false;
	}
	else {
		this.has_road_block = false;
		return true;
	}	
	return true;
}
ge.Node.prototype.connects_to = function(n){
    return this.connects_to.indexOf(n.id) > -1;
}









ge.Role = function (title, effect) {
	this.title = title;
	this.effect = effect;
}






ge.Event = function (text, effect) {
	this.text = text;
	this.effect = effect;
}










ge.Zone = function (id, nodes, zones) {
	this.id = id;
	this.type = "regular";
	this.people = 50;
	this.nodes = nodes;
	this.adjacent_zones = zones;
	this.panic_level = 0;//settes til 0 i starten??
}
ge.Zone.prototype.update_panic_level = function (panic_level) {
	this.panic_level += panic_level;		
	if (this.panic_level >= 50) {
		this.panic_level = 50;
		//send beskjed om maks panikk
	} else if (this.panic_level < 0) {
		this.panic_level = 0;
	}
}

ge.Zone.prototype.dec_panic = function(player) {
	if (player.node.adjacent_zones.indexOf(this) >= 0) {
		this.update_panic_level(-5);
		return true;
	}
	return false;
}
ge.Zone.prototype.move_people = function(player, to_zone) {
	if (player.node.adjacent_zones.indexOf(this) >= 0 &&
		this.adjacent_zones.indexOf(to_zone) >= 0) {
		this.people -= 5; //TODO: add roles-difference
		to_zone.people += 5;
		return true;
	}
	return false;
}

ge.Zone.prototype.move_people = function (people, to_zone) {
	if (this.people >= people) {
		for (var i = 0; i < this.adjacent_zones.length; i++) {
			//hvis zonen er nabo kan du flytte
			if (this.adjacent_zones[i] === to_zone) {
				this.people -= people;
				to_zone.people += people;
				return 1;
			}
		}
		//error message to gui
		console.log("The zone is not adjacent!!");
		return 0;
	}
	else {
		//error 
		console.log("There isnt that many people in this zone!!");
	}
}









ge.Timer = function (timer_interval) {
	//sets the interval for increased panic in minutes
	setInterval(function(){
		alert("Time interval has passed, the panic is increasing in " +
			"the city!");
	},(interval * 60 * 1000));
}







ge.Info_card = function (text, effect) {
	this.text = text;
	this.effect = effect;
}







ge.Map = function (nodes, zones) {
	this.nodes = nodes;
	this.zones = zones;
}






ge.Settings = function (timer_interval) {
	var timer = new timer(timer_interval);
}

















