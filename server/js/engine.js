/**
* This module will be a game "Class".
* It is an instance of a game, and handles all game related logic.
*
* @module Game Engine
* @class Game Engine
* @param {Integer} id Game id
* @param {Object} client The socket.io client creating the game
* @param {Object} template Template to base game on
* @param {Integer} template_id Id of the template in DB
* @param {Integer} id_replay Id of the replay to be made
*/
var ge = module.exports = function (id, client, template,template_id, id_replay) {

    

	console.log("Base template:");
	console.log(template);
	console.log("Populating....");
	console.log("replay_id " + id_replay); 


	if(!template.map.nodes) return "No nodes in template!";
	if(!template.map.zones) return "No zones in template!";
	if(!template.players) return "No nodes in template!";
	if(!template.events) return "No events in template!";
	if(!template.info_cards) return "No info cards in template!";


	//Clients
	this.clients = [client];

	//Game related
	this.info_cards = template.info_cards || [];
	this.events = template.events || [];
	this.settings = template.settings || {};
	this.template_id = template_id || 0;

    //Replay
    this.state_id = -1;
	this.replay_id = id_replay;

	//Map
	this.map = {nodes : [], zones : []};


	for(var i = 0;i<template.map.nodes.length; i++){
		this.map.nodes.push(new ge.Node(template.map.nodes[i]));
	}
	for(var i = 0;i<template.map.zones.length; i++){
		var tzone = template.map.zones[i];
		this.map.zones.push(new ge.Zone(tzone));
	}

	//Players

	this.players = [];
	var player;
	var len = template.players.length;

    for(var i = 0; i < len; i++){
		var tplayer = template.players[i]
		player = new ge.Player(tplayer.id, tplayer.user, tplayer.node , tplayer.color, tplayer.role, tplayer.actions_left);

		player.info_cards.push(this.info_cards[Math.floor((Math.random()*(this.info_cards.length-1)))]);
    	
    	//First player gets one extra card
		if(i === 0){
			player.info_cards.push(this.info_cards[Math.floor((Math.random()*(this.info_cards.length-1)))]);
		}
    	this.players.push(player);
    }


	//Server related
	this.id = id || 0;

	//Local game related
	this.active_player = 0;
	this.turn = 0;
	this.time_step = 20;
	this.timer_dur = 20;
    this.information_centers = 0;
    this.road_blocks = 0;
    this.max_information_centers = 5;
    this.max_road_blocks = 10;
	this.cards_left = 10;
	this.eventTurns = 3;
	this.turnsSinceEvent = 0;
	this.eventblocked = false;
	this.started=false;
	this.ended=false;
	this.used_info_card = false;

	//Local
	var SCALE= 90;
	var PADD = 50;

    //TODO Import from template	
    this.events = template.events || [];
                
                
	console.log("Finished populating engine object.");
}//END Engine init
    
    




/**
* Handles all in game commands received
* from the clients
*
* @method Command
* @param {Object} client The socket.io client sending command
* @param {Object} c Command object containing instructions
*/
ge.prototype.command = function(client, c){
	this.state_id++;

	if(this.ended) return;

    var nodes = this.map.nodes,
		zones = this.map.zones,
        players = this.players,
        changed = {none:true};

    

    switch (c.type) {
        case 'move_player':
            if (c.player_id === this.active_player) {
                var p = players[c.player_id];
		    	if(p.move_player(this,nodes[p.node], nodes[c.node_id])){changed.players = [p];}
            }
            //must send player object even if not moved, to paint it correctly, apparently
            changed.players = [p];
            break;
            
  		case 'select_node':
  			var n = c.node_id,
  				options = [],
  				p = players[this.active_player];
  				if(nodes[n].can_add_information_center(this,p)) {
  					options.push('info');
  				}
  				if (nodes[n].can_add_road_block(this,p, players)) {
  					options.push('block');
  				}
  				if (nodes[n].can_remove_road_block(this,p, players)) {
  					options.push('rem_block');
  				}
  			changed.options = options;
  			this.emit("error", "none");
  			
  			break;
  			
  		case 'select_zone':
  			var z = zones[c.zone_id],
  				options = [],
  				p = players[this.active_player];
  			if(z.can_move_people_from(this,p, 5)) {
				options.push('people');
  			}
  			if(z.can_dec_panic(this,p,nodes[p.node])){
  				options.push('panic');
  			}
  			changed.options = options;
  			this.emit("error", "none");
  			break;
  
  
		case 'decrease_panic':
			console.log("Trying to decrease panic in zone: " + c.zone_id);
            
            var z = zones[c.selected_zone],
                p = players[this.active_player]
            
            if (z.dec_panic(this,p, nodes[p.node])){
                changed.zones = [z];
                changed.players = [p];
            }

			break;



		case 'move_people':
			// TODO: find out how many people we can move, driver can move 10, regulars can only move 5
			var movePeople = 5;
			if (players[this.active_player].role=="driver"){
				movePeople = 10;}
			console.log([players[this.active_player]].role+" is trying to move "+movePeople+" people from zone: " + c.zone_from+
				"to zone: " + c.zone_to);
			//see if roads are blocked or not
			for (var i = 0; i < zones[c.zone_from].nodes.length; i++){
				//if one node is unblocked, can move people
				if (zones[c.zone_to].nodes.indexOf(zones[c.zone_from].nodes[i])>-1&&(!nodes[zones[c.zone_from].nodes[i]].has_road_block)){
					if (zones[c.zone_from].move_people(this,players[this.active_player], zones[c.zone_to], movePeople)) {
						changed.zones=[zones[c.zone_to], zones[c.zone_from]];
						changed.players = [players[this.active_player]];
						break;
					}
				}
			}

			break;


			//TODO Finish this
		case 'create_info_center':

			var p = players[this.active_player],
				n = nodes[c.selected_node];

			if(
				this.information_centers < this.max_information_centers
				&& p.node === n.id 
				&& n.add_information_center(this,p)){

				changed.nodes = [n];
				changed.players = [p];
				this.information_centers++;
			}
			break;

			//TODO finish this
		case 'create_road_block':

			var p = players[this.active_player];

			
			if((c.selected_node===p.node) && (this.road_blocks < this.max_road_blocks) && nodes[p.node].add_road_block(this,p, players)){

				for (var i=0; i<zones.length; i++){
					if ((!zones[i].isBlocked)&&((zones[i].nodes.indexOf(nodes[p.node].id))>=0)){
						var allBlocked=true;
						console.log("Going in zone"+i+":");
						for (var j=0; j<zones[i].nodes.length; j++){
							console.log("Node"+j+" blocked? "+nodes[zones[i].nodes[j]].has_road_block);
							if (!nodes[zones[i].nodes[j]].has_road_block){
								allBlocked=false;
								break;
							}

						}
						console.log("allBlocked:"+allBlocked);
						if (allBlocked){
							zones[i].isBlocked=true;
							console.log("in AllBlocked:"+zones[i].isBlocked);
						}
					}
				}
				changed.nodes = [nodes[p.node]];
				changed.players = [p];

				this.road_blocks++;
				for (var i=0; i<zones.length; i++){
					console.log("Zone "+i+" blocked? "+zones[i].isBlocked);
				}
			}

			break;

		case 'remove_road_block':

			var p = players[this.active_player];

			if(nodes[p.node].remove_road_block(this,p, players)){
				changed.nodes = [nodes[p.node]];
				changed.players = [p];
				this.road_blocks--;
			}
			//change isBlocked to false if needed
			for (var i=0; i<zones.length; i++){
				if ((zones[i].isBlocked)&&((zones[i].nodes.indexOf(nodes[p.node].id))>=0)){
					zones[i].isBlocked=false;
				}
			}

			for (var i=0; i<zones.length; i++){
				console.log("Zone "+i+" blocked? "+zones[i].isBlocked);
			}

			break;		



		case 'use_card':
			if(!this.used_info_card || client.is_gm){
				var ic = players[this.active_player].info_cards.splice(c.card,1)[0];
				changed = effect(ic, this);
		        changed.players = changed.players ? changed.players.push(players[this.active_player]) :  [players[this.active_player]];
		        if(!client.is_gm) this.used_info_card = true;
            }
			break;


	    case 'inc_panic':
	        for (var i = 0; i < zones.length;i++) {
	        	//update zones with 10 panic
	        	if (!zones[i].is_panic_zero()){

	        		if (zones[i].people<=10){

					
						
	        			zones[i].update_panic(this,10);
					}
	        		else if (zones[i].people<=50){
					
						
	        			zones[i].update_panic(this,15);
					}
	        		else {
						
	        			zones[i].update_panic(this,20);

					}
				}
	        }


	        this.timer_dur += this.time_step;
	        this.start_timer();

	        for (var i = 0; i < zones.length;i++) {
	        	//if zones has 50 panic, spread to adjacent zones
	        	if (zones[i].panic_level==50&&(!zones[i].isBlocked)){
	        		for (var j = 0; j < zones[i].adjacent_zones.length; j++){
	        			zones[zones[i].adjacent_zones[j]].update_panic(this,5);
	        		}
	        	}

	        }

	        changed.timer = this.timer;
	        changed.zones = zones;

	        break;



		case 'end_turn':



			this.used_info_card=false;
		    var ap = players[this.active_player];
            ap.actions_left = ap.role === 'activist' ?  5 : 4;
            
			this.turn++;
			this.turnsSinceEvent++;
			this.active_player = this.active_player >= this.players.length-1 ?  0 : this.active_player+1;

            ap = players[this.active_player];
            //TODO Add random info cards
			this.emit('msg', "Cards left: "+this.cards_left);
			if(this.cards_left > 0){
				ap.info_cards.push(this.info_cards[Math.floor((Math.random()*(this.info_cards.length-1)))]);
				this.cards_left -= 1;
			}



			//fire a random event every Xth turn
			if (this.turnsSinceEvent>=this.eventTurns){

				if (this.eventblocked){
				this.eventblocked = false;
				this.turnsSinceEvent=0;
				}

				else{
				var randomEvent=Math.floor(Math.random()*this.events.length);
				changed = effect(this.events[randomEvent], this);
				changed.event = this.events[randomEvent];			
				this.turnsSinceEvent=0;
				}
			}
			changed.players = [ap];
			changed.turn = this.turn;
			changed.active_player = this.active_player;

				break;
        
        console.log("No matching command types");
    }

    //Check for win
    changed.win = this.check_win();
    
    //Check for lose
    changed.lose = this.check_lose();
    
    if(changed.lose || changed.win) this.ended = true;
    
    if(changed.players || changed.nodes || changed.zones || changed.turn || changed.event || changed.win || changed.lose){
        changed.none = false;
    }
    
    console.log("");
    console.log("Sending:");
    if (c.type === "inc_panic"){
        console.log("Updating Panic");
    }
    else {
        console.log(changed);
    }
    var stringed = JSON.stringify(changed);
    this.emit('change', stringed);	
    
}

/**
* Starts a game if not already started, and sends the
* state to client
*
* @method start
* @param {Object} client The socket.io client starting the game
*/
ge.prototype.start = function(client){
    var g = state(this);
    console.log("Sending start state to client "+this.clients[0].userid);
    
    g.userid = this.clients[0].userid;
    if(!this.started){
    	this.start_timer();
    	this.started=true;
    }
    if(client){
    	client.emit('start_game', JSON.stringify(g));
    }
    else{
    	this.emit('start_game', JSON.stringify(g));
    }
}

/**
* Stops the timer and deletes the game
*
* @method delete_game
* @param {Object} client The socket.io client deleting the game
*/
ge.prototype.delete_game = function(client) {
	this.ended = true;
	this.stop_timer();
	delete this;
}

/**
* Adds a client to the client list,
* usually an expert.
*
* @method join_game
* @param {Object} client The socket.io client joining the game
*/
ge.prototype.join_game = function(client) {
	if (this.clients.indexOf(client) < 0){
		this.clients.push(client);
	}
	else{
		this.clients[this.clients.indexOf(client)] = client;
	}
	this.start(client);
}

/**
* Sends data to all connected clients.
*
* @method emit
* @param {String} type Type of data sent
* @param {Object} o Data sent
*/
ge.prototype.emit = function(type, o){
	for(var i = 0; i < this.clients.length; i++){
		this.clients[i].emit(type, o);
	}
}

/**
* Returns the current state of the game.
*
* @method state
*/
ge.prototype.state = function(){
	var g = this;
    return {
        type : 'state',
		replay_id : g.replay_id,
		command_id : g.command_id,
        zones : g.map.zones,
        nodes : g.map.nodes,
        players : g.players,
        turn : g.turn,
        timer : g.timer,
        active_player : g.active_player
    };
}

/**
* Changes the active player to the next player in line
*
* @method next_player
*/
ge.prototype.next_player = function() {
	this.active_player.set_actions_left(4);
	this.active_player = this.players[(this.turn-1) % this.players-length];
}

/**
* Checks if the game instance has given client connected to it
*
* @method has_client
* @param {Integer} clientid Id of the client
*/
ge.prototype.has_client = function(clientid){
	for (var i = 0; i<this.clients.length; i++){
		if (this.clients[i].userid === clientid) return true;
	}
	return false;
}

/**
* Starts the in game timer for increasing panic.
* Uses the local timer_dur to initialize on.
*
* @method start_timer
*/
ge.prototype.start_timer = function() {	
	var that = this;
    that.timer = that.timer_dur;
    
    if(!this.ended){
    var inter = setInterval(function(){
        
        that.timer--;
        if (that.timer === -1) {
            that.command("", {type:'inc_panic'});
            clearInterval(inter);
        }
        
        that.emit('change', JSON.stringify({timer:that.timer}));
    }, 1000);
    }
}

/**
* Stops active timer.
*
* @method stop_timer
*/
ge.prototype.stop_timer = function(){
	clearInterval(this.inter);

}

/**
* Checks zones for panic, won if no panic is found.
*
* @method check_win
*/
ge.prototype.check_win = function(){
	var zones = this.map.zones;
	for(var i = 0; i < zones.length; i++){
		if(zones[i].panic_level > 0){
			return false;
		}
	}
	return true;
}

/**
* Checks for zones without max panic, if none found, game is lost.
*
* @method check_lose
*/
ge.prototype.check_lose = function(){
	var zones = this.map.zones;
	console.log("Checking lose..");
	for(var i = 0; i < zones.length; i++){
		console.log("Zone "+i+": "+zones[i].panic_level);
		if(zones[i].panic_level < 50){
			return false;
		}
	}
	console.log("All zones over 50 panic, lost");
	return true;
}

/**
* Interprets info- and event cards, and executes their effects
*
* @method effects
* @param {Object} card The card to be executed
* @param {Object} g The current game instance
*/
function effect(card, g) {
    var effects = card.effects,
        e, i, z, p,
        zones = g.map.zones,
        nodes = g.map.nodes,
        players = g.players,
        changed = {};
        
      
     
    console.log("Executing card");
    console.log(card);
    console.log("Desc:");
    console.log(card.desc);
    console.log("Effects:");
    console.log(card.effects);

    for (i = 0; i<effects.length; i++){
        e = effects[i];
        console.log("Effect nr "+i);
        console.log(e);
        switch(e.domain){
            case 'zone':
                changed.zones = [];
                if(typeof e.affects === 'string'){
                	var afflicted = e.affects;
                	e.affects = [];
                	for (z = 0; z<zones.length; z++){
                		if (zones[z].type === afflicted){
                			e.affects.push(z);
                		}
                	}
                }
                switch(e.type){
                    case 'panic':
                        for (z = 0; z<e.affects.length; z++){
                            zones[e.affects[z]].update_panic(g,e.panic);
                            changed.zones.push(zones[e.affects[z]]);
                        }
                        break;
                        
                    case 'event':
                    	var infoCenter=false;
                    	for (z = 0; z<e.affects.length; z++){
                    		for (var n=0; n<zones[e.affects[z]].nodes.length; n++){
                    			var checkZone = zones[e.affects[z]];
                    			var checkNode = nodes[checkZone.nodes[n]];
                    			if (checkNode.has_information_center){
                    				
                    				infoCenter=true;
                    			}
                    		}
                    		if (infoCenter){
                    			console.log("LOL INFO");
                    			zones[e.affects[z]].update_panic(g,round5((e.panic)/2));
                    			changed.zones.push(zones[e.affects[z]]);
                    		}
                    		else{
                    			console.log("LOL NOINFO");
                    			zones[e.affects[z]].update_panic(g,e.panic);
                    			changed.zones.push(zones[e.affects[z]]);
                    		}
                    		infoCenter=false;
                        }
                        break;

                        
                   	}
            
            
            
                break;
            case 'player':
                changed.players = [];
                switch(e.type){
                    case 'actions':
                        for (p = 0; p < e.affects.length; p++){
                            players[e.affects[p]].update_actions(g,e.actions);
                            changed.players.push(players[e.affects[p]]);
                        }
                        break;
                    case '':
                        
                        break;

					//The player gets his moves decreased. apal; active player actions left


						//The player must skip a turn
					case 'nextplayer':

						var objectsas = {
							type : 'end_turn',
							domain : 'something'
							};
						g.command(g.client, objectsas);



					break;

						//Active player steals an action from the next player
					case 'stealaction':

						var apsa = players[g.active_player]; 
						apsa.actions_left = apsa.actions_left +1;
						players[(g.active_player + 1) % (g.players.length)].actions_left -=1;

						break;
					/*	
					//TODO This code was a proposal for tradecards
					case 'tradecards':
						var playercard = players[(g.active_player)].info_cards[0];
						players[(g.active_player)].info_cards[0] = players[(g.active_player + 1) % (g.players.length)].info_cards[0];
						players[(g.active_player + 1) % (g.players.length)].info_cards[0] = playercard;
						
						changed.players.push(players);
						break;
					*/
					//TODO	
					case 'moveanotherplayer':
						break;

					//TODO
					case 'blocknextevent':
						g.eventblocked =true;



						break;
                }
            
            
            
                break;
        }
        
        
    }//end effect list for
    
    return changed;
}//end effect()



//----------------------------
//-----UTILITY FUNCTIONS------
//----------------------------


/**
* @class none
*/

/**
* Returns the state of the game instance provided
*
* @method state
* @param {Object} g A game instance
*/
function state(g){
    return {
        type : 'state',
		replay_id : g.replay_id,
		command_id : g.command_id,
        zones : g.map.zones,
        nodes : g.map.nodes,
        players : g.players,
        turn : g.turn,
        timer : g.timer,
        active_player : g.active_player
    };
}


/**
* An empty game State
*
* @method empty_state
* @param {Object} g A game instance
*/
function empty_state(g){
    return {
        type : 'none',
        zones : [],
        nodes : [],
        players : []
    };
}


/**
* Rounds an int to nearest 5
*
* @method round5
* @param {Integer} x Integer to be rounded
*/
function round5(x)
{
    return (x % 5) >= 2.5 ? parseInt(x / 5) * 5 + 5 : parseInt(x / 5) * 5;
}





//----------------------------
//---------MODELS-------------
//----------------------------



/**
* The class containing all funcitons and variables 
* associated with an in-game player
*
* @class Player
* @constructor
*/
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
/**
* Updates the action points of a player
*
* @method update_actions
* @param {Integer} actions Number of actions to change
*/
ge.Player.prototype.update_actions = function (g,actions) {
	var able = this.can_update_actions(g,actions);
	if (able) {
	    this.actions_left += actions;
	    console.log("Changed player actions by "+actions);
	    return true
	}
    return false;
}
/**
* Checks if action points chan be changed
*
* @method can_update_actions
* @param {Integer} actions Number of actions to change
*/
ge.Player.prototype.can_update_actions = function (g,actions) {

	var result_action = this.actions_left + actions;
	if (result_action < 0) {
		g.emit("error", "player-lacks-action");
	    return false;
	}
    return true;
}
/**
* Removes info card from player
*
* @method remove_info_card
* @param {Object} info_card The info card to be removed
*/
ge.Player.prototype.remove_info_card = function(g,info_card) {
	for (var i = 0; i < this.info_cards.length; i++) {
		if (this.info_cards[i] === info_card) {
			this.info_cards.splice(i, 1);
		}
	}
}
/**
* Adds an info card to player
*
* @method add_info_card
* @param {Object} info_card Info card to be added
*/
ge.Player.prototype.add_info_card = function(g,info_card) {
	this.info_cards.push(info_card);
}
/**
* Moves a player
*
* @method move_player
* @param {Integer} node_from Node to move from
* @param {Integer} node_to Node to move to
*/
ge.Player.prototype.move_player = function (g,node_from, node_to) {
	var able = this.can_move_player(g,node_from, node_to);
	if (able) {
	    this.update_actions(g,-1);
	    this.node = node_to.id;
	    return true;
	}
	return false;
}
/**
* Checks if player can be moved
*
* @method can_move_player
* @param {Integer} node_from Node to move from
* @param {Integer} node_to Node to move to
*/
ge.Player.prototype.can_move_player = function (g,node_from, node_to) {
	console.log("Can move player?");
	if (node_from === node_to) {
	    g.emit("error", "move-same");
		return false;
	} 
	else if (node_from.connects_with(node_to)) {
		if (this.can_update_actions(g,-1)){
			console.log("True");
		    return true;
		}
		else{
			g.emit("error", "player-lacks-action");
		}
		return false;
	}
	g.emit("error", "node-not-conn");
	return false;
}



/**
* The class containing all funcitons and variables 
* associated with an in-game node
*
* @class Node
* @constructor
*/
ge.Node = function (n) {
	this.id = n.id;
	this.x = n.x;
	this.y = n.y;
	this.is_start_position = n.is_start_position;
	this.connects_to = n.connects_to; // Nodes
	this.has_information_center = false;
	this.has_road_block = false;

}
/**
* Adds an information center to the node
*
* @method add_information_center
* @param {Player} player Player to decrease panic on
*/
ge.Node.prototype.add_information_center = function (g,player) {
	console.log("IN ADD: "+player.node);
	var able = this.can_add_information_center(g, player);
	if (able){
		this.has_information_center = true;
		player.update_actions(g,-4);
		return true;
	}
	return false;
}
/**
* Checks if information center can be added to node
*
* @method can_add_information_center
* @param {Player} player Player to decrease panic on
*/
ge.Node.prototype.can_add_information_center = function (g,player) {
	console.log("Can add info center?");
	console.log("IN CAN: "+player.node);
	if (this.has_information_center) {
		g.emit("error", "has-info");
		return false;
	}
	if(this.id !== player.node){
		g.emit("error", "player-not-node");
		return false;
	}

	
    if(player.can_update_actions(g,-4) ){

    	console.log("True");
		return true;
    }
    return false;
}

/**
* Adds a road block to the node
*
* @method add_road_block
* @param {Player} player Player to decrease panic on
* @param {List} players All players, to check if two are on the node
*/
ge.Node.prototype.add_road_block = function (g,player, players) {
	var able = this.can_add_road_block(g,player, players);
	if (able){
		this.has_road_block = true;
		player.update_actions(g,-1);
		return true;
	}
	return false;	

}
/**
* Checks if road block can be added
*
* @method can_add_road_block
* @param {Player} player Player to decrease panic on
* @param {List} players All players, to check if two are on the node
*/
ge.Node.prototype.can_add_road_block = function (g,player, players) {
	console.log("Can add road block?");

	if (player.node!=this.id){
		return false;
	}
	if (this.has_road_block) {
		g.emit("error", "node-has-rb");
	    return false;
	}

	if (!(player.role=='operation expert')){
		var another_player = false;
		for (var i = 0; i < players.length; i++) {
			if ((players[i].node===player.node)&&(!(i===player.id))) {
				another_player = true;
			}
		}
		if (!another_player){
			g.emit("error", "need-player-node");
			return false
		}
	}

	if(player.can_update_actions(g,-1) ){
		console.log("True");
		return true;
	}

	return false;	

}
/**
* Removes a road block to the node
*
* @method remove_road_block
* @param {Player} player Player to decrease panic on
* @param {List} players All players, to check if two are on the node
*/
ge.Node.prototype.remove_road_block = function (g,player, players) {
	var able = this.can_remove_road_block(g,player, players);
	if (able){
		this.has_road_block = false;
		player.update_actions(g,-1);
		return true;
	}
	return false;
}
/**
* Checks if road block can be removed
*
* @method can_remove_road_block
* @param {Player} player Player to decrease panic on
* @param {List} players All players, to check if two are on the node
*/
ge.Node.prototype.can_remove_road_block = function (g,player, players) {
	console.log("Can remove road block?");
	if (!this.has_road_block) {
		g.emit("error", "no-rb");
	    return false;
	}

	if (!(player.role=='operation expert')){
		var another_player = false;
		for (var i = 0; i < players.length; i++) {
			if ((players[i].node===player.node)&&(!(i===player.id))) {
				another_player = true;
			}
		}
		if (!another_player){
			g.emit("error", "need-player-node");
			return false
		}
	}

	if(player.can_update_actions(g,-1) ){
		console.log("Can remove road block");
		return true;
	}
	return false;	
}
/**
* Checks if node connects with given node
*
* @method connects_with
* @param {Integer} n Node
*/
ge.Node.prototype.connects_with = function(n){
    return this.connects_to.indexOf(n.id) > -1;
}








/**
* The class containing all funcitons and variables 
* associated with an in-game role
*
* @class Role
* @constructor
*/
ge.Role = function (title, info, effect) {
	this.title = title;
	this.info = info;
	this.effect = effect;
}


/**
* The class containing all funcitons and variables 
* associated with an in-game event
*
* @class Event
* @constructor
*/
ge.Event = function (text, effect) {
	this.text = text;
	this.effect = effect;

}









/**
* The class containing all funcitons and variables 
* associated with an in-game Zone
*
* @class Zone
* @constructor
*/
ge.Zone = function (z) {
	this.id = z.id;
	this.type = z.type;
	this.people = z.people;
	this.nodes = z.nodes;
	this.adjacent_zones = z.adjacent_zones;
	this.panic_level = parseInt(z.panic_level);//settes til 0 i starten??
	this.centroid = z.centroid;//center (centroid) X and Y of zone polygon to put panic info
	this.isBlocked = false; //if all nodes of zone are blocked, then zone is blocked from spreading panic

}
/**
* Updates panic in the zone
*
* @method update_panic
* @param {Integer} panic_level Change in panic
*/
ge.Zone.prototype.update_panic = function (g,panic_level) {
	this.panic_level += panic_level;		
	if (this.panic_level >= 50) {
		this.panic_level = 50;
	} 
	else if (this.panic_level < 0) {
		this.panic_level = 0;
	}
}
/**
* Checks if panic is zero
*
* @method is_panic_zero
*/
ge.Zone.prototype.is_panic_zero = function () {
	return this.panic_level === 0 ?  true : false;
}
/**
* Returns the panic in the zone
*
* @method get_panic_level
*/
ge.Zone.prototype.get_panic_level = function () {
	return this.panic_level;
}
/**
* Player decreases panic
*
* @method dec_panic
* @param {Player} player The player decreasing panic
* @param {Node} node The node the player is on
*/
ge.Zone.prototype.dec_panic = function(g,player, node) {
	var able = this.can_dec_panic(g,player, node);
	if(able){
		if(player.role === 'crowd manager'){
			this.update_panic(g,-10);
		}
		else{
			this.update_panic(g,-5);
		}
		player.update_actions(g,-1);
		return true;
	}
	return false;
}
/**
* Checks if decreasing panic is possible
*
* @method can_dec_panic
* @param {Player} player The player decreasing panic
* @param {Node} node The node the player is on
*/
ge.Zone.prototype.can_dec_panic = function(g,player, node) {
	console.log("Can decrease panic?");
	if (this.nodes.indexOf(node.id) >= 0) {
		if(this.panic_level >= 5){

			if(player.can_update_actions(g,-1)){
				console.log("True");
				return true;
			}
		}
		else{
			g.emit("error", "panic-too-low");
		}
	}
	else{
		g.emit("error", "not-adj-node");
	}
	return false;
}

/**
* Moves peopple from one zone to another
*
* @method move_people
* @param {Player} p The player moving people
* @param {Zone} z The Zone to move people to
* @param {Integer} num Number of people to move
*/
ge.Zone.prototype.move_people = function (g, p, to_zone, num) {
	var peopleMoved = this.can_move_people(g,p, to_zone, num);
	if(peopleMoved==5||peopleMoved==10){
		this.people -= peopleMoved;
		to_zone.people += peopleMoved;
		p.update_actions(g,-1);
		return true;
	}
	return false;
}
/**
* Checks if moving people is possible
*
* @method can_move_people
* @param {Player} p The player moving people
* @param {Zone} z The Zone to move people to
* @param {Integer} num Number of people to move
*/
ge.Zone.prototype.can_move_people = function (g, p, to_zone, num) {
	console.log("Can move people?");
	//if driver wants to move 5, but there is only 5, change driver's move-variable to 5
	if (this.people==5)
		num=5;
	if (this.people >= num){
		//player can only move to adjacent zones
		if(this.adjacent_zones.indexOf(to_zone.id)>=0 ){
			if(p.can_update_actions(g,-1)) {
				console.log("True");
				return num;
			}

		}
		else{
			g.emit("error", "player-not-adj");
		}
	}
	else {
		g.emit("error", "not-enough-people");
	}
	return 0;
}
/**
* Checks if moving people from this zone is possible
*
* @method can_move_people_from
* @param {Player} p The player moving people
* @param {Integer} num Number of people to move
*/
ge.Zone.prototype.can_move_people_from = function (g, p, num){
	if (this.people==5)
		num=5;
	if (this.people >= num){
		if(this.nodes.indexOf(p.node)>=0 ){
			if(p.can_update_actions(g,-1)) {
				console.log("True");
				return true;
			}
		}
		else{
			g.emit("error", "player-not-adj");
		}
	}
	else{
		g.emit("error", "not-enough-people");
	}
	return false;
}





/**
* The class containing all funcitons and variables 
* associated with an in-game info card
*
* @class Info Card
* @constructor
*/
ge.Info_card = function (text, id, value) {
	this.text = text;
	this.id = id;
	this.value = value;
}






/**
* The class containing all funcitons and variables 
* associated with an in-game map
*
* @class Map
* @constructor
*/
ge.Map = function (nodes, zones) {
	this.nodes = nodes;
	this.zones = zones;
}





/**
* Contains settings for a game
*
* @class Settings
* @constructor
*/
ge.Settings = function (timer_interval) {
	var timer = new timer(timer_interval);
}





