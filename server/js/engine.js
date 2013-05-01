/**  Engine module

    This module will be a game "Class".
    It is an instance of a game, and handles all game related logic.
    
    id			Integer				Game id from the server
    client		socket.io client	The client that created the game
    template	Object				Contains the map, players and settings configured as a template by an expert
*/
var ge = module.exports = function (id, client, template,template_id, id_replay) {



	console.log("Base template:");
	console.log(template);
	console.log("Populating....");
	console.log("replay_id " + id_replay); 

	
	//Clients
	this.clients = [client];

	//Game related
	this.info_cards = template.info_cards || [];
	this.events = template.events || [];
	this.settings = template.settings || {};
	this.template_id = template_id || 0;


	
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
		this.map.zones.push(new ge.Zone(tzone));
	}
	
	//Players

	this.players = [];
	var player;
	var len = template.players.length;
	
	this.command_id = 0;
	this.replay_id = id_replay;
	
    for(var i = 0; i < len; i++){
		var tplayer = template.players[i]
		player = new ge.Player(tplayer.id, tplayer.user, tplayer.node , tplayer.color, tplayer.role, tplayer.actions_left);
    	

		player.info_cards.push(this.info_cards[Math.floor((Math.random()*(this.info_cards.length-1)))]);

    	
    	//First player gets one extra
		if(i === 0){
			player.info_cards.push(this.info_cards[Math.floor((Math.random()*(this.info_cards.length-1)))]);
		}

		
    	this.players.push(player);
    }
	
	
	//Server related
	this.client = client || null;  //TODO DEPRECATED
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
	
	//Local
	var SCALE= 90;
	var PADD = 50;

    //TODO Import from template	
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
                    	name:"Anthrax has been spread on an undergroud!\nPanic increased by 10 in all financial districts",
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
                    }/*,
					{   id:2,
                    	name:"WTF, DID THAT JUST HAPPEN?!",
                    	effects: [{
                    		domain:'player',
                    		type:'blocknextevent'
                    		},]
							
                    },*/

            ];
                
                
	console.log("Finished populating engine object.");
}//END Engine init
    
    




/*  Decode command

    Executes in-game commands.
*/
ge.prototype.command = function(client, c){
	this.command_id++;
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
            //must send player object even if not moved, to paint it correctly, apparently
            changed.players = [p];
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
				this.emit('error', 'Could not decrease panic');
				break;
			}
					
			break;
			
			
			
		case 'move_people':
			// TODO: find out how many people we can move, driver can move 10, regulars can only move 5
			console.log("Trying to move people from zone: " + c.zone_from+
				"to zone: " + c.zone_to);
			//see if roads are blocked or not
			for (var i = 0; i < zones[c.zone_from].nodes.length; i++){
				//if one node is unblocked, can move people
				if (zones[c.zone_to].nodes.indexOf(zones[c.zone_from].nodes[i])>-1&&(!nodes[zones[c.zone_from].nodes[i]].has_road_block)){
					if (zones[c.zone_from].move_people(players[this.active_player], zones[c.zone_to], 5)) {
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
				&& n.add_information_center(p)){
				
				changed.nodes = [n];
				changed.players = [p];
				this.information_centers++;
			}
			break;

			//TODO finish this
		case 'create_road_block':

			var p = players[this.active_player];
			
			if((c.selected_node===p.node) && (this.road_blocks < this.max_road_blocks) && nodes[p.node].add_road_block(p, players)){
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

			if(nodes[p.node].remove_road_block(p, players)){
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
			var ic = players[this.active_player].info_cards.splice(c.card,1)[0];
			changed = effect(ic, this);
            changed.players = changed.players ? changed.players.push(players[this.active_player]) :  [players[this.active_player]];
			break;
			
			
	    case 'inc_panic':
	        for (var i = 0; i < zones.length;i++) {
	        	//update zones with 10 panic
	        	if (!zones[i].is_panic_zero()){
	        		if (zones[i].people<=10)
	        			zones[i].update_panic(10);
	        		else if (zones[i].people<=50)
	        			zones[i].update_panic(15);
	        		else
	        			zones[i].update_panic(20);
				}
	        }
			
			
	        this.timer_dur += this.time_step;
	        this.start_timer();

	        for (var i = 0; i < zones.length;i++) {
	        	//if zones has 50 panic, spread to adjacent zones
	        	if (zones[i].panic_level==50&&(!zones[i].isBlocked)){
	        		for (var j = 0; j < zones[i].adjacent_zones.length; j++){
	        			zones[zones[i].adjacent_zones[j]].update_panic(5);
	        		}
	        	}
	        	
	        }

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
	var stated = state(this);
	this.emit('save_state' , JSON.stringify(stated));
    
    //Check for win
    changed.win = this.check_win();
    
    //Check for lose
    changed.lose = this.check_lose();
    
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




ge.prototype.reconnect_game = function(client, c) {
    
}

ge.prototype.save_state = function(client, c) {

}

ge.prototype.delete_game = function(client, c) {
}

ge.prototype.join_game = function(client) {
	if (this.clients.indexOf(client) < 0){
		this.clients.push(client);
	}
	else{
		this.clients[this.clients.indexOf(client)] = client;
	}
	this.start(client);
}

ge.prototype.emit = function(type, o){
	for(var i = 0; i < this.clients.length; i++){
		this.clients[i].emit(type, o);
	}
}




ge.prototype.next_player = function() {
	this.active_player.set_actions_left(4);
	this.active_player = this.players[(this.turn-1) % this.players-length];
}

ge.prototype.has_client = function(clientid){
	for (var i = 0; i<this.clients.length; i++){
		if (this.clients[i].userid === clientid) return true;
	}
	return false;
}


ge.prototype.start_timer = function() {	
	var that = this;
    that.timer = that.timer_dur;
    
    var inter = setInterval(function(){
        
        that.timer--;
        if (that.timer === -1) {
            that.command("", {type:'inc_panic'});
            clearInterval(inter);
        }
        that.emit('change', JSON.stringify({timer:that.timer}));
    }, 1000);
    
    
}


ge.prototype.check_win = function(){
	var zones = this.map.zones;
	for(var i = 0; i < zones.length; i++){
		if(zones[i].panic_level > 0){
			return false;
		}
	}
	return true;
}

ge.prototype.check_lose = function(){
	var zones = this.map.zones;
	console.log("Checking lose..");
	for(var i = 0; i < zones.length; i++){
		console.log("Zone "+i+": "+zones[i].panic);
		if(zones[i].panic_level < 50){
			return false;
		}
	}
	console.log("All zones over 50 panic, lost");
	return true;
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
						
					//The player gets his moves decreased. apal; active player actions left

					case 'decreasemoves1':
						
						var apal = players[g.active_player];
						apal.actions_left = apal.actions_left -1;
						
						break;
						
						
					case 'decreasemoves2':
						
						var apal = players[g.active_player];
						apal.actions_left = apal.actions_left -2;
						
						break;
						
					case 'decreasemoves3':
						
						var apal = players[g.active_player];
						apal.actions_left = apal.actions_left -3;
						
						break;
						
						//The player must skip a turn
					case 'nextplayer':
					
						var objectsas = {
							type : 'end_turn',
							domain : 'something'
							};
						g.command(g.client, objectsas);
						
						
					
					break;
						
						
						//player actions are increased to 6
					case 'increasemoves':
						
						var apai = players[g.active_player];
						apai.actions_left = apai.actions_left +2;
						
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


//Returns a state object based on the game provided
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


//Returns an empty state
function empty_state(g){
    return {
        type : 'none',
        zones : [],
        nodes : [],
        players : []
    };
}


//Rounds panic to nearest five
function round5(x)
{
    return (x % 5) >= 2.5 ? parseInt(x / 5) * 5 + 5 : parseInt(x / 5) * 5;
}





//----------------------------
//---------MODELS-------------
//----------------------------

/*	Player model

	Contains all information and functions related to an in-game player
	
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
		else{
			console.log("Not enough actions");
		}
		return false;
	}
	console.log("node does not connect");
	return false;
}




/* User model	[TODO Not implemented]

	Contains information related to a user profile.
	Not implemented.
	
*/
ge.User = function (username, password, name, email, is_admin) {
	this.username = username;
	this.password = password;
	this.name = name;
	this.email = email;
	this.is_admin = is_admin;
}







/* Node model

	Contains information related to a node on the map.
	Takes a node created in the expert interface as argument
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
ge.Node.prototype.add_information_center = function (player) {
	var able = this.can_add_information_center(player);
	if (able){
		this.has_information_center = true;
		player.update_actions(-4);
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
		player.update_actions(-1);
		return true;
	}
	return false;	

}
ge.Node.prototype.can_add_road_block = function (player, players) {
	console.log("Can add road block?");

	if (player.node!=this.id){
		return false;
	}
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
	var able = this.can_remove_road_block(player, players);
	if (able){
		this.has_road_block = false;
		player.update_actions(-1);
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








/* Role object

	Contains info and effect related to a role
*/
ge.Role = function (title, info, effect) {
	this.title = title;
	this.info = info;
	this.effect = effect;
}



ge.Event = function (text, effect) {
	this.text = text;
	this.effect = effect;
	
}









/*	Zone object

	
*/
ge.Zone = function (z) {
	this.id = z.id;
	this.type = z.type;
	this.people = z.people;
	this.nodes = z.nodes;
	this.adjacent_zones = z.adjacent_zones;
	this.panic_level = z.panic_level;//settes til 0 i starten??
	this.centroid = z.centroid;//center (centroid) X and Y of zone polygon to put panic info
	this.isBlocked = false; //if all nodes of zone are blocked, then zone is blocked from spreading panic
	
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
			//this.update_panic(player.role.panic)
			this.update_panic(-10);
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
	console.log("There isnt that many people in this zone");
	}
	return false;
	console.log("Can move people?");
	if (this.people >= num){
		if(this.adjacent_zones.indexOf(to_zone.id)>=0 ){
				//1. find common nodes
			console.log("IN? "+this.nodes.length);
			for (var i = 0; i < this.nodes.length; i++){
				console.log("IN!");
				console.log(ge.Map.zones[to_zone].nodes.indexOf(this.nodes[i].id));
				if (ge.zones[to_zone].nodes.indexOf(this.nodes[i])>-1&&(!this.nodes[i].isBlocked)){
					return true;
					//commonNodes.push(this.nodes[i]);
				}
			}
			console.log("Blocked!");

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









