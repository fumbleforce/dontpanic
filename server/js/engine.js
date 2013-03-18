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
	var SCALE= 90;
	var PADD = 50;
    this.map.nodes = [];
    this.map.zones = [];
    this.timer = 20;
    this.information_centers = 0;
    this.road_blocks = 0;
    this.max_information_centers = 5;
    this.max_road_blocks = 10;
    
    
    this.info_cards = [
        {   id:0,
            name:"Decrease all red",
            effects: [{
                domain:'zone',
                type:'panic',
                panic:(-5),
                affects:[0,1,2,3,4,5,6,7,8,9]
            }]
        }
    ];
    
    var conn = [
        [1, 2, 3], // 0 
        [0, 4, 6],
        [0, 5, 7],
        [0, 4, 5, 8],
        [1, 3, 9],
        [2, 3, 7, 8], // 5
        [1, 9, 11],
        [2, 5, 10],
        [5, 9, 13, 16],
        [4, 6, 8, 14, 16],
        [7, 12, 13], //10
        [6, 14, 17],
        [10, 15],
        [8, 10, 15, 16],
        [9, 11, 17, 19],
        [12, 13, 16, 18],//15
        [8, 9, 13, 15, 18, 19],
        [11, 14, 20],
        [15, 16, 19],
        [14, 16, 18, 20],
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
        5*SCALE, 15*SCALE, 3*SCALE, 7*SCALE, 9*SCALE,
        3*SCALE, 15*SCALE, 1*SCALE, 5*SCALE, 11*SCALE,
        3*SCALE, 7*SCALE, 15*SCALE, 8*SCALE, 11*SCALE,
        15*SCALE
    ];

    for (var i = 0; i < conn.length; i++){
        posy[i] = posy[i]+PADD;
        posx[i] = posx[i]+PADD;
    }

    for(var i = 0; i < 21; i++){
		    node = new ge.Node(i, posx[i], posy[i], true, conn[i]);
		    this.map.nodes.push(node);
    }
    
    //TEST add some road blocks
    this.map.nodes[0].has_road_block = true;
    this.map.nodes[2].has_road_block = true;
    this.map.nodes[3].has_road_block = true;
    this.map.nodes[5].has_road_block = true;
    this.map.nodes[8].has_road_block = true;
    this.map.nodes[13].has_road_block = true;
    this.map.nodes[16].has_road_block = true;
    
    //add road blocks on all nodes for testing node/node connections
//    for (var i=0; i<this.map.nodes.length; i++){
//    	this.map.nodes[i].has_road_block = true;
//    }
	


    var zones = [];

    zones[0] = new ge.Zone(0, [0, 1, 4, 3], [1, 2, 5]);
    zones[1] = new ge.Zone(1, [0, 2, 5, 3], [0, 3, 4]);
    zones[2] = new ge.Zone(2, [1, 4, 9, 6], [0, 5, 7]);
    zones[3] = new ge.Zone(3, [2, 5, 7], [1, 4, 6]);
    zones[4] = new ge.Zone(4, [3, 5, 8], [1, 5, 6]);
    zones[5] = new ge.Zone(5, [3, 4, 9, 8], [0, 2, 4, 10]);
    zones[6] = new ge.Zone(6, [5, 7, 10, 13, 8], [3, 4, 8, 9]);
    zones[7] = new ge.Zone(7, [6, 9, 14, 11], [2, 11, 12]);
    zones[8] = new ge.Zone(8, [10, 12, 15, 13], [6, 13]);
    zones[9] = new ge.Zone(9, [8, 13, 16], [6, 10, 13]);
    zones[10] = new ge.Zone(10, [8, 9, 16], [5, 9, 11]);
    zones[11] = new ge.Zone(11, [9, 14, 19, 16], [7, 10, 15, 16]);
    zones[12] = new ge.Zone(12, [11, 14, 17], [7, 11, 16]);
    zones[13] = new ge.Zone(13, [13, 15, 16], [8, 9, 14]);
    zones[14] = new ge.Zone(14, [15, 16, 18], [13, 15]);
    zones[15] = new ge.Zone(15, [16, 18, 19], [11, 14]);
    zones[16] = new ge.Zone(16, [14, 17, 20, 19], [11, 12]);

    zones[0].color = "aqua";
    zones[1].color = "steelblue";
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
    
    //TEST add panic on a few random zones
    zones[1].panic_level = 10;
    zones[3].panic_level = 25;
    zones[4].panic_level = 30;
    zones[5].panic_level = 5;
    zones[6].panic_level = 10;
    zones[9].panic_level = 25;
    zones[12].panic_level = 5;
    zones[14].panic_level = 40;
    zones[16].panic_level = 45;
    
    //set centroidX and centroidY for test zone
    //TODO THIS IS ACTUALLY CENTER, NOT CENTROID. For better result, 
    // centroid has to be calculated (might not be of use to us since
    // polygons aren't that extreme)
    for (var zon=0; zon<zones.length; zon++){
    	var xx=0, yy=0;
	    for (var i=0; i<zones[zon].nodes.length; i++){
	    	xx+=this.map.nodes[zones[zon].nodes[i]].x;
	    	yy+=this.map.nodes[zones[zon].nodes[i]].y;
	    }
    zones[zon].centroid=[xx/zones[zon].nodes.length, yy/zones[zon].nodes.length];
    }
    
    
    this.players = [];
    player_colors = ["red","orange","yellow","chartreuse ","green","aqua","blue","purple"];

    for(var i = 0; i < 8; i++){
    	player = new ge.Player(i, "player" + i, 0, player_colors[i], {}, 4);
    	player.info_cards.push(this.info_cards[0]);
    	player.info_cards.push(this.info_cards[0]);
    	this.players.push(player);
    }
	
}


/*  Decode command

    Executes in-game commands.
*/
ge.prototype.command = function(client, c){
    var nodes = this.map.nodes,
		zones = this.map.zones,
        players = this.players,
        changed = {type:'none'};
    
    console.log("Interpreting in-game command of type: "+c.type);
	
    switch (c.type) {
        case 'move_player':
            console.log("Trying to move player "+ c.player_id +
                " from "+player.node+" to "+c.node_id+ 
                " when playernode connects to "+nodes[player.node].connects_to);
            var p = players[c.player_id],
                dec_action = false;
            if (nodes[p.node].connects_to.indexOf(c.node_id) > -1 && 
					(c.player_id == this.active_player)){
				if(p.minus_one_action()){
					
					p.node = c.node_id;
				    dec_action = true;
					console.log("Player was moved");
				}
            }
            else{
                console.log("Failed moving player");
                	
			}
			changed = {
			    type:'moved_player',
			    player:p,
			    dec_action:dec_action
			};
	
            break;
            
            
            
		case 'decrease_panic':
			console.log("Trying to decrease panic in zone: " + c.zone_id);
			var dec_action = false;
			
			if (zones[c.zone_id].nodes.indexOf(players[this.active_player].node) >= 0 && 
				(zones[c.zone_id].panic_level >= 5)){
					
				
				if(players[this.active_player].minus_one_action()){
					
					zones[c.zone_id].update_panic_level(-5); //TODO: add roles-difference
				    dec_action=true;
				}
				else{ 
					client.emit('error', 'Player is out of moves');
					break;
				}
			}
			else{
				client.emit('error', 'Could not decrease panic');
				break;
			}
			
			
			changed = {
				type:'decreased_panic',
				zone:this.map.zones[c.zone_id],
				dec_action:dec_action
			};
					
			break;
			
			
			
		case 'move_people':
			// TODO: find out how many people we can move
			console.log("Trying to move people from zone: " + c.from_zone_id +
				"to zone: " + c.to_zone_id);
			var dec_action = false;
			
			if (!this.map.zones[c.from_zone_id]
				.move_people(players[this.active_player], 
				this.zones[c.to_zone_id])) {
				
				client.emit('error', 'Failed moving people');
				break;
			}
			else{
			    dec_action = true;
			}
			changed = {
				type:'moved_people',
				dec_action:dec_action,
				from_zone:this.zones[c.from_zone_id],
				to_zone:this.zones[c.to_zone_id]
			};

			break;
			
			
		//TODO Finish this
		case 'create_info_center':
		
			console.log("Trying to place info center in node " + nodes[players[this.active_player].node].id);
			var dec_4_actions = false;

			if(this.information_centers === this.max_information_centers){
				client.emit('error', "Player "+this.active_player+" failed to add information center, no information centers left!");
				break;
			}

			if(!nodes[players[this.active_player].node].has_information_center){
				
				//TODO do this differently (minus_all_actions)? yes.
				if(players[this.active_player].minus_all_actions()){
					nodes[players[this.active_player].node].has_information_center = true;
					this.information_centers++;
					dec_4_actions = true;
				}
				else{
					client.emit('error', "Player "+this.active_player+" failed to add information center, player does not have enough actions");
					break;	
				}	
			}
			else{
				client.emit('error', "Player "+this.active_player+" failed to add information center, node "+nodes[players[this.active_player].node].id+" already has center");
				break;	
			}

			
			var stringed = JSON.stringify({
				type:'added_information_center',
				node:nodes[players[this.active_player].node],
				dec_4_actions:dec_4_actions
			});
			client.emit('change', stringed);

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
			var ic = players[c.player].info_cards.pop(c.info_card);
			
			changed = effect(ic, this);
            changed.players.push(players[c.player]);
			break;
			
			
	    case 'inc_panic':
	        for (var i = 0; i < zones.length;i++) {
				if (!zones[i].is_panic_zero()){
					zones[i].update_panic_level(10);
				}
	        }
	        this.timer += 20;
	        
	        changed = {
			    type:'update_panic',
			    zones:zones,
			    timer:this.timer
			};
	        
	        break;
		
		
		
		case 'end_turn':
		    // TODO : last player gets Icards and eventcards, add more change
		    
		    players[this.active_player].actions_left = 4;
		    
			this.turn++;
			if (this.active_player >= this.players.length-1) {
			    this.active_player = 0;
			}
			else {
			    this.active_player++;
			}
			
			players[this.active_player].info_cards.push(this.info_cards[0]);
			
			changed = {
			    type:'next_turn',
			    player:players[this.active_player],
			    turn:this.turn
			};
	
			//ge.save_state(client, c);
			break;
			
			
        case '':
            
            g.event;
            break;
        
        
        console.log("No matching command types");
            
    }
    
    if(changed.type !== 'none'){
        var stringed = JSON.stringify(changed);
        client.emit('change', stringed);	
    }
}



ge.prototype.start = function(client){
    var g = {players:this.players, map:this.map};
    console.log(g.players);
    console.log(g.map.nodes);
    console.log(g.map.zones);
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

function effect(card, g) {
    var effects = card.effects,
        e, i, z,
        zones = g.map.zones,
        nodes = g.map.nodes,
        players = g.players,
        changed = empty_state();
        
    changed.type='effect';   
     
    console.log("Executing card");
    console.log(card);
    for (i = 0; i<effects.length; i++){
        e = effects[i];
        console.log("Effect nr "+i);
        console.log(e);
        switch(e.domain){
            case 'zone':
                switch(e.type){
                    case 'panic':
                        for (z = 0; z<e.affects.length; z++){
                            zones[e.affects[z]].update_panic_level(e.panic);
                            changed.zones.push(zones[e.affects[z]]);
                        }
                        break;
                        
                    case 'what':
                        
                        break;
                
                }
            
            
            
                break;
            case 'player':
                switch(e.type){
                    case 'hang yourself':
                    
                        break;
                    case 'kill the president':
                        
                        break;
                }
            
            
            
                break;
        }
        
        
    }//end effect list for
    
    return changed;
}//end effect()


function state(g){
    return {
        type : 'state',
        zones : g.map.zones,
        nodes : g.map.nodes,
        players : g.players
    };
}
function empty_state(g){
    return {
        type : 'none',
        zones : [],
        nodes : [],
        players : []
    };
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
ge.Player.prototype.increase_actions_left = function (actions) {
	this.actions_left += actions;
}
ge.Player.prototype.minus_one_action = function () {
	if (this.actions_left != 0) {
		this.actions_left -= 1;	
		return true;
	}
	return false;
	//update gui?
}

//TODO after placing info centers, remove 4
ge.Player.prototype.minus_all_actions = function () {
	if (this.actions_left >= 4) {
		this.actions_left -= 4;	
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
//ge.Player.prototype.add_information_center = function () {
//	if (this.node.has_information_center || this.actions_left < 4){
//		return false;
//	}
//	else {
//		this.node.has_information_center = true;
//		this.set_actions_left(0);
//		return true;
//	}
//}
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
	this.centroid = [0,0];//center (centroid) X and Y of zone polygon to put panic info
	
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

ge.Zone.prototype.is_panic_zero = function () {
	if(this.panic_level == 0){
		return true;
	}
	return false;
}

ge.Zone.prototype.dec_panic = function(player) {
	client.emit('msg', 'dec panic in engine recieved');
	if (player.node.adjacent_zones.indexOf(this) >= 0) {
		if(this.panic_level >= 5){
			client.emit('msg', 'dec panic in engine recieved 2');
			if(player.minus_one_action()){
				
				this.update_panic_level(-5); //TODO: add roles-difference
				return true;
			}
		}
	}
	return false;
}

// TODO TODO TODO TODO TODO You can NOT have two functions with the same name in Javascript. FIX
// TODO TODO TODO TODO TODO You can NOT have two functions with the same name in Javascript. FIX
// TODO TODO TODO TODO TODO You can NOT have two functions with the same name in Javascript. FIX
// TODO TODO TODO TODO TODO You can NOT have two functions with the same name in Javascript. FIX

 // should this method be different because of panic ?? 
ge.Zone.prototype.move_people = function(player, to_zone) {
	if (player.node.adjacent_zones.indexOf(this) >= 0 &&
		this.adjacent_zones.indexOf(to_zone) >= 0) {
		if(player.minus_one_action()){
			this.people -= 5; //TODO: add roles-difference
			to_zone.people += 5;
			return true;
		}
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
// TODO TODO TODO TODO TODO You can NOT have two functions with the same name in Javascript. FIX
// TODO TODO TODO TODO TODO You can NOT have two functions with the same name in Javascript. FIX
// TODO TODO TODO TODO TODO You can NOT have two functions with the same name in Javascript. FIX
// TODO TODO TODO TODO TODO You can NOT have two functions with the same name in Javascript. FIX








ge.Timer = function (timer_interval) {
	//sets the interval for increased panic in minutes
	setInterval(function(){
		alert("Time interval has passed, the panic is increasing in " +
			"the city!");
	},(interval * 60 * 1000));
}



/*
	

	text 	What to be shown to the users when looking at the card
	id 		identification to what case sentence to be called when using the card
	value	value to be used in the effect of the card
*/
ge.Info_card = function (text, id, value) {
	this.text = text;
	this.id = id;
	this.value = value;
}







ge.Map = function (nodes, zones) {
	this.nodes = nodes;
	this.zones = zones;
}






ge.Settings = function (timer_interval) {
	var timer = new timer(timer_interval);
}

















