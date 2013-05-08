/**
* Basically the same code as in game.js with some changes and added methods at the end
* All game-related objects and functions are encapsulated 
* in the "gco" (game client object) object, to avoid polluting
* the global namespace. Only one instance of this object is created for each client.
*    
* @module Replay
* @class Replay
**/

//variables for setting size of objects and positioning in drawing functions.

var c_height = 1550,
    c_width = 1500,
    node_size = 50,
    player_size = 20,
    info_center_size = 35,
    offset_distance = node_size*1,
    panic_info_size = 40,
    w_inc = 0,
	    
    //replay holder
    game_states = [],
    //actions counter
    actions = 0;var c_height = 1550,
    c_width = 1500,
    node_size = 50,
    player_size = 20,
    info_center_size = 35,
    offset_distance = node_size*1,
    panic_info_size = 40,
    w_inc = 0,
    
    //replay holder
    game_states = [],
    //actions counter
    actions = 0;
    
	//set images
	var residential_img = new Image();
	residential_img.src = "/img/residential.jpg";
	var park_img = new Image();
	park_img.src = "/img/park.jpg";
	var industry_img = new Image();
	industry_img.src = "/img/industry.jpg";
	var largecity_img = new Image();
	largecity_img.src = "/img/largecity.jpg";
	
	var coordinator_img = new Image();
	coordinator_img.src = "/img/coordinator.png";
	
	var crowd_manager_img = new Image();
	crowd_manager_img.src = "/img/crowd_manager.png";
	
	var driver_img = new Image();
	driver_img.src = "/img/driver.png";
	
	var operation_expert_img = new Image();
	operation_expert_img.src = "/img/operation_expert.png";
	
	var volunteer_img = new Image();
	volunteer_img.src = "/img/volunteer.png";
	
	var passer_by_img = new Image();
	passer_by_img.src = "/img/passer_by.png";
	
	var role_desc = {
	    'coordinator':'info',
	    'passer by':'info',
	    'crowd manager':'info',
	    'operation expert':'info',
	    'driver':'info',

	}
//set offsets for player, to give each player a specific position on nodes	
var player_offsetX = [0, 
                      Math.cos(315*(Math.PI/180))*offset_distance,
                      offset_distance, 
                      Math.cos(45*(Math.PI/180))*offset_distance,
                      0, 
                      Math.cos(225*(Math.PI/180))*offset_distance,
                      -offset_distance, 
                      Math.cos(135*(Math.PI/180))*offset_distance],
    
    player_offsetY = [-offset_distance,
                      Math.sin(315*(Math.PI/180))*offset_distance,
                      0,
                      Math.sin(45*(Math.PI/180))*offset_distance,
                      offset_distance, 
                      Math.sin(135*(Math.PI/180))*offset_distance,
                      0,
                      Math.sin(225*(Math.PI/180))*offset_distance];

var gco = {
    players : [],
    nodes : [],
    zones : [],
    canvas : document.getElementById("viewport"),
    cst : {},
    turn : 0,
    active_player : 0
}
gco.ctx = gco.canvas.getContext("2d");



/**
* Initializes the replay state by populating the Game Client Object,
*
* @method init_game
* @param {Object} d JSON-object with state of the game at the current action 
**/

gco.init_game = function (d) {
    console.log("Replay state displayed.");
	
    gco.players = d.players;
    gco.zones = d.zones;
    gco.nodes = d.nodes;
    gco.turn = d.turn;
    gco.active_player = d.active_player;
    gco.construct_player_divs(gco.players);
    gco.setup_canvas();
    gco.draw();
    gco.update_cards();
    gco.update_options([]);
    translate_page();

}

/**
* Configures the height and width of the canvas according to the settings variables.
* 
* @method setup_canvas
**/
gco.setup_canvas = function(){
    gco.canvas.width = c_width;
    gco.canvas.height = c_height;
    gco.cst.selected_zone = null;
    gco.cst.selected_node = null;
}

/**
* Constructs the divs for the player information boxes
* 
* @method construct_player_divs
* @param {List} players List of all players in the game
**/
gco.construct_player_divs = function(players){
	var $l = $('#left-sidebar'),
		$r = $('#right-sidebar'),
		inner = '',
		i,
		lim1 = 0,
		lim2 = 0;
	if(players.length >4){
		lim1 = 4;
		lim2 = players.length;
	}
	else{
		lim1 = players.length;
		lim2 = 0;
	}
	for(i = 0; i<lim1; i++){
		inner += "<div id='p"+i+"' class='sidebar-player'><h2>Player "+i+"</h2><br><div class='player-info'><p>"+ players[i].role +"</p><div id='"+i+"_text' class='role-info-label'>"+ role_desc[players[i].role] +"</div></div><div id='"+i+"_cards' class='card-container'></div></div>";
	}
	$l.html(inner);
	inner = '';
	for(i=lim1; i<lim2; i++){
		inner += "<div id='p"+i+"' class='sidebar-player'><h2>Player "+i+"</h2><br><div class='player-info'><p>"+ players[i].role +"</p><div id='"+i+"_text' class='role-info-label'>"+ role_desc[players[i].role] +"</div></div><div id='"+i+"_cards' class='card-container'></div></div>";
	}
	$r.html(inner);
}

/**
* Resets the player states
* 
* @method reset
**/
gco.reset = function(){
    /*var p = gco.players[gco.active_player];
    p.x = gco.nodes[p.node].x;
    p.y = gco.nodes[p.node].y;*/
    gco.update_players(gco.players);
}

/**
* Updates whose turn it is
* 
* @method update_turn
* @param {Int} turn Whose turn it is
* @param {Int} ap Which player is the active player
**/
gco.update_turn = function(turn, ap){
    gco.turn = turn;
    gco.active_player = ap;
    gco.cst.selected_zone = null
    gco.cst.selected_node = null
}

/**
* Updates which command buttons are visible for the player
* 
* @method update_options
* @param {List} o List of commands that should be available to the current player
**/

gco.update_options = function(o){
	var $s = $('#selection'),
		inner = '';
		

	
	for (var i=0; i<o.length;i++){
		switch(o[i]){
			case 'block':
				inner += "<button class='btn' onclick='command("+'"'+"create_road_block"+'"'+");'>Add road block</button>";
				break;
			case 'info':
				inner += "<button class='btn' onclick='command("+'"'+"create_info_center"+'"'+");'>Add information center</button>";
				break;
			case 'panic':
				inner += "<button class='btn' onclick='command("+'"'+"decrease_panic"+'"'+");'>Decrease panic</button>";
				break;
			case 'people':
				inner += "<button class='btn' onclick='gco.move_people();'>Move people</button>";
				break;
			case 'rem_block':
				inner += "<button class='btn' onclick='command("+'"'+"remove_road_block"+'"'+");'>Remove road block</button>";
				break;

		}
	}
	$s.html(inner);
}


/**
* Called by the server when a player has been updated with new information. 
* Replaces the local player object with an updated object from the server.
*     
* @method update_player
* @param {Object} p The updated player object.
*/
gco.update_player = function(p){
    gco.players[p.id] = p;
    gco.players[p.id].x = gco.nodes[p.node].x;
    gco.players[p.id].y = gco.nodes[p.node].y;
}
/**
* Called by the server when players have been updated with new information. 
* Replaces the local player objects with updated objects from the server.
*     
* @method update_players
* @param {List} ps List of the updated player objects.
*/
gco.update_players = function(ps){
	var $con;
    for(var i = 0; i < ps.length; i++) {
        gco.update_player(ps[i]);
     
    }
}
/**
* Called by the server when nodes have been updated with new information. 
* Replaces the local node objects with updated objects from the server.
*     
* @method update_nodes
* @param {List} ns List of the updated node objects.
**/
gco.update_nodes = function(ns){
    for(var i = 0; i < ns.length;i++){
        gco.nodes[ns[i].id] = ns[i];
    }
}
/**
* Called by the server when zones have been updated with new information. 
* Replaces the local zone objects with updated objects from the server.
*     
* @method update_zones
* @param {List} zs List of the updated zone objects.
**/
gco.update_zones = function(zs){
    for(var i = 0; i < zs.length;i++){
        gco.zones[zs[i].id] = zs[i];
    }
}
/**
* Called by the server when information cards should be updated on the screen.
* Replaces the information cards on the screen with new cards from the players.
*     
* @method update_cards
**/
gco.update_cards = function() {
    var ps = gco.players,
        $con,
        c,
        i,
        cards,
        button;
        
    console.log("Updating info cards..");
    
    for (i = 0; i < ps.length; i++){
        cards = ps[i].info_cards;

        $con = $("#"+i+"_cards");
        $con.empty();
			if ((cards.length)*110+75 > (parseInt($con.parent().parent().css('width')))) {
				$con.parent().parent().css('width', ''+(parseInt($con.parent().parent().css('width'))+110)+'px');
			}
			
			for (c = cards.length-1; c >= 0; c--){
				button = $("<button id='"+i+"-"+c+"' class='info-card' onclick='gco.info_card_click("+i+","+c+")'>"+cards[c].desc+ "</button>");
				button.appendTo($con);
				
			}
		
    }
}

/**
* Called by the server when the status label should be updated.
* Replaces the information in the status label with new information from the server.
*     
* @method update_status
* @param {String} status The new message to be put in the status label 
**/
gco.update_status = function(status){
	$('#status_label').html(status);
}

/**
* Called by the server when the error label should be updated.
* Replaces the information in the error label with new information from the server.
*     
* @method update_error
* @param {String} error The new message to be put in the error label 
**/
gco.update_error = function(error){
	$('#error_label').html(error);
}
/**
* Called when a user clicks a information card.
* Emits a command to the server, telling it which card was used, then plays an audio file.
*     
* @method info_card_click
* @param {Object} p Which player clicked the card 
* @param {Object} c Which information card was clicked
**/
gco.info_card_click = function(p, c) {
	console.log(p);
	console.log(c);
    if(gco.active_player === p){
		command('use_card', {card:c});
	}
}

/**
* Called when a user has moved people between two zones.
* Sets which zones the player moved people between.
*     
* @method move_people
**/
gco.move_people = function(){
	if(gco.cst.selected_zone !== null){
		gco.update_status("Moving people from zone "+gco.cst.selected_zone+"...");
		gco.cst.moving_people = true;
		gco.cst.moving_from = gco.cst.selected_zone;
	}
}

gco.player_draw = function(player, ctx){
/**
* Draws a player on the canvas.
* 
* @method player_draw
* @param {Object} player The player to be drawn on the canvas
* @param {Object} ctx The context object that provides methods and properties for drawing on the canvas
**/
	ctx.fillStyle = "rgba(255,0,0,0)";
	ctx.save();

	if (!player.x) player.x = gco.nodes[player.node].x;
    if (!player.y) player.y = gco.nodes[player.node].y;
	
	//ctx.fillStyle = player.color;
	
    ctx.beginPath();
    ctx.arc(player.x+player_offsetX[player.id], player.y+player_offsetY[player.id], player_size, 0, Math.PI*7, true); 

    //ctx.fill();
    //TODO draw circle to show active player when dragging/active?
    if (this.active_player===player.id){
    	
		ctx.fill();
    	ctx.strokeStyle = 'red';
    	ctx.lineWidth = 10;
    	ctx.stroke();
		}
		
    ctx.font="bold 15px Arial",
    ctx.fillText(player.id, player.x+player_offsetX[player.id]-5, player.y+player_offsetY[player.id]+6);

	
			//draw the images
	if (player.role==='coordinator'){
		ctx.drawImage(coordinator_img, player.x + player_offsetX[player.id]-24, player.y+player_offsetY[player.id]-24);
	}
	else if (player.role==='crowd manager'){
		ctx.drawImage(crowd_manager_img, player.x + player_offsetX[player.id]-24, player.y+player_offsetY[player.id]-24);
	}
	else if (player.role==='driver'){
		ctx.drawImage(driver_img, player.x + player_offsetX[player.id]-35, player.y+player_offsetY[player.id]-35);
	}
	else if (player.role==='operation expert'){
		ctx.drawImage(operation_expert_img, player.x + player_offsetX[player.id]-24, player.y+player_offsetY[player.id]-24);	
	}	
	else if (player.role==='volunteer'){
		ctx.drawImage(volunteer_img, player.x + player_offsetX[player.id]-24, player.y+player_offsetY[player.id]-24);
	}	
	else if (player.role==='passer by'){
		ctx.drawImage(passer_by_img, player.x + player_offsetX[player.id]-24, player.y+player_offsetY[player.id]-24);
	}
	ctx.closePath();
	ctx.save();
	ctx.clip()
	ctx.fill();
	ctx.restore();
}

/**
* Draws a node on the canvas.
* 
* @method node_draw
* @param {Object} node The node to be drawn on the canvas
* @param {Object} ctx The context object that provides methods and properties for drawing on the canvas
**/
gco.node_draw = function(node, ctx){
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(node.x, node.y, node_size, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();    
    
    ctx.fillStyle = "black";
    ctx.font="15px Arial";
    if(node.id>9){
    	ctx.fillText(node.id, node.x-8, node.y-15);
    }
    else{
    	ctx.fillText(node.id, node.x-4, node.y-15);
    }
    
if (node.has_information_center){
		
		ctx.fillStyle = 'blue';
		ctx.fill();
        //ctx.fillRect(node.x-(info_center_size/2), node.y-(info_center_size/2)+6, info_center_size, info_center_size);
        ctx.fillStyle = 'white';
        ctx.font='50px Georgia',
         //draw i for infocenter, or number for node?
         //
         ctx.fillText("i", node.x-4, node.y+18);
     }
    
}

/**
* Draws a roadblock on the canvas.
* 
* @method roadblock_draw
* @param {Object} node The node to draw the roadblock on
* @param {Object} ctx The context object that provides methods and properties for drawing on the canvas
**/
gco.roadblock_draw = function(node, ctx){
	ctx.strokeStyle = '#202020';
	ctx.lineWidth = 34;
	var nodes = gco.nodes;
	
	for (var i = 0; i < node.connects_to.length; i++){
		ctx.beginPath();
	    ctx.moveTo(node.x, node.y);
	    //TODO maybe: 50% road block to another node with road block (50+50=100), 
	    // but only 10% when neighbor does not have r b (looks better...?)
	    // for now: just draw 50% block
	    //if (nodes[node.connects_to[i]].has_road_block){
	    	ctx.lineTo(((nodes[node.connects_to[i]].x)+node.x)/2, ((nodes[node.connects_to[i]].y)+node.y)/2);
	    //}
	    //else{
	    //	ctx.lineTo(((nodes[node.connects_to[i]].x)+node.x)/10, ((nodes[node.connects_to[i]].y)+node.y)/10);
	    //}
	    
	    ctx.closePath();
	    ctx.stroke();
    }
}

/**
* Resets the canvas, making it visible.
* 
* @method background_draw
* @param {Object} ctx The context object that provides methods and properties for drawing on the canvas
**/
gco.background_draw = function(ctx){
	gco.canvas.width = gco.canvas.width;
	/*
    ctx.fillStyle="rgba(0, 0, 0, 0.0)";
    ctx.fillRect(0,0, c_width, c_height);
    */
}
/**
* Draws a zone on the canvas.
* 
* @method zone_draw
* @param {Object} zone The zone to be drawn on the canvas
* @param {Object} ctx The context object that provides methods and properties for drawing on the canvas
**/
gco.zone_draw = function(zone, ctx){

	ctx.save();
	var minx = 2000;
	var miny = 2000;
	
    for (var j = 0; j < zone.nodes.length; j++){
       	if (gco.nodes[zone.nodes[j]].x < minx){
		minx = gco.nodes[zone.nodes[j]].x;
		}
		if (gco.nodes[zone.nodes[j]].y < miny){
		miny = gco.nodes[zone.nodes[j]].y;
		}
    }
	    ctx.beginPath();

	//var node = gco.nodes;
	//var zones = 
    ctx.moveTo(gco.nodes[zone.nodes[0]].x, gco.nodes[zone.nodes[0]].y);
    for (var j = 0; j < zone.nodes.length; j++){
        ctx.lineTo(gco.nodes[zone.nodes[j]].x, gco.nodes[zone.nodes[j]].y);
    }
    ctx.lineTo(gco.nodes[zone.nodes[0]].x, gco.nodes[zone.nodes[0]].y);
    
	
	
	ctx.closePath();
	ctx.save();
	ctx.clip();
	
	
	
	//draw the images
	if (zone.type==='residential'){
		ctx.drawImage(residential_img, minx, miny);
	}
	else if (zone.type==='industry'){
		ctx.drawImage(industry_img, minx, miny);
	
	}
	else if (zone.type==='park'){
		ctx.drawImage(park_img, minx, miny);
	}
	else if (zone.type==='largecity'){
		ctx.drawImage(largecity_img, minx, miny);	
	}
	
	ctx.fillStyle = "rgba(255,0,0,"+(0.2+(0.12*zone.panic_level/11))+")";
	ctx.fill();
	
	ctx.restore();
	//Draw outline of zones
    ctx.strokeStyle = "white";
    ctx.lineWidth = 15;
	ctx.stroke(); // Now draw our path
	ctx.restore(); // Put the canvas back how it was before we started
	
	
    //draw panic info on the zone
    ctx.fillStyle = 'black';
	ctx.fillRect(zone.centroid[0]-24,zone.centroid[1]-22,25,30); 
	if (zone.panic_level >= 10){
		ctx.fillRect(zone.centroid[0]-24,zone.centroid[1]-22,40,30); 
	}
	else{
		ctx.fillRect(zone.centroid[0]-24,zone.centroid[1]-22,25,30); 
	}
	
	ctx.save();
	ctx.fillStyle = 'white';
	ctx.font='27px Arial'
	ctx.fillText(zone.panic_level, zone.centroid[0]-20, zone.centroid[1]+3);
	
	//draw people info on the zone
	ctx.fillStyle = 'black';
	if (zone.people > 9 && zone.people < 100){
	
		ctx.fillRect(zone.centroid[0]-24,zone.centroid[1]+28,40,30); 
	}
	else if(zone.people > 99){
		ctx.fillRect(zone.centroid[0]-24,zone.centroid[1]+28,60,30); 
	}
	else{
		ctx.fillRect(zone.centroid[0]-24,zone.centroid[1]+28,25,30); 
	}
	ctx.save();
	ctx.fillStyle = 'white';
	ctx.font='27px Arial'
	ctx.fillText(zone.people, zone.centroid[0]-20, zone.centroid[1]+54);   
}

/**
* Draws an outline to show which zone or node is selected
* 
* @method selection_draw
* @param {Object} ctx The context object that provides methods and properties for drawing on the canvas
**/

gco.selection_draw = function(ctx){
    var nodes = gco.nodes,
        cst = gco.cst,
        zones = gco.zones;
    
    //draw lines to outline the selected zone
    if (cst.selected_zone !== null){
        var zone = zones[cst.selected_zone];
        ctx.beginPath();
        ctx.moveTo(nodes[zone.nodes[0]].x, nodes[zone.nodes[0]].y);
        for (var j = 1; j < zone.nodes.length; j++){
            ctx.lineTo(nodes[zone.nodes[j]].x, nodes[zone.nodes[j]].y);
        }
        ctx.lineTo(nodes[zone.nodes[0]].x, nodes[zone.nodes[0]].y);
        ctx.closePath();
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 20;
        ctx.stroke();
    }
    //draw lines to outline the selected node
    if (cst.selected_node !== null){
        var node = nodes[cst.selected_node];
        ctx.beginPath();
        ctx.beginPath();
		ctx.arc(node.x, node.y, node_size, 15, Math.PI*2, true); 
		ctx.closePath();
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 20;
        ctx.stroke();
    }
}
/**
* Checks if mouse click coordinates are within a player's area on the canvas
* 
* @method player_contains
* @param {Object} p The player used when checking if mouse coordinates are within its area
* @param {Int} mx The x-coordinates for a mouse click
* @param {Int} my The y-coordinates for a mouse click
**/
gco.player_contains = function(p, mx, my) {
    var pn = gco.nodes[p.node];
    return (mx<=(pn.x+player_offsetX[p.id]+player_size))&&
        (mx>=(pn.x+player_offsetX[p.id]-player_size))&&
        (my<=(pn.y+player_offsetY[p.id]+player_size))&&
        (my>=(pn.y+player_offsetY[p.id]-player_size));
}

/**
* Checks if mouse click coordinates are within a node's area on the canvas
* 
* @method node_contains
* @param {Object} node The node used when checking if mouse coordinates are within its area
* @param {Int} mx The x-coordinates for a mouse click
* @param {Int} my The y-coordinates for a mouse click
**/

gco.node_contains = function(node, mx, my) {
    return (mx<=(node.x+node_size))&&
        (mx>=(node.x-node_size))&&
        (my<=(node.y+node_size))&&
        (my>=(node.y-node_size));
}
/**
* Checks if mouse click coordinates are within a zone's area on the canvas
* 
* @method zone_contains
* @param {Object} z The zone used when checking if mouse coordinates are within its area
* @param {Int} mx The x-coordinates for a mouse click
* @param {Int} my The y-coordinates for a mouse click
**/
gco.zone_contains = function(z, mx, my){
    var n = z.nodes,
        nodes = gco.nodes;
    var r = false;
    var j = n.length - 1;

    for (var i=0; i <n.length; i++) {
        if (nodes[n[i]].y < my && nodes[n[j]].y >= my ||  nodes[n[j]].y < my && nodes[n[i]].y >= my) {
     
            if (nodes[n[i]].x + (my - nodes[n[i]].y) / (nodes[n[j]].y - nodes[n[i]].y) * (nodes[n[j]].x - nodes[n[i]].x) < mx) {
                r = !r;
            }
        }
        j = i;
    }
    return r;
}

/**
* The main draw function for drawing the objects on the canvas
* 
* @method draw
**/
gco.draw = function(){
    var to_node = {},
        node = {},
        zone = {},
        pl,
        ctx = gco.ctx,
        nodes = gco.nodes,
        zones = gco.zones,
        players = gco.players;
        
    gco.background_draw(ctx);    
        
    //call draw method for zone objects
    for (var i = 0; i < zones.length; i++) {
        zone = zones[i];
        gco.zone_draw(zone,ctx);
    }
    
    //call draw method for node objects
    for (var i = 0; i < nodes.length; i++) {
    	if (nodes[i].has_road_block){
    		node = nodes[i]
    		gco.roadblock_draw(nodes[i], ctx)
    	}
    }

    //call draw method for a selection
    gco.selection_draw(ctx);

    //call draw method for nodes
    for (var i = 0; i < nodes.length; i++) {
        node = nodes[i];
        gco.node_draw(node, ctx);
    }
    
    //call draw method for player objects
    for (var i = 0; i < players.length; i++) {
        pl = players[i];
        gco.player_draw(pl, ctx);

        var $pdiv = $("#p"+i);
        $pdiv.removeClass("active-player");
        if (i === gco.active_player){
        	$pdiv.addClass("active-player");
        }
    }
    
    //update labels
    if(players.length > 1){
        document.getElementById("turn-label").innerHTML = "Turn: "+(gco.turn); 
        document.getElementById("player-turn-label").innerHTML = "Player "+(gco.active_player)+"'s turn";
        document.getElementById("action-label").innerHTML = "Actions left: "+(players[gco.active_player].actions_left); 
    } 
    
}// end draw
/** 
* Called when a replay is pressed in the replay list on the index page.
* Sends an ajax request to the server to retrieve this replay.
*
* @method show_replay
**/	
function show_replay() {
    var id_cookie = read_cookie('replay_id');
	$.ajax({
    	url: remote_ip+':8124/show_replay',
    	data: {replay_id: id_cookie},
    	dataType: "jsonp",
    	jsonpCallback: "start_replay",
    	cache: false,
    	timeout: 5000,
    	success: function(data) {
        	console.log("Received data: "+data);
        	console.log(data);
    	},
    	error: function(jqXHR, textStatus, errorThrown) {
   			alert('error ' + textStatus + " " + errorThrown);
    	}
	});
}
/**
* Callback from the "show_replay" function.
* Sets the replay to the replay holder game_states and initiates the first state of the replay
*
* @method start_replay
* @param {List} d List of game states  
**/
function start_replay(d) {
	game_states = d;
	gco.init_game(game_states[0]);
}

/**
* Called by the "next action" button on the replay page.
* Sets the next replay state
* 
* @method next_action
**/
function next_action () {
	if (actions < game_states.length-1) {
		actions++;
		gco.init_game(game_states[actions]);
		console.log("actions" + actions);
	}
	else {
		alert("No more actions are available");
	} 
}
/**
* Called by the "previous action" button on the replay page.
* Sets the next replay state
* 
* @method previous_action
**/
function previous_action () {
	if (actions >= 1) {
		actions--;
		gco.init_game(game_states[actions]);
	}
	else {
		alert("No previous actions are available");
	}
}
