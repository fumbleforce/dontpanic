/*  Settings variables

    Used for setting size of objects and 
    positioning in drawing functions.
*/
var c_height = 1550,
    c_width = 1500,
    node_size = 50,
    player_size = 20,
    info_center_size = 35,
    offset_distance = node_size*1,
    panic_info_size = 40,
    w_inc = 0;
	//set images
	var snd = new Audio("/music/clocktickfastpain10sec.mp3"); // buffers automatically when created
	
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
	

/* TEMPORARY ZONE IMAGES

industry - http://oi50.tinypic.com/2ccur05.jpg
largecity - http://oi45.tinypic.com/pn28l.jpg
park - http://oi46.tinypic.com/11jtevr.jpg
residential - http://oi50.tinypic.com/96b7ud.jpg
 
*/

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




/*  Game Client Object

    All game-related objects and functions are encapsulated 
    in the "gco" (game client object) object, to avoid polluting
    the global namespace.
    
    Only one instance of this object is created for each client.
    
*/
var gco = {
    players : [],
    nodes : [],
    zones : [],
    canvas : document.getElementById("viewport"),
    cst : {},
    turn : 0,
    active_player : 0,
    is_gm : false,
}
gco.ctx = gco.canvas.getContext("2d");


/*  Initialize Game

    Initializes the game by populating the Game Client Object,
    adding listeners to the objects and starting the timer.
    
    List ps         List of player objects
    Object map      The map object containing list of Zones and Nodes
*/
gco.init_game = function (d) {
	
    console.log("Game initiated.");
    gco.players = d.players;
    gco.zones = d.zones;
    gco.nodes = d.nodes;
    gco.turn = d.turn;
    gco.active_player = d.active_player;
    gco.construct_player_divs(gco.players);
    gco.setup_canvas();
    gco.set_canvas_listener();

    
    gco.draw();
    gco.update_cards();
    gco.update_options([]);

}


/* Start Timer
    
    Controls the timer label, and emits an event to server 
    when the duration has been reached.
    
    Int dur         Duration of timer.
*/


gco.update_timer = function(time){
	
	
	if (time===10){
	snd.play();
	}
	var lab = document.getElementById("timer-label");
    lab.innerHTML = "Panic Increase in: "+time;
}


/*  Set up Canvas
    
    Configures the height and width of the canvas 
    according to the settings variables.

*/
gco.setup_canvas = function(){
    gco.canvas.width = c_width;
    gco.canvas.height = c_height;
    gco.cst.selected_zone = null;
    gco.cst.selected_node = null;
}

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
		inner += "<div id='p"+i+"' class='sidebar-player'><h2>Player "+i+"</h2><br><div class='player-info'><p>This is a player information sidebar row</p><div id='"+i+"_text' class='role-info-label'>More info here.</div></div><div id='"+i+"_cards' class='card-container'></div></div>";
	}
	$l.html(inner);
	inner = '';
	for(i=lim1; i<lim2; i++){
		inner += "<div id='p"+i+"' class='sidebar-player'><h2>Player "+i+"</h2><br><div class='player-info'><p>This is a player information sidebar row</p><div id='"+i+"_text' class='role-info-label'>More info here.</div></div><div id='"+i+"_cards' class='card-container'></div></div>";
	}
	$r.html(inner);
}

gco.reset = function(){
    /*var p = gco.players[gco.active_player];
    p.x = gco.nodes[p.node].x;
    p.y = gco.nodes[p.node].y;*/
    gco.update_players(gco.players);
}

gco.update_turn = function(turn, ap){
    gco.turn = turn;
    gco.active_player = ap;
    gco.cst.selected_zone = null
    gco.cst.selected_node = null
}

gco.update_options = function(o){
	var $s = $('#selection'),
		inner = '';
		
	inner += "<button class='btn' onclick='command("+'"'+"end_turn"+'"'+");'>Next Turn</button>";
	
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


/*  Update Player
    
    Called by the server when a player has been updated with new information. 
    Replaces the local player object with an updated object from the server.
    
    Object p        The updated player object.
*/
gco.update_player = function(p){
    gco.players[p.id] = p;
    gco.players[p.id].x = gco.nodes[p.node].x;
    gco.players[p.id].y = gco.nodes[p.node].y;
}

gco.update_players = function(ps){
	var $con;
    for(var i = 0; i < ps.length; i++) {
        gco.update_player(ps[i]);
     
    }
}

gco.update_nodes = function(ns){
    for(var i = 0; i < ns.length;i++){
        gco.nodes[ns[i].id] = ns[i];
    }
}

gco.update_zones = function(zs){
    for(var i = 0; i < zs.length;i++){
        gco.zones[zs[i].id] = zs[i];
    }
}

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
		
		$con = $("#"+i+"_text");
		$con.empty();
		something = $("<p>"+ps[i].role+"</p>");
		something.appendTo($con);
		

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


gco.update_status = function(status){
	$('#status_label').html(status);
}

gco.info_card_click = function(p, c) {
	console.log(p);
	console.log(c);
    if(gco.active_player === p){
		
		command('use_card', {card:c});
	}
}


gco.sounds = function(){
/*
var snd = new Audio("/music/painstick.wav"); // buffers automatically when created
snd.play();
	
var snd = new Audio("painstick.wav"); // buffers automatically when created
if (player.changed){
snd.play();
}*/
}




gco.move_people = function(){
	if(gco.cst.selected_zone !== null){
		gco.update_status("Moving people from zone "+gco.cst.selected_zone+"...");
		gco.cst.moving_people = true;
		gco.cst.moving_from = gco.cst.selected_zone;
	}
}


/* deprecated - Update whole player instead
gco.decrease_actions = function(){
    if (gco.players[gco.active_player].actions_left > 0) {
        gco.players[gco.active_player].actions_left--;
    }
    gco.draw();
}

gco.decrease_4_actions = function(){
    if (gco.players[gco.active_player].actions_left > 0) {
        gco.players[gco.active_player].actions_left -= 4;
    }
    gco.draw();
}
*/

/* Update whole zone instead
//decrease panic (server knows if player has special -10 panic role, if not decrease by 5)
gco.decrease_panic = function(zone){
	gco.zones[zone.id].panic_level = zone.panic_level;
	gco.draw();
}
*/



gco.player_draw = function(player, ctx){
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
		/*var gradiant = ctx.createRadialGradient(player.x+player_offsetX[player.id], player.y+player_offsetY[player.id], player_size-10, player.x+player_offsetX[player.id], player.y+player_offsetY[player.id], player_size);
    	gradiant.addColorStop(0, 'red');
    	gradiant.addColorStop(1, 'rgba(255,0,0,0)');
    	ctx.fillStyle=gradiant;
    	ctx.fill();
    }*/
    /*else{
    	//ctx.fill();
    	ctx.strokeStyle = 'black';
    	ctx.lineWidth = 2;
    	ctx.stroke();
    }
*/
	//ctx.fillStyle = "Black";
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

gco.background_draw = function(ctx){
	gco.canvas.width = gco.canvas.width;
	/*
    ctx.fillStyle="rgba(0, 0, 0, 0.0)";
    ctx.fillRect(0,0, c_width, c_height);
    */
}

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
	

	//ctx.fill();
	//Draw transparent red corresponding to panic level
	//ctx.fillStyle = "rgba(255,0,0,"+(0.2*zone.panic_level/10)+")";
	ctx.fillStyle = "rgba(255,0,0,"+(0.2+(0.12*zone.panic_level/11))+")";
	ctx.fill();
	
	

	ctx.restore();
	//Draw outline of zones
    ctx.strokeStyle = "white";
    ctx.lineWidth = 15;
	ctx.stroke(); // Now draw our path
	ctx.restore(); // Put the canvas back how it was before we started
	
   
    //TODO TEMPORARY show simple panic info
    ctx.fillStyle = 'black';

	ctx.fillRect(zone.centroid[0]-24,zone.centroid[1]-22,25,30); 
	if (zone.panic_level >= 10){
		ctx.fillRect(zone.centroid[0]-24,zone.centroid[1]-22,40,30); 
	}
	else{
		//console.log("was here");
		ctx.fillRect(zone.centroid[0]-24,zone.centroid[1]-22,25,30); 
	}
	ctx.save();
	ctx.fillStyle = 'white';
	ctx.font='27px Arial'
	ctx.fillText(zone.panic_level, zone.centroid[0]-20, zone.centroid[1]+3);
	
	//TODO simple people info
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

gco.selection_draw = function(ctx){
    var nodes = gco.nodes,
        cst = gco.cst,
        zones = gco.zones;
        
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

gco.player_contains = function(p, mx, my) {
    var pn = gco.nodes[p.node];
    return (mx<=(pn.x+player_offsetX[p.id]+player_size))&&
        (mx>=(pn.x+player_offsetX[p.id]-player_size))&&
        (my<=(pn.y+player_offsetY[p.id]+player_size))&&
        (my>=(pn.y+player_offsetY[p.id]-player_size));
}

gco.node_contains = function(node, mx, my) {
    return (mx<=(node.x+node_size))&&
        (mx>=(node.x-node_size))&&
        (my<=(node.y+node_size))&&
        (my>=(node.y-node_size));
}

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
        
    for (var i = 0; i < zones.length; i++) {
        zone = zones[i];
        gco.zone_draw(zone,ctx);
    }
    
    
    
    
    for (var i = 0; i < nodes.length; i++) {
    	if (nodes[i].has_road_block){
    		node = nodes[i]
    		gco.roadblock_draw(nodes[i], ctx)
    	}
    }
    
    gco.selection_draw(ctx);

    for (var i = 0; i < nodes.length; i++) {
        node = nodes[i];
        gco.node_draw(node, ctx);
    }
    
    
    for (var i = 0; i < players.length; i++) {
        pl = players[i];
        gco.player_draw(pl, ctx);

        var $pdiv = $("#p"+i);
        $pdiv.removeClass("active-player");
        if (i === gco.active_player){
        	$pdiv.addClass("active-player");
        }
    }
    
    if(players.length > 1){
        document.getElementById("turn-label").innerHTML = "Turn: "+(gco.turn); 
        document.getElementById("player-turn-label").innerHTML = "Player "+(gco.active_player)+"'s turn";
        document.getElementById("action-label").innerHTML = "Actions left: "+(players[gco.active_player].actions_left); 
    } 
    
}// end draw


gco.set_canvas_listener = function(){
    var canvas = gco.canvas,
        cst = gco.cst,
        draw = gco.draw,
        nodes = gco.nodes,
        players = gco.players,
        zones = gco.zones;
    
    cst.moving_people = false;
    cst.moving_from = null;
    
    canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);

    canvas.addEventListener('mousedown', function(e) {
        
        var mx = e.offsetX,
            my = e.offsetY,
            selected;
		
		gco.update_status("");
		gco.update_options([]);
        cst.selected_zone = null;
        cst.selected_node = null;
        
        if (cst.selection) {
            console.log("clearing selection");

            cst.selection.x = nodes[cst.selection.node].x
            cst.selection.y = nodes[cst.selection.node].y
            cst.selection = undefined;
            cst.dragging = false;
            gco.draw();
        }

        for (var i = 0; i < players.length; i++) {

        	if (gco.player_contains(players[i], mx, my)) {
        		gco.update_status("Clicked on player  "+i);
        		selected = players[i];
        		//Check if player is active, so it can be moved
        		if (i===gco.active_player || gco.is_gm){

        			selected.x = nodes[players[i].node].x;
        			selected.y = nodes[players[i].node].y;
        			cst.dragoffx = mx - selected.x;
        			cst.dragoffy = my - selected.y;
        			cst.dragging = true;
        			cst.selection = selected;
        			gco.draw();
        			return;
        		}
        	}
        }

		for (var i = 0; i < nodes.length; i++) {

        	if (gco.node_contains(nodes[i], mx, my)) {
        		gco.update_status("Selected node "+i);
        		cst.selected_node = i;
				command('select_node', {node_id : cst.selected_node});
        		gco.draw();
        		return;
           }
        }
		
        for (var i = 0; i < zones.length; i++) {

        	if (gco.zone_contains(zones[i], mx, my)) {
        		console.log("Clicked on zone "+i);
        		gco.update_status("Selected zone "+i);
        		cst.selected_zone = i;
        		//TODO for testing, we add 'decrease_panic' when selecting zones
        		if(cst.moving_people){
        			command('move_people', {zone_from: cst.moving_from, zone_to:i});
        			gco.update_status("Moved people to zone "+i);
        			cst.moving_from = null;
        			cst.moving_people = false;
        		}
        		else{
        			command('select_zone', {zone_id : cst.selected_zone});
        		}
        		gco.draw();
        		return;
           }
        }

        
        
        gco.draw();
        
        
    }, true);//end mousedown listener
  
    canvas.addEventListener('mousemove', function(e) {
        if (cst.dragging){
            console.log("Mouse is dragging");
            var mx = e.offsetX,
                my = e.offsetY;
            cst.selection.x = mx - cst.dragoffx;
            cst.selection.y = my - cst.dragoffy;   
            gco.draw();
            gco.update_status("Dragging player "+cst.selection.id);
        }
    }, true);//end mousemove listener
    
    canvas.addEventListener('mouseup', function(e) {
        var mx = e.offsetX,
            my = e.offsetY;
             
        if (cst.dragging && cst.selection !== undefined) {
            console.log("Mouse let go of player");
            for (var i = 0; i < nodes.length; i++) {
                if (gco.node_contains(nodes[i], mx, my)) {
                    
                    command('move_player', {
                        player_id : cst.selection.id,
                        node_id : i
                    });
                    gco.update_status("Moved player "+cst.selection.id);
                    cst.selection = undefined;
                    cst.dragging = false;
                    gco.draw();
                    
                    return;
                }
            }
            cst.selection.x = nodes[cst.selection.node].x
            cst.selection.y = nodes[cst.selection.node].y
            cst.selection = undefined;
            cst.dragging = false;
            gco.draw();
        }
        
    }, true);//end mouseup listener
    
}//end set canvas listener


