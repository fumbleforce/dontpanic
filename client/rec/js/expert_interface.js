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
	player_colors = ["red","orange","yellow","chartreuse ","green","aqua","blue","purple"];
	max_players = 7;
	//set images
	var residential_img = new Image();
	residential_img.src = "/img/residential.jpg";
	var park_img = new Image();
	park_img.src = "/img/park.jpg";
	var industry_img = new Image();
	industry_img.src = "/img/industry.jpg";
	var largecity_img = new Image();
	largecity_img.src = "/img/largecity.jpg";
	
	var cat_img = new Image();
	cat_img.src = "/img/cat.jpg"
	
	var penguin_img = new Image();
	penguin_img.src = "/img/cat.jpg"
	
	var tophat_img = new Image();
	tophat_img.src = "/img/cat.jpg"
	
	var lifejacket_img = new Image();
	lifejacket_img.src = "/img/cat.jpg"
	
	var book_img = new Image();
	book_img.src = "/img/cat.jpg"
	
	
	
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
	next_node : 0,
	next_zone : 0,
	next_player : 0,
	mode : "add node", // not in use
	selected_node : -1,
	selected_zone : -1,
	selected_player : -1,
	connection : -1,
	zone_container : [],
	node_container : [],
	effects : [],
	info_cards : [],
	rdy_effects :[]
		  
}
gco.ctx = gco.canvas.getContext("2d");


/*  Initialize Game

    Initializes the game by populating the Game Client Object,
    adding listeners to the objects and starting the timer.
    
    List ps         List of player objects
    Object map      The map object containing list of Zones and Nodes
*/
gco.init_game = function (d) {
    console.log("Game initiated");
	console.log("asdasdasdasdASasdasdasdasdASasdasdasdasdASasdasdasdasdASasdasdasdasdA");


    
    gco.setup_canvas();
    gco.set_canvas_listener();
	

	if(gco.info_cards.length == 0){
	
		gco.info_cards.push(newIcard = {
					name:"Calm financial",
					desc:"Calm financial23 districts",
					effects: [{
						name:"financ calm",
						domain:'zone',
						type:'panic',
						panic:(-5),
						affects:'largecity'
					}]
				});
		gco.info_cards.push(newIcard = {
					name:"Calm industry",
					desc:"Calm industry2 districts",
					effects: [{
						name:"indus calm",
						domain:'zone',
						type:'panic',
						panic:(-5),
						affects:'industry'
					}]
				});
		gco.info_cards.push(newIcard = {
					name:"Calm residental",
					desc:"Calm residental11 districts",
					effects: [{
						name:"resid calm",
						domain:'zone',
						type:'panic',
						panic:(-5),
						affects:'residential'
					}]
				});
	
	}
	gco.update_ddbox(document.getElementById("card_show"), gco.info_cards);

    gco.draw();


}




gco.export_to_database = function(){

	gco.update_adjacent_zones();
	

	var game_template = {
		map : {
			nodes : [],
			zones : []
		},
		players : [],
		info_cards : [],
		events : [],
		author : document.getElementById("template_author").value,
		desc : document.getElementById("template_desc").value
		
		
	};
	for(var i = 0; i < gco.nodes.length ; i++){
		snode = gco.nodes[i];
		sconnects_to = [];
		
		for(var z = 0; z < snode.connects_to.length; z++){
			sconnects_to.push(snode.connects_to[z].id);
		}
		
		game_template.map.nodes.push(node = {
			id : snode.id, 
			x : snode.x, 
			y : snode.y, 
			is_start_position : true, 
			has_information_center : false,
			connects_to : sconnects_to
			});
	}

	
	
	for (var i = 0; i < gco.zones.length; i++){
		szone = gco.zones[i];
		
		snodes = [];
		
		for( var z = 0; z < szone.nodes.length ; z++){
			snodes.push(szone.nodes[z].id);		
		}
		
		game_template.map.zones.push(zone = {
			id : szone.id, 
			nodes : snodes,
			type : szone.type,
			people : szone.people,
			panic_level : szone.panic_level,
			adjacent_zones : szone.zones, //find a way to calculate adjacent zones
			centroid : szone.centroid,
			color : 'tomato'

			});
	}
	// (id, user, node, color, role, actions_left)
	for(var i = 0; i < gco.players.length;i++){
	
		splayer = gco.players[i];
		
		game_template.players.push(player = {
			id : splayer.id,
			user : "player" + i,
			x : splayer.node.x,
			y : splayer.node.y,
			node : splayer.node.id,
			color : splayer.color,
			role : splayer.role,
			actions_left : splayer.actions_left
		});
		
		
		
	}
	for(var i = 0; i < gco.info_cards.length; i++){
		game_template.info_cards.push(gco.info_cards[i]);
	}

	console.log(JSON.stringify(game_template));
	
	
	$.post('http://127.0.0.1:8124/', JSON.stringify(game_template));
/*/
	   $.ajax({
		  type: "POST",
		  url: 'http://127.0.0.1:8124/',
		  data: game_template,
		  success: function(data) {
            console.log("Received data: "+data);
            console.log(data);
        },
		  dataType: "jsonp"
	});
/*/	
	

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


gco.reset = function(){
    /*var p = gco.players[gco.active_player];
    p.x = gco.nodes[p.node].x;
    p.y = gco.nodes[p.node].y;*/
    gco.update_players(gco.players);
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
        for (c = 0; c < cards.length; c++){
            button = $("<button id='"+i+"-"+c+"' class='info-card' onclick='gco.info_card_click(this.id)'>"+cards[c].name+ "</button>");
            button.appendTo($con);
			
        }
		
    }
}


gco.info_card_click = function(id) {
    var p = id.charAt(0),
        c = id.charAt(2);
    if(gco.active_player == p){
		command('use_card', {player:p, card:c});
	}
}











gco.player_draw = function(player, ctx){
    player.x = player.node.x;
    player.y = player.node.y;
	

	
	ctx.fillStyle = "rgba(255,0,0,0)";
	ctx.save();


	
    ctx.beginPath();
    ctx.arc(player.x+player_offsetX[player.id], player.y+player_offsetY[player.id], player_size, 0, Math.PI*7, true); 


    ctx.font="bold 15px Arial",
    ctx.fillText(player.id, player.x+player_offsetX[player.id]-5, player.y+player_offsetY[player.id]+6);

	if(gco.selected_player == player.id){
		ctx.fillStyle = "rgba(255,0,0,"+(0.2+(0.12*25/11))+")";
	}
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

gco.node_draw = function(node, ctx){ //draws a node with the provided context
    ctx.fillStyle = 'white';
	if((gco.selected_node == node.id) || (gco.connection == node.id)){
		ctx.fillStyle = 'red';

	}
	if(gco.node_container.indexOf(node) > -1){
		ctx.fillStyle = 'blue';
	}
	if(gco.connection == node.id){
		ctx.fillStyle = 'yellow';
	}
	
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
gco.draw_connections = function(ctx){
	var nodes = gco.nodes;
	ctx.strokeStyle = '#202020';
	ctx.lineWidth = 5;
	
	for(var i = 0; i < nodes.length; i++){
		node = nodes[i];
	
		for(var z = 0; z < nodes[i].connects_to.length; z++){
			ctx.beginPath();
			ctx.moveTo(node.x, node.y);
			
			nodeto = nodes[node.connects_to[z].id];
			
			ctx.lineTo(((nodeto.x)+node.x)/2, ((nodeto.y)+node.y)/2);
			ctx.closePath();
			ctx.stroke();
		}
	}	
}
gco.background_draw = function(ctx){ // draws the background
    ctx.fillStyle="grey";
    ctx.fillRect(0,0, c_width, c_height);
}

gco.zone_draw = function(zone, ctx){ // draws a zone with the provided context

	ctx.save();
	var minx = 2000;
	var miny = 2000;
	
    for (var j = 0; j < zone.nodes.length; j++){
       	if (zone.nodes[j].x < minx){
		minx = zone.nodes[j].x;
		}
		if (zone.nodes[j].y < miny){
		miny = zone.nodes[j].y;
		}
    }
	    ctx.beginPath();

	//var node = gco.nodes;
	//var zones = 
    ctx.moveTo(zone.nodes[0].x, zone.nodes[0].y);
    for (var j = 0; j < zone.nodes.length; j++){
        ctx.lineTo(zone.nodes[j].x, zone.nodes[j].y);
    }
    ctx.lineTo(zone.nodes[0].x, zone.nodes[0].y);
    
	
	
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
	if(zone.id==gco.selected_zone){
		ctx.strokeStyle = "blue";
	}
    ctx.lineWidth = 15;
	ctx.stroke(); // Now draw our path
	ctx.restore(); // Put the canvas back how it was before we started
	
	
	

    
	
   
    //TODO TEMPORARY show simple panic info
	
	
	for (var zon=0; zon<gco.zones.length; zon++){
    	var xx=0, yy=0;
	    for (var i=0; i<gco.zones[zon].nodes.length; i++){
	    	xx+=gco.nodes[gco.zones[zon].nodes[i].id].x;
	    	yy+=gco.nodes[gco.zones[zon].nodes[i].id].y;
	    }
		gco.zones[zon].centroid=[xx/gco.zones[zon].nodes.length, yy/gco.zones[zon].nodes.length];
    }
	
	
    ctx.fillStyle = 'black';
	if (zone.panic_level > 9){
		ctx.fillRect(zone.centroid[0]-24,zone.centroid[1]-22,40,30); 
	}
	else{
		// console.log("checking zone draw panic");
		ctx.fillRect(zone.centroid[0]-24,zone.centroid[1]-22,25,30); 
	}
	ctx.fillStyle = 'white';
	ctx.font='27px Arial'
	ctx.fillText(zone.panic_level, zone.centroid[0]-20, zone.centroid[1]+3);
	
	// people info
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
}

gco.player_contains = function(p, mx, my) {
    var pn = gco.nodes[p.node.id];
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

gco.zone_contains = function(z, mx, my){ // checks if the clicked area contains a zone
    var n = z.nodes;
    var nodes = gco.nodes;
    var r = false;
    var j = n.length - 1;

    for (var i=0; i <n.length; i++) {
        if (nodes[n[i].id].y < my && nodes[n[j].id].y >= my ||  nodes[n[j].id].y < my && nodes[n[i].id].y >= my) {
     
            if (nodes[n[i].id].x + (my - nodes[n[i].id].y) / (nodes[n[j].id].y - nodes[n[i].id].y) * (nodes[n[j].id].x - nodes[n[i].id].x) < mx) {
                r = !r;
            }
        }
        j = i;
    }
    return r;
}

gco.draw = function(){ //Draws everything

	
    var to_node = {},
        node = {},
        zone = {},
        pl,
        ctx = gco.ctx,
        nodes = gco.nodes,
        zones = gco.zones,
        players = gco.players;
        
    gco.background_draw(ctx);    
	
	gco.draw_connections(ctx);
        
    for (var i = 0; i < zones.length; i++) {
        zone = zones[i];
        gco.zone_draw(zone,ctx);
    }
	if(gco.selected_zone > -1){
		gco.zone_draw(zones[gco.selected_zone], ctx);
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
        //var id = "p"+i;
        //document.getElementById(id).style.background = "gray";
        //if (i === gco.active_player) document.getElementById(id).style.background = "lightgray";
    }
    
    /*if(players.length > 1){
        document.getElementById("turn-label").innerHTML = "Turn: "+(gco.turn); 
        document.getElementById("player-turn-label").innerHTML = "Player "+(gco.active_player)+"'s turn";
        document.getElementById("action-label").innerHTML = "Actions left: "+(players[gco.active_player].actions_left); 
    } */
	ctx.fillStyle="White";
	ctx.font="10px verdana";
	selected_line = "Selected: ";
	selected_line2 = "";
	selected_line3 = "";
	if(gco.selected_node > -1){
		selected_line += "Node " + gco.selected_node ;
		selected_line2 += "X: " + gco.nodes[gco.selected_node].x + " Y: " + gco.nodes[gco.selected_node].y;
	}
	else if(gco.selected_zone > -1){
		selected_line += "Zone " + gco.selected_zone;
		selected_line2 += "Nodes:";
		for(var i = 0; i < gco.zones[gco.selected_zone].nodes.length; i++){
			selected_line2 += " " + gco.zones[gco.selected_zone].nodes[i].id;
		}
		
	}
	else if(gco.selected_player > -1){
		selected_line += "Player " + gco.selected_player;
		selected_line2 += "X: " + gco.players[gco.selected_player].x + " Y: " + gco.players[gco.selected_player].y;
	}
	else {
		selected_line += "Nothing";
	}
	
	
	
	
	
	ctx.fillText(selected_line, gco.canvas.width - ctx.measureText(selected_line).width, 10);
	ctx.fillText(selected_line2, gco.canvas.width - ctx.measureText(selected_line2).width, 20);
	ctx.fillText(selected_line3, gco.canvas.width - ctx.measureText(selected_line3).width, 40);
	
	
	
	
	
    
}// end draw


gco.add_player = function(){ // creates a player and adds it to the game.
	
	var player_role = document.getElementById("player_role").value;
	
	
	console.log("role" + player_role);
	
	var player_node = document.getElementById("player_node").value;
	
	console.log("Node: " + player_node);
	
	if (gco.next_player > max_players) {
		console.log("to many players");
		return;
	}
	
		
	gco.players.push(player = {
				id:gco.next_player,
				user:"player",
				node:gco.nodes[player_node],
				//color:player_colors[gco.next_player],
				role:player_role,
				actions_left : 4
			});
	gco.next_player++;
	gco.draw();

}

gco.change_player = function()
{
	if(gco.selected_player == -1){
		console.log("no player selected");
		return;
	}
	console.log("Changing player: " + gco.selected_player);
	
	player = gco.players[gco.selected_player];
	
	node = document.getElementById("player_node").value;
	role = document.getElementById("player_role").value;
	
	if(node == -1){
		console.log("node does not exist");
		return;
	}
	
	console.log("player role: "+role);
	console.log("player node: "+node);
	
	player.role = role;
	player.node =  gco.nodes[node];
	
	gco.draw();
	
}
gco.create_connection = function(){ // creates a connection between the 2 selected nodes
	if((gco.connection > -1) && (gco.selected_node > -1) && (gco.connection != gco.selected_node) && 
			(gco.nodes[gco.connection].connects_to.indexOf(gco.nodes[gco.selected_node]) < 0)){
			
	
		gco.nodes[gco.connection].connects_to.push(gco.nodes[gco.selected_node]);
		gco.nodes[gco.selected_node].connects_to.push(gco.nodes[gco.connection]);
		
		console.log("connection between " + gco.selected_node + " and " + gco.connection);
		
		gco.connection = -1;
		return;
	}
	console.log("failed create connection test");
	gco.connection = -1;
	gco.draw();
		
	
}
gco.edit_zone = function(){
	if(gco.selected_zone < 0){
		console.log("no Zone selected");
		return;
	}
	
	//var zone = gco.zones[gco.selected_zone];
	console.log("changing zone");
	gco.zones[gco.selected_zone].type = document.getElementById("edit_zone_type").value;
	gco.zones[gco.selected_zone].people = document.getElementById("zone_people").value;
	gco.zones[gco.selected_zone].panic_level = document.getElementById("zone_panic").value;
	//console.log("changing zone");
	gco.draw();
	
	
}
gco.node_connection = function(){ // saves the selected node fot connection purposes

	gco.connection = gco.selected_node; 
	gco.draw();
	
}
gco.add_zone_nodes = function(){ // adds a node to a container so it later can be used to create a zone

	
	if((gco.selected_node > -1) && (gco.node_container.indexOf(gco.nodes[gco.selected_node]) < 0) ){
		
		if(gco.node_container.length == 0){
			gco.node_container.push(gco.nodes[gco.selected_node]);
			gco.draw();
			return 
		}
		if((gco.node_container[gco.node_container.length-1].connects_to.indexOf(gco.nodes[gco.selected_node]) > -1 )){
			gco.node_container.push(gco.nodes[gco.selected_node]);
			
		}
		
		
	}
	gco.draw();
}
gco.clear_zone_nodes = function() { // clears the selected nodes for science!
	
	gco.node_container = [];
	gco.draw();
}
gco.del_selected_zone = function(){ // delete the selected zone, if none is selected nothing will be removed

	if(gco.selected_zone > -1){
		index = gco.selected_zone;
		
		
		
		gco.zones.splice(index, 1);
		
		gco.selected_zone = -1;
		gco.re_id();
		gco.connection = -1;
		gco.clear_zone_nodes();
		gco.draw();
		
	}
}
gco.del_selected_player = function(){
	if(gco.selected_player > -1){
		
		index = gco.selected_player;
		
		
		
		gco.players.splice(index, 1);
		
		gco.selected_player = -1;
		gco.re_id();
		gco.draw();
	}
}

gco.del_selected_node = function(){ // deletes the selected node, if none is selected nothing will be removed
			
			// will not delete if node is a part of a zone

	gco.clear_zone_nodes();
	gco.connection = -1;
	
	
	if(gco.selected_node > -1){
		index = gco.selected_node;
		node = gco.nodes[index];
		
		
		
		for (var z = 0; z < gco.zones.length ; z++){
			if(gco.zones[z].nodes.indexOf(gco.nodes[gco.selected_node]) > -1 ){
				console.log("failed delete test");
				gco.selected_node = -1;
				return;
			}
		}
		// check if node has a player
		
		for (var i = 0; i< gco.players.length ; i++){
			if(gco.players[i].node == node){
				console.log("failed delete test");
				gco.selected_node = -1;
				return;
			}
		}
		console.log("passed delete test");
		for (var i = 0; i < gco.nodes[index].connects_to.length; i++){
			cnode = gco.nodes[index].connects_to[i];
			index2 = cnode.connects_to.indexOf(node);
			cnode.connects_to.splice(index2, 1);
			
		}
		
		gco.nodes.splice(index, 1);

		
		
		gco.re_id();
		gco.selected_node = -1;
		gco.update_ddbox(document.getElementById("player_node"), gco.nodes);
		gco.draw();
	}
}

gco.re_id = function(){ // redo all id's of the nodes, to make it look better
	for(gco.next_node = 0; gco.next_node < gco.nodes.length; gco.next_node++){
		gco.nodes[gco.next_node].id = gco.next_node;
	}
	for(gco.next_zone = 0; gco.next_zone < gco.zones.length; gco.next_zone++){
		gco.zones[gco.next_zone].id = gco.next_zone;
	}
	for(gco.next_player = 0; gco.next_player < gco.players.length; gco.next_player++){
		gco.players[gco.next_player].id = gco.next_player;
	}
}
gco.update_adjacent_zones = function () {

	console.log("update adjacent zones " + gco.zones.length );
	
	for (d = 0 ; d < gco.zones.length; d++ ) {
		//console.log("zone: " + d + " zones: " + gco.zones[d].zones);
		
		gco.calculate_adjacent_zones(gco.zones[d]);
	}
}
gco.calculate_adjacent_zones = function (zone){ //calculates the adjecent zones

	//console.log("trying to calculate adjacent zones");
	
	for(var i = 0; i <  zone.nodes.length; i++){
	
		current_node = zone.nodes[i];
		con_node = zone.nodes[(i+1)%zone.nodes.length];
		
		for (var z = 0;z < gco.zones.length; z++){
			
			if(gco.zones[z].id != zone.id && (zone.zones.indexOf(gco.zones[z].id) == -1)){
			
				cur_nodes = gco.zones[z].nodes;
				
				if((cur_nodes.indexOf(current_node) > -1) && (cur_nodes.indexOf(con_node) > -1)){
					
					if((cur_nodes[(cur_nodes.indexOf(current_node) + 1)%cur_nodes.length].id == con_node.id) || 
							(cur_nodes[(cur_nodes.indexOf(con_node) + 1)%cur_nodes.length].id == current_node.id)){
						
						zone.zones.push(gco.zones[z].id);
						console.log("created a zone connection between zone " + zone.id + " and zone " + gco.zones[z].id);
						
					}
				}
			}
		}
	}
}

gco.create_zone = function(){ // checks if it is possible to create a zone, and creates one if possible.
	nodes = gco.node_container;
	
	// checking if possible to create zone: enough nodes
	if(nodes.length < 3){
		gco.clear_zone_nodes();
		return;
	}
	console.log("checking");
	// checking if possible to create zone: coupled together
	
	for (var i = 0 ; i+1 < nodes.length ; i++){
		if(nodes[i].connects_to.indexOf(nodes[i+1]) < 0){
			for (var z = 0 ; z < gco.nodes[nodes[i]].connects_to.length ; z++){
				console.log(gco.nodes[nodes[i]].connects_to[z]);
			}
			console.log("failed: " + i + ": " + gco.nodes[nodes[i]].connects_to.indexOf(nodes[i+1]) );
			gco.clear_zone_nodes();
			
			return;
		}
	}
	if(nodes[0].connects_to.indexOf(nodes[nodes.length-1]) < 0){
		gco.clear_zone_nodes();
		console.log("failed");
		return;
	}
	newZone = {
			id : gco.next_zone,
			people : 0,
			panic_level : 0,
			type : 'residential',
			centroid : [0,0],
			nodes : gco.node_container,
			zones : []
		};
	gco.zones.push(newZone);
	gco.next_zone++;
	
	console.log("zone: " + newZone.id + " nodes " + newZone.nodes[0]);
	gco.clear_zone_nodes();
	
	
}
gco.add_info_card = function() {
	
	cname = "new card";
	cdesc = "new card";
	ceff = []; 
	
	/*
	if(ceff.lenght == 0 || cname == "" || cdesc == ""){
		return;
	}*/

	
	gco.info_cards.push(newCard = {
		
		name : cname,
		desc : cdesc,
		effects : ceff
		});
	
	
	
	
	
	
	gco.update_ddbox(document.getElementById("card_show"), gco.info_cards);
	gco.show_card();
}
gco.card_create_add_effect = function() {

	
	ename = document.getElementById("effect_name").value;
	edomain = document.getElementById("effect_domain").value;
	etype = document.getElementById("effect_type").value;
	epanic = document.getElementById("effect_panic").value;
	eaffects = document.getElementById("effect_affects").value;
	
	if(ename == "" || edomain == "" || etype == "" || epanic == "" || eaffects == ""){
		//return;
	}
	
	gco.rdy_effects.push( newEffect = {
		name : ename,
		domain : edomain,
		type : etype,
		panic : epanic,
		affects : eaffects
	});
	
	gco.info_cards[document.getElementById("card_show").value].effects.push(newEffect = {
		name : ename,
		domain : edomain,
		type : etype,
		panic : epanic,
		affects : eaffects
	});
	
	gco.update_ddbox(document.getElementById("card_effect"), gco.rdy_effects);
	
}
gco.card_create_remove_effect = function() {
	
	var index = document.getElementById("card_effect").value;

	gco.rdy_effects.splice(index, 1);
	

	gco.update_ddbox(document.getElementById("card_effect"), gco.rdy_effects);
}


gco.update_ddbox = function(ddbox, list) {

	

	if(list.length == 0){
		
		ddbox.options[0] = new Option('none added', '-1');
		ddbox.options.length=1;
		return;
	}
	ddbox.options.length = list.lenght;
	for( var i = 0; i < list.length; i++){
		if(!list[i].name){
			ddbox.options[i] = new Option(i ,i);
		}
		else{
			ddbox.options[i] = new Option(list[i].name, i);
			
		}
	
	}
	
	
}

gco.zone_box_update = function(){
	if(gco.selected_zone < 0){
		document.getElementById("zone_id").innerHTML = "no zone selected";
		return;
	}
	
	document.getElementById("zone_id").innerHTML = gco.selected_zone;
}

gco.show_card = function(){
	var card = gco.info_cards[document.getElementById("card_show").value];
	
	document.getElementById("card_name").value = card.name;
	document.getElementById("card_desc").value = card.desc;
	
	gco.update_ddbox(document.getElementById("card_effect"), card.effects); 
	
	gco.rdy_effects = card.effects;
	
}


gco.set_canvas_listener = function(){
    var canvas = gco.canvas,
        cst = gco.cst,
        draw = gco.draw,
        nodes = gco.nodes,
        players = gco.players,
        zones = gco.zones;
        
    canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);

	
	//canvas.addEventListener('sw', gco.zone_box_update(), true); // end keylistener
	
	window.addEventListener('keydown',function(e) {
		console.log("key" + e.keyCode);
		
		
		if(e.keyCode == 68 || e.keyCode == 46){
			gco.connection = -1;
			gco.del_selected_node();
			gco.del_selected_zone();
		}
		if(e.keyCode == 67){
			gco.node_connection();
		}
		if(e.keyCode == 65){
			gco.add_zone_nodes();
		}
		if(e.keyCode == 90){
			gco.create_zone();
		}
	
	},true); // end key listener
	
	
    canvas.addEventListener('mousedown', function(e) {
		
        
        var mx = e.offsetX,
            my = e.offsetY,
            selected;

		
        gco.selected_zone = -1;
		gco.selected_node = -1;
		gco.selected_player = -1;
        cst.selected_zone = null;
        cst.selected_node = null;
		
		gco.zone_box_update();
       
		/*
		if (cst.selection) {
            console.log("clearing selection");
            cst.selection.x = nodes[cst.selection.node].x
            cst.selection.y = nodes[cst.selection.node].y
            cst.selection = undefined;
            cst.dragging = false;
            gco.draw();
        }
		/*
		for (var i = 0; i < players.length; i++) {

        	if (gco.player_contains(players[i], mx, my)) {
        		console.log("Clicked on a player "+players[i].id);
        		selected = players[i];
        		//Check if player is active, so it can be moved
        		if (i===gco.active_player){

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
		*/
		
		for (var g = 0; g < gco.players.length; g++){
			if(gco.player_contains(players[g], mx, my)){
				console.log("Clicked on player " +g);
				
				gco.selected_player = g;
				
				
				gco.draw();
				return;
			}
		}
	
		for (var i = 0; i < gco.nodes.length; i++) {

        	if (gco.node_contains(nodes[i], mx, my)) {
        		console.log("Clicked on node "+i);
				cst.selected_node = i;
				gco.selected_node = i;
				
				if(gco.connection > -1){
					gco.create_connection();
					
				}
				
				
				selected = nodes[i];
				
				cst.dragoffx = mx - nodes[i].x;
				cst.dragoffy = my - nodes[i].y;
				cst.dragging = true;
				cst.selection = selected;
				
				
        		gco.draw();
        		return;
           }
        }
		
		for (var z = 0; z < gco.zones.length; z++) {
			if(gco.zone_contains(zones[z], mx, my)){
				console.log("Clicked on zone " + z);
				gco.selected_zone = z;
				gco.zone_box_update();
				
				gco.draw();
				return;
					
				
			}	
		}
		
		gco.nodes.push(newNode = {
				id:gco.next_node,
				x:mx,
				y:my,
				is_start_position:false,
				connects_to:[]
			});
		gco.next_node++;
		
		gco.selected_node = gco.next_node -1;
		gco.update_ddbox(document.getElementById("player_node"), gco.nodes);
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
        }
    }, true);//end mousemove listener
    
    canvas.addEventListener('mouseup', function(e) {
        var mx = e.offsetX,
            my = e.offsetY;
             
        if (cst.dragging && cst.selection !== undefined) {
            console.log("Mouse let go of node");
            for (var i = 0; i < nodes.length; i++) {
                if (gco.node_contains(nodes[i], mx, my)) {
                    
                    
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
