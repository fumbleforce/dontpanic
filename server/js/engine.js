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



ge.start = function(client, c){
    
    client.emit('start_game', JSON.stringify(ge));
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

















