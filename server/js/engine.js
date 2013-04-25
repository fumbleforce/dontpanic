/*  Engine module

    This module will be a game "Class".
*/

var ge = module.exports = function (id, client, template) {


	console.log("Base template:");
	console.log(template);
	
	console.log("Populating....");

	//Game related
	this.info_cards = template.info_cards || [];
	this.events = template.events || [];
	this.settings = template.settings || {};
	
	//Map
	this.map = {nodes : [], zones : []};
	
	if(!template.map.nodes) console.log("No nodes in template!");
	if(!template.map.zones) console.log("No zones in template!");
	if(!template.players) console.log("No nodes in template!");
	
	for(var i = 0;i<template.map.nodes.length; i++){
		this.map.nodes.push(new ge.Node(template.map.nodes[i]));
	}
	for(var i = 0;i<template.map.zones.length; i++){
		var tzone = template.map.zones[i];
		//var zone = new
		
		//id, type, people, nodes, adjacent_zones, panic_level, centroid
		this.map.zones.push(new ge.Zone(tzone));
	}
	console.log("Map:");
	console.log(this.map);
	
	
	
	//Players

	this.players = [];
	var player_colors = ["red","orange","yellow","chartreuse ","green","aqua","blue","purple"];
	var player_role =["crowd manager", "driver", "volunteer", "operation expert", "coordinator","passer by"];
	
	var player;
	
	var len = template.players.length;
    for(var i = 0; i < len; i++){
		var tplayer = template.players[i]
		player = new ge.Player(tplayer.id, tplayer.user, tplayer.node , tplayer.color, tplayer.role, tplayer.actions_left);
    	
		player.info_cards.push(this.info_cards[Math.floor((Math.random()*(this.info_cards.length-1)))]);
    	player.info_cards.push(this.info_cards[Math.floor((Math.random()*(this.info_cards.length-1)))]);
		
    	this.players.push(player);
    }/*
	for(var i = 0;i<template.players.length; i++){
		this.players.push(new ge.Player(template.players[i]));
	}
	console.log("Players:");
	console.log(this.players);
	
	*/
	
	
	
	
	//Server related
	this.client = client || null;
	this.id = id || 0;
	
	//Local game related
	this.active_player = 0;
	this.turn = 0;
	this.timer = 20;
    this.information_centers = 0;
    this.road_blocks = 0;
    this.max_information_centers = 5;
    this.max_road_blocks = 2;
	this.cards_left = 10;
	this.eventTurns = 3;
	this.turnsSinceEvent = 0;
	
	//Local
	var SCALE= 90;
	var PADD = 50;

   /*
    //set centroidX and centroidY for zones
    for (var zon=0; zon<this.map.zones.length; zon++){
    	var xx=0, yy=0;
	    for (var i=0; i<this.map.zones[zon].nodes.length; i++){
	    	xx+=this.map.nodes[zones[zon].nodes[i]].x;
	    	yy+=this.map.nodes[zones[zon].nodes[i]].y;
	    }
    	this.map.zones[zon].centroid=[xx/zones[zon].nodes.length, yy/zones[zon].nodes.length];
    }
    */
    
    

	
    this.events = [
                   {   id:0,
                	   name:"Fire engulfs industrial complex! Workers in all districts gives into panic.\nPanic increased by 20 in all industrial districts",
                	   effects: [{
                		   domain:'zone',
                		   type:'event',
                		   panic:(20),
                		   affects:'industry'
                	   }]
                   },
                    {   id:1,
                    	name:"Power outage in all residential districts!\nPanic increased by 5 in all residential districts",
                    	effects: [{
                    		domain:'zone',
                    		type:'event',
                    		panic:(5),
                    		affects:'residential'
                    	}]
                    },
                     {   id:2,
                    	 name:"Terrorist attack in all finacial districts!\nPanic increased by 10 in all financial districts",
                    	 effects: [{
                    		 domain:'zone',
                    		 type:'event',
                    		 panic:(35),
                    		 affects:[9, 10, 11]
                    	 }]
                     }
					 ,
                    {   id:3,
                    	name:"Power outage in all residential districts\nPanic increased by 10 in all residential districts!",
                    	effects: [{
                    		domain:'zone',
                    		type:'event',
                    		panic:(5),
                    		affects:'residential'
                    	}]
                    } ,
                    {   id:4,
                    	name:"Shouting about an epedemic can be heard.\nPanic increased by 10 in all districts",
                    	effects: [{
                    		domain:'zone',
                    		type:'event',
                    		panic:(10),
                    		affects:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
                    	}]
                    } ,
                    {   id:5,
                    	name:"An explosion has occured!\nPanic increased by 10 in all industry districts",
                    	effects: [{
                    		domain:'zone',
                    		type:'event',
                    		panic:(10),
                    		affects:'industry'
                    	}]
                    } ,
                    {   id:6,
                    	name:"Rabid dogs roam the park!\nPanic increased by 10 in all parks",
                    	effects: [{
                    		domain:'zone',
                    		type:'event',
                    		panic:(10),
                    		affects:'park'
                    	}]
                    } ,
                    {   id:7,
                    	name:"Viable pipe bomb has been found near a school!\nPanic increased by 10 in all residential districts",
                    	effects: [{
                    		domain:'zone',
                    		type:'event',
                    		panic:(10),
                    		affects:'residential'
                    	}]
                    } ,
                    {   id:8,
                    	name:"Gunshots can be heard through a school cooridor!\nPanic increased by 10 in all residential districts",
                    	effects: [{
                    		domain:'zone',
                    		type:'event',
                    		panic:(10),
                    		affects:'residential'
                    	}]
                    },
                    {   id:9,
                    	name:"Antrax has been spread on an undergroud!\nPanic increased by 10 in all financial districts",
                    	effects: [{
                    		domain:'zone',
                    		type:'event',
                    		panic:(10),
                    		affects:'largecity'
                    	}]

                    },
                    {   id:10,
                    	name:"Large occurenses of MRSA Staph Bacteria Infections have been reported!\nPanic increased by 10 in all residential districts",
                    	effects: [{
                    		domain:'zone',
                    		type:'event',
                    		panic:(10),
                    		affects:'residential'
                    	}]
                    },
                    {   id:11,
                    	name:"Gunshots can be heard through a school cooridor!\nPanic increased by 10 in all residential districts",
                    	effects: [{
                    		domain:'zone',
                    		type:'event',
                    		panic:(10),
                    		affects:'residential'
                    	}]
                    }

            ];
                
                
	console.log("Finished populating engine object.");
}//END Engine init
    
    

//round panic by nearest five
function round5(x)
{
    return (x % 5) >= 2.5 ? parseInt(x / 5) * 5 + 5 : parseInt(x / 5) * 5;
}


/*  Decode command

    Executes in-game commands.
*/
ge.prototype.command = function(client, c){
    var nodes = this.map.nodes,
		zones = this.map.zones,
        players = this.players,
        changed = {none:true};
    
	
    switch (c.type) {
        case 'move_player':
            if (c.player_id === this.active_player) {
                var p = players[c.player_id];
		    	if(p.move_player(nodes[p.node], nodes[c.node_id]))
		    		{changed.players = [p];}
            }
            break;
            
  		case 'select_node':
  			var n = c.node_id,
  				options = [],
  				p = players[this.active_player];
  				if(nodes[n].can_add_information_center(p)) {
  					options.push('info');
  				}
  				if (nodes[n].can_add_road_block(p, players)) {
  					options.push('block');
  				}
  				if (nodes[n].can_remove_road_block(p, players)) {
  					options.push('rem_block');
  				}
  			changed.options = options;
  			
  			break;
  			
  		case 'select_zone':
  			var z = zones[c.zone_id],
  				options = [],
  				p = players[this.active_player];
  				
  			if(z.can_move_people_from(p, 5)) {
				options.push('people');
  			}
  			if(z.can_dec_panic(p,nodes[p.node])){
  				options.push('panic');
  			}
  			changed.options = options;
  			break;
  
  
		case 'decrease_panic':
			console.log("Trying to decrease panic in zone: " + c.zone_id);
            
            var z = zones[c.selected_zone],
                p = players[this.active_player]
            
            if (z.dec_panic(p, nodes[p.node])){
                changed.zones = [z];
                changed.players = [p];
            }
			
			else {
				client.emit('error', 'Could not decrease panic');
				break;
			}
					
			break;
			
			
			
		case 'move_people':
			// TODO: find out how many people we can move, driver can move 10, regulars can only move 5
			console.log("Trying to move people from zone: " + c.zone_from+
				"to zone: " + c.zone_to);

			
			if (zones[c.zone_from].move_people(players[this.active_player], zones[c.zone_to], 5)) {
				changed.zones=[zones[c.zone_to], zones[c.zone_from]];
				changed.players = [players[this.active_player]];
			}
			


			break;
			

			//TODO Finish this
		case 'create_info_center':

			var p = players[this.active_player],
				n = nodes[c.selected_node];


			if(
				this.information_centers < this.max_information_centers
				&& p.node === n.id 
				&& n.add_information_center(p)){
				
				changed.nodes = [n];
				changed.players = [p];
				this.information_centers++;
			}
			break;

			//TODO finish this
		case 'create_road_block':

			var p = players[this.active_player];
			
			if((this.road_blocks < this.max_road_blocks) && nodes[p.node].add_road_block(p, players)){
				changed.nodes = [nodes[p.node]];
				changed.players = [p];
				this.road_blocks++;
			}

			break;

		case 'remove_road_block':
			
			var p = players[this.active_player];

			if(nodes[p.node].remove_road_block(p, players)){
				changed.nodes = [nodes[p.node]];
				changed.players = [p];
				this.road_blocks--;
			}

			break;		



		case 'use_card':
			var ic = players[this.active_player].info_cards.splice(c.card,1)[0];
			changed = effect(ic, this);
            changed.players = changed.players ? changed.players.push(players[this.active_player]) :  [players[this.active_player]];
			break;
			
			
	    case 'inc_panic':
	        for (var i = 0; i < zones.length;i++) {
				if (!zones[i].is_panic_zero()){
					zones[i].update_panic(10);
				}
	        }
	        this.timer += 20;
	        
	        changed.timer = this.timer;
	        changed.zones = zones;
	        
	        break;
		
		
		
		case 'end_turn':
		    
		    var ap = players[this.active_player];
            ap.actions_left = ap.role === 'activist' ?  5 : 4;
            
			this.turn++;
			this.turnsSinceEvent++;
			this.active_player = this.active_player >= this.players.length-1 ?  0 : this.active_player+1;

            ap = players[this.active_player];
            //TODO Add random info cards
			client.emit('msg', this.cards_left);
			if(this.cards_left > 0){
				ap.info_cards.push(this.info_cards[Math.floor((Math.random()*(this.info_cards.length-1)))]);
				this.cards_left -= 1;
			}
			

			//fire a random event every Xth turn
			if (this.turnsSinceEvent===this.eventTurns){
			var randomEvent=Math.floor(Math.random()*this.events.length);
			changed = effect(this.events[randomEvent], this);
			changed.event = this.events[randomEvent];
			this.turnsSinceEvent=0;
			}
			
			
			changed.players = [ap];
			changed.turn = this.turn;
			changed.active_player = this.active_player;

			break;
        
        console.log("No matching command types");
            
    }
    
    if(changed.players || changed.nodes || changed.zones || changed.turn || changed.event){
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
    client.emit('change', stringed);	
    
}



ge.prototype.start = function(){
    var g = state(this);
    console.log("Sending start state to client.");
    this.client.emit('start_game', JSON.stringify(g));
}




ge.prototype.reconnect_game = function(client, c) {
    
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
                            zones[e.affects[z]].update_panic(e.panic);
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
                    			zones[e.affects[z]].update_panic(round5((e.panic)/2));
                    			changed.zones.push(zones[e.affects[z]]);
                    		}
                    		else{
                    			console.log("LOL NOINFO");
                    			zones[e.affects[z]].update_panic(e.panic);
                    			changed.zones.push(zones[e.affects[z]]);
                    		}
                    		infoCenter=false;
                        }
                        break;
                        
                   	//The player gets his moves decreased
					case 'decreasemoves1':
						
						var apal = players[this.active_player];
						apal.actions_left = apal.actions_left -1;
						
						break;
						
						
					case 'decreasemoves2':
						
						var apal = players[this.active_player];
						apal.actions_left = apal.actions_left -2;
						
						break;
						
					case 'decreasemoves3':
						
						var apal = players[this.active_player];
						apal.actions_left = apal.actions_left -3;
						
						break;
						
						//The player must skip a turn
					case 'nextplayer':
						game.active_player = ge.players[(game.turn-1) % game.players-length];
						
						break;
						
						//player actions are increased to 6
					case 'increasemoves':
						
						var apai = players[this.active_player];
						apai.actions_left = apai.actions_left +2;
						
						break;
						
						//Active player steals an action from the next player
					case 'stealaction':
					
						var apsa = players[this.active_player]; 
						apsa.actions_left = apsa.actions_left +1;
						//TODO decrease next players actions
						break;
						
					//TODO
					case 'tradecards':
						break;
					
					//TODO	
					case 'moveanotherplayer':
						break;
						
					//TODO
					case 'blocknextevent':
					
						this.eventTurns = 2;
						
						break;
                
                }
            
            
            
                break;
            case 'player':
                changed.players = [];
                switch(e.type){
                    case 'actions':
                        for (p = 0; p < e.affects.length; p++){
                            players[e.affects[p]].update_actions(e.actions);
                            changed.players.push(players[e.affects[p]]);
                        }
                        break;
                    case '':
                        
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
        players : g.players,
        turn : g.turn,
        timer : g.timer,
        active_player : g.active_player
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

ge.Player.prototype.update_actions = function (actions) {
	var able = this.can_update_actions(actions);
	if (able) {
	    this.actions_left += actions;
	    console.log("Changed player actions by "+actions);
	    return true
	}
    return false;
}
ge.Player.prototype.can_update_actions = function (actions) {

	var result_action = this.actions_left + actions;
	if (result_action < 0) {
		console.log("Not enough actions left");
	    return false;
	}
    return true;
}

ge.Player.prototype.remove_info_card = function(info_card) {
	for (var i = 0; i < this.info_cards.length; i++) {
		if (this.info_cards[i] === info_card) {
			this.info_cards.splice(i, 1);
		}
	}
}
ge.Player.prototype.add_info_card = function(info_card) {
	this.info_cards.push(info_card);
}

ge.Player.prototype.move_player = function (node_from, node_to) {
	var able = this.can_move_player(node_from, node_to);
	if (able) {
	    this.update_actions(-1);
	    this.node = node_to.id;
	    return true;
	}
	return false;
}
ge.Player.prototype.can_move_player = function (node_from, node_to) {
	console.log("Can move player?");
	if (node_from === node_to) {
	    console.log("node from and to are same");
		return false;
	} 
	else if (node_from.connects_with(node_to)) {
		if (this.can_update_actions(-1)){
			console.log("True");
		    return true;
		}
		return false;
	}
	console.log("node does not connect");
	return false;
}






ge.User = function (username, password, name, email, is_admin) {
	this.username = username;
	this.password = password;
	this.name = name;
	this.email = email;
	this.is_admin = is_admin;
}








ge.Node = function (n) {
	this.id = n.id;
	this.x = n.x;
	this.y = n.y;
	this.is_start_position = n.is_start_position;
	this.connects_to = n.connects_to; // Nodes
	this.has_information_center = false;
	this.has_road_block = false;

}
ge.Node.prototype.add_information_center = function (player) {
	var able = this.can_add_information_center(player);
	if (able){
		this.has_information_center = true;
		return true;
	}
	return false;
}
ge.Node.prototype.can_add_information_center = function (player) {
	console.log("Can add info center?");
	if (this.has_information_center) {
		console.log("Already has information center");
		return false;
	}
	if(this.id !== player.node){
		console.log("Player is not on node");
		return false;
	}
	
    if(player.can_update_actions(-4) ){
    	console.log("True");
		return true;
    }
    return false;
}


ge.Node.prototype.add_road_block = function (player, players) {
	var able = this.can_add_road_block(player, players);
	if (able){
		this.has_road_block = true;
		return true;
	}
	return false;	

}
ge.Node.prototype.can_add_road_block = function (player, players) {
	console.log("Can add road block?");
	if (this.has_road_block) {
		console.log('error', "Already has road block");
	    return false;
	}
	
	var another_player = false;
	for (var i = 0; i < players.length; i++) {
		if ((players[i].node===player.node)&&(!(i===player.id))) {
			another_player = true;
		}
	}
	if (!another_player){
		console.log("Player "+player+" failed to add road block, no other players on node!");
		return false
	}
	
	if(player.can_update_actions(-1) ){
		console.log("True");
		return true;
	}
	
	return false;	

}

ge.Node.prototype.remove_road_block = function (player, players) {
	var able = this.can_add_road_block(player, players);
	if (able){
		this.has_road_block = false;
		return true;
	}
	return false;
}
ge.Node.prototype.can_remove_road_block = function (player, players) {
	console.log("Can remove road block?");
	if (!this.has_road_block) {
		console.log("No road block at this node");
	    return false;
	}
	
	var another_player = false;
	for (var i = 0; i < players.length; i++) {
		if ((players[i].node===player.node)&&(!(i===player.id))) {
			another_player = true;
		}
	}
	if (!another_player){
		console.log("No other players on node");
		return false
	}
	if(player.can_update_actions(-1) ){
		console.log("Can remove road block");
		return true;
	}
	return false;	
}
ge.Node.prototype.connects_with = function(n){
    return this.connects_to.indexOf(n.id) > -1;
}









ge.Role = function (title, info, effect) {
	this.title = title;
	this.info = info;
	this.effect = effect;
}



ge.Event = function (text, effect) {
	this.text = text;
	this.effect = effect;
}










ge.Zone = function (z) {//(id, type, people, nodes, adjacent_zones, panic_level, centroid) {
	this.id = z.id;
	this.type = z.type;
	this.people = z.people;
	this.nodes = z.nodes;
	this.adjacent_zones = z.adjacent_zones;
	this.panic_level = 0;// z.panic_level;//settes til 0 i starten??
	this.centroid = z.centroid;//center (centroid) X and Y of zone polygon to put panic info
	
}
ge.Zone.prototype.update_panic = function (panic_level) {
	this.panic_level += panic_level;		
	if (this.panic_level >= 50) {
		this.panic_level = 50;
	} 
	else if (this.panic_level < 0) {
		this.panic_level = 0;
	}
}
ge.Zone.prototype.is_panic_zero = function () {
	return this.panic_level === 0 ?  true : false;
}
ge.Zone.prototype.get_panic_level = function () {
	return this.panic_level;
}
ge.Zone.prototype.dec_panic = function(player, node) {
	var able = this.can_dec_panic(player, node);
	if(able){
		if(player.role === 'crowd manager'){
			this.update_panic(player.role.panic)
		}
		else{
			this.update_panic(-5);
		}
		player.update_actions(-1);
		return true;
	}
	return false;
}
ge.Zone.prototype.can_dec_panic = function(player, node) {
	console.log("Can decrease panic?");
	if (this.nodes.indexOf(node.id) >= 0) {
		if(this.panic_level >= 5){

			if(player.can_update_actions(-1)){
				console.log("True");
				return true;
			}
			
		}
		else{
			console.log("Panic is too low");
		}
	}
	else{
		console.log("Not an adjacent node");
	}
	return false;
}


ge.Zone.prototype.move_people = function (p, to_zone, num) {
	var able = this.can_move_people(p, to_zone, num);
	if(able){
		this.people -= num;
		to_zone.people += num;
		p.update_actions(-1);
		return true;
	}
	return false;
}
ge.Zone.prototype.can_move_people = function (p, to_zone, num) {
	console.log("Can move people?");
	if (this.people >= num){
		if(this.adjacent_zones.indexOf(to_zone.id)>=0 ){
			if(p.can_update_actions(-1)) {
				console.log("True");
				return true;
			}
			
		}
		else{
			console.log("Not an adjacent zone");
		}
	}
	else {
		//error 
		console.log("There isnt that many people in this zone");
	}
	return false;
}
ge.Zone.prototype.can_move_people_from = function (p, num){
	console.log("Can move from this zone?");
	if (this.people >= num){
		if(this.nodes.indexOf(p.node)>=0 ){
			if(p.can_update_actions(-1)) {
				console.log("True");
				return true;
			}
		}
		else{
			console.log("Zone is not adjacent to player");
		}
	}
	else{
		console.log("Not enough people in zone");
	}
	return false;
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









