/**
*    
* @module Expert Interface
* @class Expert Interface
**/

/**  Settings variables

    Used for setting size of objects and 
    positioning in drawing functions.
**/
var c_height = 1550,
    c_width = 1500,
    node_size = 50,
    player_size = 20,
    info_center_size = 35,
    offset_distance = node_size*1,
    panic_info_size = 40,
    w_inc = 0;
	player_colors = ["red","orange","yellow","chartreuse ","green","aqua","blue","purple"];
	effect_zone_list = ["panic", "event"];
	
	effect_people_list = ["actions", "nextplayer", "stealaction", "blocknextevent"];
	
	
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
    active_player : 0,
	next_node : 0,
	next_zone : 0,
	next_player : 0,
	selected_node : -1,
	selected_zone : -1,
	selected_player : -1,
	selected_card : -1,
	selected_event : -1,
	connection : -1,
	zone_container : [],
	node_container : [],
	effects : [],
	info_cards : [],
	rdy_effects :[],
	event_effects : [],
	events : [],
	hotkeys : false
		  
}
gco.ctx = gco.canvas.getContext("2d");


/*  Initialize Game

    Initializes the game by populating the Game Client Object,
    adding listeners to the objects and starting the timer.
    

*/

/**
method that initiates the game canvas, and creates some default events and information cards

@method init_game
**/
gco.init_game = function () {
    console.log("Expert interface initiated");
	


    
    gco.setup_canvas();
    gco.set_canvas_listener();
	
	gco.events.push(
		   {  	name:"Fire in industrial",
				desc:"Fire engulfs industrial complex! Workers in all districts gives into panic.\nPanic increased by 20 in all industrial districts",
				effects: [{
					name:"industry + 20 panic",
					domain:'zone',
					type:'event',
					panic:(20),
					affects:'industry'
			   }]
		   });
	gco.events.push(
			{   name:"Power outage in residential",
				desc:"Power outage in all residential districts!\nPanic increased by 5 in all residential districts",
				effects: [{
					name:"residential +5 panic",
					domain:'zone',
					type:'event',
					panic:(5),
					affects:'residential'
				}]
			});
	gco.events.push(
			 {  name:"Terrorist attack in the city",
				desc:"Terrorist attack in the city!\nPanic increased by 10 in all largecity districts",
				effects: [{
					name:"largecity + 10 panic",
					domain:'zone',
					type:'event',
					panic:(10),
					affects:'largecity'
				 }]
			 });
	gco.events.push(
			{   name:"Power outage in residential",
				desc:"Power outage in all residential districts\nPanic increased by 10 in all residential districts!",
				effects: [{
					name:"residential +10 panic",
					domain:'zone',
					type:'event',
					panic:(10),
					affects:'residential'
				}]
			});
	gco.events.push(
			{   name:"Shout about epedemic",
				desc:"Shouting about an epedemic can be heard.\nPanic increased by 10 in all districts",
				effects: [{
					name:"largecity + 10 panic",
					domain:'zone',
					type:'event',
					panic:(10),
					affects:'largecity'
				},
				{ 
					name:"residential + 10 panic",
					domain:'zone',
					type:'event',
					panic:(10),
					affects:'residential'
				},
				{
					name:"park + 10 panic",
					domain:'zone',
					type:'event',
					panic:(10),
					affects:'park'
				},
				{	
					name:"industry + 10 panic",
					domain:'zone',
					type:'event',
					panic:(10),
					affects:'industry'
				}]
			});
	gco.events.push(
			{   name:"Explosion in industry",
				desc:"An explosion has occured!\nPanic increased by 10 in all industry districts",
				effects: [{
					name:"industry + 10 panic",
					domain:'zone',
					type:'event',
					panic:(10),
					affects:'industry'
				}]
			});
	gco.events.push(
			{   name:"Rabid dogs in the park",
				desc:"Rabid dogs roam the park!\nPanic increased by 10 in all parks",
				effects: [{
					name:"park + 10 panic",
					domain:'zone',
					type:'event',
					panic:(10),
					affects:'park'
				}]
			});
	gco.events.push(
			{   name:"Pipe bomb in residential",
				desc:"Viable pipe bomb has been found near a school!\nPanic increased by 10 in all residential districts",
				effects: [{
					name:"residential + 10 panic",
					domain:'zone',
					type:'event',
					panic:(10),
					affects:'residential'
				}]
			});
	gco.events.push(
			{   name:"Gunshots in residential",
				desc:"Gunshots can be heard through a school cooridor!\nPanic increased by 10 in all residential districts",
				effects: [{
					name:"residential + 10 panic",
					domain:'zone',
					type:'event',
					panic:(10),
					affects:'residential'
				}]
			});
	gco.events.push(
			{   name:"Anthrax spread underground",
				desc:"Anthrax has been spread on an undergroud!\nPanic increased by 10 in all financial districts",
				effects: [{
					name:"largecity + 10 panic",
					domain:'zone',
					type:'event',
					panic:(10),
					affects:'largecity'
				}]

			});
	gco.events.push(
			{   name:"Bacteria in residential",
				desc:"Large occurenses of MRSA Staph Bacteria Infections have been reported!\nPanic increased by 10 in all residential districts",
				effects: [{
					name:"residential +10 panic",
					domain:'zone',
					type:'event',
					panic:(10),
					affects:'residential'
				}]
			});
	gco.events.push(
			{   name:"Gunshot in residential",
				desc:"Gunshots can be heard through a school cooridor!\nPanic increased by 10 in all residential districts",
				effects: [{
					name:"residential + 10 panic",
					domain:'zone',
					type:'event',
					panic:(10),
					affects:'residential'
				}]
			});
	
	gco.info_cards.push(
		{
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
   gco.info_cards.push(
		{
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
    gco.info_cards.push({
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
	gco.update_ddbox(document.getElementById("event_show"), gco.events, true)
	
	console.log(gco.events.length);
	gco.update_ddbox(document.getElementById("card_show"), gco.info_cards, true)
	gco.show_event();
	gco.show_card();
	
    gco.draw();
}


/**
Exports the info held by the gco object to the database

@method export_to_database
**/

gco.export_to_database = function(){ // exports the info held by the gco to the database

	gco.update_adjacent_zones();
	

	var game_template = {
		type : "template",
		map : {
			nodes : [],
			zones : []
		},
		players : [],
		info_cards : [],
		events : [],
		author : document.getElementById("template_author").value,
		desc : document.getElementById("template_desc").value,
		timestep : document.getElementById("template_timestep").value,
		eventstep : document.getElementById("template_event_step").value
		
		
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
			adjacent_zones : szone.zones, 
			centroid : szone.centroid

			});
	}
	
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
	game_template.info_cards = gco.info_cards.slice(0);
	game_template.events = gco.events.slice(0);
	
	if(gco.nodes.length == 0){
		console.log("no nodes added");
		window.alert("There are no nodes added to the template, finish the map before trying to export to database");
		return;
	}
	if(gco.zones.length){
		console.log("no zones added");
		window.alert("There are no zones added to the template, finish the map before trying to export to database");
		return;
	}
	if(gco.players.length == 0){
		console.log("no players added");
		window.alert("There are no players added to the template, add some players before trying to export to database");
		return;
	}
	if(gco.info_cards.length == 0){
		console.log("no info cards added");
		window.alert("There are no info cards added, add some info cards before trying to export to database");
		return;
	}
	if(gco.events.length == 0){
		console.log("no events added");
		window.alert("There are no events added, add some events before trying to export to database");
		return;
	}
	if(game_template.author == ""){
		console.log("no author");
		window.alert("There is no author added to the template, add the authors name before trying to export to database");
		return;
	}
	if(game_template.desc == ""){
		console.log("no desc");
		window.alert("There is no map description added, describe the map before trying to export to database");
		return;
	}
	if(isNaN(game_template.timestep)){
		console.log("NaN timstep");
		window.alert("The time for panic increase is not a number, add a real number before trying to export to database");
		return;
	}
	if(isNaN(game_template.eventstep)){
		console.log("NaN eventstep");
		window.alert("The turns before events is not a number, add a real number before trying to export to database");
		return;
	}


	console.log(JSON.stringify(game_template));
	
	
	$.post(remote_ip+':8124/', JSON.stringify(game_template));


}


/**  
Setup canvas 
Configures the height and width of the canvas 
according to the settings variables.

@method setup_canvas

**/
gco.setup_canvas = function(){
    gco.canvas.width = c_width;
    gco.canvas.height = c_height;
    gco.cst.selected_zone = null;
    gco.cst.selected_node = null;
}



/**
Draws a player

@method player_draw
@param Player player
	The player that shall be drawn on the canvas.
@param Context ctx
	The canvas context.
**/
gco.player_draw = function(player, ctx){ // draw a player
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

/**
Draws a node

@method node_draw
@param Node node
	The node that shall be drawn on the canvas.
@param Context ctx
	The canvas context.
**/
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

/**
Draws a roadblock

@method roadblock_draw
@param Node node
	The node that has a roadblock that shall be drawn
@param Context ctx
	The canvas context

**/
gco.roadblock_draw = function(node, ctx){ // draws a roadblock, is not used atm, but kept if roadblocks should be implemented to the expert interface in the future
	ctx.strokeStyle = '#202020';
	ctx.lineWidth = 34;
	var nodes = gco.nodes;
	
	for (var i = 0; i < node.connects_to.length; i++){
		ctx.beginPath();
	    ctx.moveTo(node.x, node.y);
	    
	    ctx.lineTo(((nodes[node.connects_to[i]].x)+node.x)/2, ((nodes[node.connects_to[i]].y)+node.y)/2);
	  
	    
	    ctx.closePath();
	    ctx.stroke();
    }
}
/**
Draws a line between connected nodes to prove that there is a connection between the nodes

@method draw_connections
@param Context ctx
	The canvas context
**/
gco.draw_connections = function(ctx){ // draw the connections between the nodes
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
/**
Draws the background of the canvas

@method background_draw
@param Context ctx
	The canvas context
**/
gco.background_draw = function(ctx){ // draws the background
    ctx.fillStyle="grey";
    ctx.fillRect(0,0, c_width, c_height);
}
/**
Draws a zone

@method zone_draw
@param Zone zone
	The zone that shall be drawn on the canvas
@param Context ctx
	The canvas context
**/
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
	
	
	//draw the images for the zones
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
	

	
	//Draw transparent red corresponding to panic level
	
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


/**
A method to check if a point on the canvas contains the provided player

@method player_contains
@param Player p
	The player that might be in the clicked point
@param Integer mx
	The x coordinate of the clicked point
@param Integer my
	The y coordinate of the clicked point
@return Boolean True if the player is in the point, else false
**/
gco.player_contains = function(p, mx, my) { //checks if the clicked area contains a player
    var pn = gco.nodes[p.node.id];
    return (mx<=(pn.x+player_offsetX[p.id]+player_size))&&
        (mx>=(pn.x+player_offsetX[p.id]-player_size))&&
        (my<=(pn.y+player_offsetY[p.id]+player_size))&&
        (my>=(pn.y+player_offsetY[p.id]-player_size));
}
/**
A method to check if a point on the canvas contains the provided node

@method node_contains
@param Node node
	The node that might be in the clicked point
@param Integer mx
	The x coordinate of the clicked point
@param Integer my
	The y coordinate of the clicked point
@return Boolean True if the node is in the point, else false
**/
gco.node_contains = function(node, mx, my) { // checks if the clicked area containts a node
    return (mx<=(node.x+node_size))&&
        (mx>=(node.x-node_size))&&
        (my<=(node.y+node_size))&&
        (my>=(node.y-node_size));
}
/**
A method to check if a point on the canvas contains the provided zone

@method node_contains
@param Zone z
	The zone that might be in the clicked point
@param Integer mx
	The x coordinate of the clicked point
@param Integer my
	The y coordinate of the clicked point
@return Boolean True if the zone is in the point, else false
**/
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

/**
The Draw method
It iterates over everything in the gco object and draws it by using the other draw_xxxxxx methods 
@method draw
**/
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
		if(i != gco.selected_zone){ // skips drawing the selected zone for now to prevent it from beeing drawn twice
			gco.zone_draw(zone,ctx);
		}
    }
	if(gco.selected_zone > -1){ // draws the selected zone last so the blue lines around it will show 
		gco.zone_draw(zones[gco.selected_zone], ctx);
	}
    
    
    
    
    for (var i = 0; i < nodes.length; i++) {
    	if (nodes[i].has_road_block){
    		node = nodes[i]
    		gco.roadblock_draw(nodes[i], ctx)
    	}
    }
    

    for (var i = 0; i < nodes.length; i++) {
        node = nodes[i];
        gco.node_draw(node, ctx);
    }
    
    
    for (var i = 0; i < players.length; i++) {
        pl = players[i];
        gco.player_draw(pl, ctx);

    }
    

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

/**
Creates a player object and adds it to the game
It will not add a player if some info that is needed is missing or if the game already has reached its maximum number if players

@method add_player
**/
gco.add_player = function(){ // creates a player and adds it to the game.
	
	var player_role = document.getElementById("player_role").value;
	
	
	console.log("role" + player_role);
	
	var player_node = document.getElementById("player_node").value;
	
	console.log("Node: " + player_node);
	if(player_node == -1){
		console.log("invalid node");
		return;
	}
	
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
/**
Changes a selected player to fit the values in the form, if no player is selected then nothing will be changed
@method change_player
**/
gco.change_player = function(){ //changes a selected player

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
	player.node = gco.nodes[node];
	
	gco.draw();
	
}
/**
Creates a connection between the 2 selected nodes
@method create_connection
**/
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
/**
Edits the selected zone so it contains the values provided by the expert form
@method edit_zone
**/
gco.edit_zone = function(){ //edits the selected zone, might need more errorchecking
	if(gco.selected_zone < 0){
		console.log("no Zone selected");
		return;
	}
	
	var zone = gco.zones[gco.selected_zone];
	console.log("editing zone");
	zone.type = document.getElementById("edit_zone_type").value;
	newpeople = document.getElementById("zone_people").value;
	newpanic_level = document.getElementById("zone_panic").value;
	if(isNaN(newpeople) || isNaN(newpanic_level)){
		console.log("either people or panic level was NaN");
		return;
	}
	zone.people = newpeople;
	zone.panic_level = newpanic_level;
	
	gco.draw();
	
	
}
/**
Saves the selected node to use in the create_connection function
@method node_connection
**/
gco.node_connection = function(){ // saves the selected node fot connection purposes

	gco.connection = gco.selected_node; 
	gco.draw();
	
}

/**
Adds a node to the zone node container so that it later can be used to create a zone
@method add_zone_nodes
**/
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
/**
Clears the zone node container
@method clear_zone_nodes
**/
gco.clear_zone_nodes = function() { // clears the selected nodes 
	
	gco.node_container = [];
	gco.draw();
}
/**
Deletes the selected zone, if no zone is selected none will be removed
@method del_selected_zone
**/
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
/**
Deletes the selected player, if no player is selected none will be removed
@method del_selected_player
**/
gco.del_selected_player = function(){ // deletes the selected player
	if(gco.selected_player > -1){
		
		index = gco.selected_player;
		
		
		
		gco.players.splice(index, 1);
		
		gco.selected_player = -1;
		gco.re_id();
		gco.draw();
	}
}
/**
Deletes the selected node, if no node is selected none will be removed
@method del_selected_node
**/
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
		gco.update_ddbox(document.getElementById("player_node"), gco.nodes, false);
		gco.draw();
	}
}
/**
Re Id 
remakes all the ID's of the zones, nodes and players so they all start from id 0
@method re_id
**/
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
/**
Iterates over all the zones to figure out which ones are adjacent
@method update_adjacent_zones
**/
gco.update_adjacent_zones = function () { //iterates over all the zones to figure out which ones are adjacent

	console.log("update adjacent zones " + gco.zones.length );
	
	for (d = 0 ; d < gco.zones.length; d++ ) {
		//console.log("zone: " + d + " zones: " + gco.zones[d].zones);
		
		gco.calculate_adjacent_zones(gco.zones[d]);
	}
}
/**
Calculates the adjacent zones of a provided zone
@method calculate_adjacent_zones
@param Zone zone
	The zone that will be checked for adjacent zones
**/
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
/**
Create zone 
Creates a zone if there is enought nodes in the zone node container and they are all connected
@method create_zone
**/
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
/**
Add an effect to an event
Reads the expert form and puts the values together to make an effect and then puts it in an event
@method event_add_effect
**/
gco.event_add_effect = function(){ // adds an effect to the event, see info_card_add_effect
	ename = document.getElementById("effect_name").value;
	edomain = document.getElementById("effect_domain").value;
	etype = document.getElementById("effect_type").value;
	epanic = document.getElementById("effect_panic").value;
	eaffects = document.getElementById("effect_affects").value;
	
	
	if(ename == ""){
		console.log("Missing name of effect");
		return;
	}
	// errorcheck the input
	
	if(edomain == "zone") {
		if(etype == "panic"){
		
			if(isNaN(epanic)){
				
				console.log("panic is NaN");
				return;
			}
			
		
		}
		else {
			console.log("Domain zone cant have any other types than event or panic");
			return;
		}
	}
	else if (edomain == "player") {
		if(etype == "actions"){
		
			if(isNaN(eaffects)){
				
				
				console.log("affects is NaN");
				return;
			}
		}
	}
	
	gco.event_effects.push( newEffect = {
		name : ename,
		domain : edomain,
		type : etype,
		panic : epanic,
		affects : eaffects
	});
	
	
	
	gco.update_ddbox(document.getElementById("event_effect"), gco.event_effects, false);
	
	
}
/**
Add event
Checks if the event meets the demands to be a event, if so then it adds it to the gco's event container
@method add_event
**/
gco.add_event = function() { // adds the event to the event container
	
	cname = document.getElementById("event_name").value;
	cdesc = document.getElementById("event_desc").value;
	ceff = gco.event_effects.slice(0); 
	
	
	
	
	if(ceff.lenght == 0 || cname == "" || cdesc == ""){
		console.log("something is missing to create a new event");
		return;
	}
	
	
	gco.events.push(newEvent = {
		
		name : cname,
		desc : cdesc,
		effects : ceff
	});

	gco.update_ddbox(document.getElementById("event_show"), gco.events, false);
	document.getElementById("event_show").selectedIndex = gco.events.length -1;
	gco.show_event();
}
/**
Add info card
Checks if the card meets the demands to be a info card, if so then it adds it to the gco's info card container
@method add_info_card
**/
gco.add_info_card = function() { // adds and infocard to the cardcontainer
	
	cname = document.getElementById("card_name").value;
	cdesc = document.getElementById("card_desc").value;
	ceff = gco.rdy_effects.slice(0); 
	
	
	
	
	if(ceff.lenght == 0 || cname == "" || cdesc == ""){
		console.log("something is missing to create a new card");
		return;
	}

	
	gco.info_cards.push(newCard = {
		
		name : cname,
		desc : cdesc,
		effects : ceff
	});
	
	gco.update_ddbox(document.getElementById("card_show"), gco.info_cards, false);
	document.getElementById("card_show").selectedIndex = gco.info_cards.length -1;
	gco.show_card();
}
/**
Add an effect to a info card
Reads the expert form and puts the values together to make an effect and then puts it in a info card
@method card_create_add_effect
**/
gco.card_create_add_effect = function() { // creates an effect and adds it to a card. Mostly the same as adding effects to a event, but wants to keep it like this in case there will be needed differences to the methods

	
	ename = document.getElementById("effect_name").value;
	edomain = document.getElementById("effect_domain").value;
	etype = document.getElementById("effect_type").value;
	epanic = document.getElementById("effect_panic").value;
	eaffects = document.getElementById("effect_affects").value;
	
	// errorcheck the input
	
	if(ename == ""){
		console.log("Missing name of effect");
		return;
	}
	if(edomain == "zone") {
		if(etype == "panic"){
		
			if(isNaN(epanic)){
				
				console.log("panic is NaN");
				return;
			}
			
		}
		else {
			console.log("Domain zone cant have any other types than event or panic");
			return;
		}
	}
	else if (edomain == "player") {
		if(etype == "actions"){
		
			if(isNaN(eaffects)){
				
				
				console.log("affects is NaN");
				return;
			}
		}
	}
	
	gco.rdy_effects.push( newEffect = {
		name : ename,
		domain : edomain,
		type : etype,
		panic : epanic,
		affects : eaffects
	});
	
	
	
	gco.update_ddbox(document.getElementById("card_effect"), gco.rdy_effects, false);
	
}
/**
Removes the selected effect from the selected event
@method event_create_remove_effect
**/
gco.event_create_remove_effect = function() { // removes the selected effect from the selected event
	
	var index = document.getElementById("event_effect").value;

	gco.event_effects.splice(index, 1);
	

	gco.update_ddbox(document.getElementById("event_effect"), gco.event_effects, false);
}
/**
Removes the selected effect from the selected info card
@method card_create_remove_effect
**/
gco.card_create_remove_effect = function() { // removes the selected effect from the selected card
	
	var index = document.getElementById("card_effect").value;

	gco.rdy_effects.splice(index, 1);
	

	gco.update_ddbox(document.getElementById("card_effect"), gco.rdy_effects, false);
}


/**
Updates a dropdownbox so it contains the provided list
@method update_ddbox
@param DropDownBox ddbox
	The ddbox to be updated
@param ArrayList list
	The list to be put in the ddbox
@param Boolean name_same_as_value
	A boolean to tell if the ddbox should show the name of the elements in the list if true, else it shows the index of the element
**/
gco.update_ddbox = function(ddbox, list, name_same_as_value) { // updates a DropDownBox so it contains the provided list, 

	

	if(list.length == 0){
		
		ddbox.options[0] = new Option('none added', '-1');
		ddbox.options.length=1;
		return;
	}
	ddbox.options.length = list.lenght;
	for( var i = 0; i < list.length; i++){
		if(list[i].name){
			ddbox.options[i] = new Option(list[i].name, i);
		}
		else if(name_same_as_value){
			ddbox.options[i] = new Option(list[i], list[i]);
		}
		else{
			ddbox.options[i] = new Option(i, i);
			
		}
	
	}
	
	
}
/**
Zone box update is used to update the label in the zone edit to the selected zone so its easier to know which zone you are editing
@method zone_box_udate
**/
gco.zone_box_update = function(){ // to show what zone is selected during zone editing
	if(gco.selected_zone < 0){
		document.getElementById("zone_id").innerHTML = "no zone selected";
		return;
	}
	
	document.getElementById("zone_id").innerHTML = gco.selected_zone;
}
/**
Show card fills in the values of a card into labels so it can show the name, desc and the effects the card containts
@method show_card
**/
gco.show_card = function(){ // show the info on the selected card. want to edit this later
	
	
	var card = gco.info_cards[document.getElementById("card_show").value];
	
	var effects = "";
	var effects2 = "";
	for(var i  = 0; i < card.effects.length;i++){
		var name = card.effects[i].name;
		if(i < 4){
			
			effects += gco.cut_to_size(name) + "<br>";
		}
		else if( i < 8){
			effects2 += gco.cut_to_size(name) + "<br>";
		}
		else if(i == 8){
			effects2 += "+more";
		}
	}
	document.getElementById("card_name_label").innerHTML = gco.cut_to_size(card.name, 100);
	document.getElementById("card_desc_label").innerHTML = gco.cut_to_size(card.desc, 100);
	document.getElementById("card_effects_label").innerHTML = effects;
	document.getElementById("card_effects_label2").innerHTML = effects2;
	
}
/**
Show event fills in the values of a event into labels so it can show the name, desc and the effects the card contains
@method show_event
**/
gco.show_event = function(){ // show the info on the selected event. 
	
	
	var event = gco.events[document.getElementById("event_show").value];
	
	var effects = "";
	var effects2 = "";
	for(var i  = 0; i < event.effects.length;i++){
		var name = event.effects[i].name;
		if(i < 4){

			effects += gco.cut_to_size(name) + "<br>";
		}
		else if( i < 8){
			effects2 += gco.cut_to_size(name) + "<br>";
		}
		else if(i == 8){
			effects2 += "+more";
		}
	}
	document.getElementById("event_name_label").innerHTML = gco.cut_to_size(event.name, 100);
	document.getElementById("event_desc_label").innerHTML = gco.cut_to_size(event.desc, 100);
	document.getElementById("event_effects_label").innerHTML = effects;
	document.getElementById("event_effects_label2").innerHTML = effects2;
	
}
/**
Move to edit moves the selected event to the event create form so that it can be edited or duplicated
@method event_move_to_edit
**/
gco.event_move_to_edit = function(){ // moves the selected event to edit
	gco.selected_event = document.getElementById("event_show").value;
	var event = gco.events[gco.selected_event];
	
	document.getElementById("event_name").value = event.name;
	document.getElementById("event_desc").value = event.desc;
	
	
	gco.update_ddbox(document.getElementById("event_effect"), event.effects, false);
	
	gco.event_effects = event.effects;
}
/**
Move to edit moves the selected infocard to the card create form so that it can be edited or duplicated
@method card_move_to_edit
**/
gco.card_move_to_edit = function(){ // moves the selected card to edit, 
	gco.selected_card = document.getElementById("card_show").value;
	var card = gco.info_cards[gco.selected_card];
	
	document.getElementById("card_name").value = card.name;
	document.getElementById("card_desc").value = card.desc;
	
	gco.update_ddbox(document.getElementById("card_effect"), card.effects, false);
	
	gco.rdy_effects = card.effects;
}
/**
Delete event deletes the selected event from the event list
@method delete_event
**/
gco.delete_event = function(){ // delete selected event
	
	if(document.getElementById("event_show").value != -1){
		gco.events.splice(document.getElementById("event_show").value, 1);
		gco.selected_event = -1;
		document.getElementById("event_name").value = "";
		document.getElementById("event_desc").value = "";
		document.getElementById("event_name_label").innerHTML = "";
		document.getElementById("event_desc_label").innerHTML = "";
		document.getElementById("event_effects_label").innerHTML = "";
		document.getElementById("event_effects_label2").innerHTML = "";
		gco.update_ddbox(document.getElementById("event_show"), gco.events, false);
		gco.update_ddbox(document.getElementById("event_effect"), [], false);
		gco.event_effects = "";
		gco.show_event();
	}
}
/**
Delete card deletes the selected card from the info card list
@method delete_card
**/
gco.delete_card = function(){ // delete selected card
	
	if(document.getElementById("card_show").value != -1){
		gco.info_cards.splice(document.getElementById("card_show").value, 1);
		gco.selected_card = -1;
		document.getElementById("card_name").value = "";
		document.getElementById("card_desc").value = "";
		document.getElementById("card_name_label").innerHTML = "";
		document.getElementById("card_desc_label").innerHTML = "";
		document.getElementById("card_effects_label").innerHTML = "";
		document.getElementById("card_effects_label2").innerHTML = "";
		gco.update_ddbox(document.getElementById("card_show"), gco.info_cards, false);
		gco.update_ddbox(document.getElementById("card_effect"), [], false);
		gco.rdy_effects = "";
		gco.show_card();
		
	}
}
/**
Edit card takes the selected card and changes its values to the values in the card create form
@method edit_card
**/
gco.edit_card = function(){
	if(gco.selected_card == -1){
		console.log("no card selected");
		return;
	}
	var card = gco.info_cards[gco.selected_card];
	
	card.name = document.getElementById("card_name").value;
	card.desc = document.getElementById("card_desc").value;
	
	
	card.effects = gco.rdy_effects.slice(0);
	
	gco.update_ddbox(document.getElementById("card_show"), gco.info_cards, false);
	document.getElementById("card_show").selectedIndex = gco.info_cards.indexOf(card);
	gco.show_card();
}
/**
Edit event takes teh selected event and changes its values to the values in the event create form 
@method edit_event
**/
gco.edit_event = function(){

	if(gco.selected_event == -1){
		console.log("no event selected");
		return;
	}
	var event = gco.events[gco.selected_event];
	
	event.name = document.getElementById("event_name").value;
	event.desc = document.getElementById("event_desc").value;
	
	event.effects = gco.event_effects.slice(0);
	
	
	
	gco.update_ddbox(document.getElementById("event_show"), gco.events, false);
	document.getElementById("event_show").selectedIndex = gco.events.indexOf(event);
	gco.show_event();

}
/**
Domain change changes the values in the effect type ddbox so it only shows allowed values
@method effect_domain_change
**/
gco.effect_domain_change = function(){ // changes the effect creation to better match the effect domain

	var ddbox = document.getElementById("effect_type");
	
	var change = document.getElementById("effect_domain").value
	list = [];
	
	if(change == "zone"){
		
		list = effect_zone_list;
	}
	else{
		list = effect_people_list;
	}
	gco.update_ddbox(ddbox, list, true);
	
	gco.effect_type_change();
	
}

/**
Type change changes the possebilities of input depending on the type of the effect
@method effect_type_change
**/
gco.effect_type_change = function(){
	var type = document.getElementById("effect_type").value;
	
	var panic_container = document.getElementById("effect_panic_container");
	var affects_container = document.getElementById("effect_affects_container");
	
	switch(type){
		case 'panic':
			panic_container.innerHTML = "<input id=\'effect_panic\' type=\'text\' style=\'width:170px;\'>";
			affects_container.innerHTML = "<select id=\'effect_affects\' style=\'width:170px;\'><option value=\'residential\'>residential</option><option value=\'park\'>park</option><option value=\'industry\'>industry</option><option value=\'largecity\'>largecity</option></select>";
		break;
		
		case 'event':
			panic_container.innerHTML = "<input id=\'effect_panic\' type=\'text\' style=\'width:170px;\'>";
			affects_container.innerHTML = "<select id=\'effect_affects\' style=\'width:170px;\'><option value=\'residential\'>residential</option><option value=\'park\'>park</option><option value=\'industry\'>industry</option><option value=\'largecity\'>largecity</option></select>";
		break;
		
		case 'actions':
			panic_container.innerHTML = "<div id=\'effect_panic\' type=\'info_label\' style='width:170px;'></div>";
			affects_container.innerHTML = "<input id=\'effect_affects\' type=\'text\' style=\'width:170px;\'>";
		break;
		
		case 'nextplayer':
			panic_container.innerHTML = "<div id=\'effect_panic\' type=\'info_label\' style='width:170px;'></div>";
			affects_container.innerHTML = "";
		break;
		
		case 'stealaction':
			panic_container.innerHTML = "<div id=\'effect_panic\' type=\'info_label\' style='width:170px;'></div>";
			affects_container.innerHTML = "";
		break;
		
		case 'blocknextevent':
			panic_container.innerHTML = "<div id=\'effect_panic\' type=\'info_label\' style='width:170px;'></div>"
			affects_container.innerHTML = "";
		break;
	}
	
}

/**
Set canvas listeners sets the mouse listeners for the canvas and the keylistener for the window
@method set_canvas_listener
**/
gco.set_canvas_listener = function(){
    var canvas = gco.canvas,
        cst = gco.cst,
        draw = gco.draw,
        nodes = gco.nodes,
        players = gco.players,
        zones = gco.zones;
        
    canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);

	

	window.addEventListener('keydown',function(e) { // need to edit this so it wont check when canvas is unfocused
		//console.log("key" + e.keyCode);
		
		if(gco.hotkeys){
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
			if(e.keyCode == 88){
				gco.clear_zone_nodes();
			}
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
		gco.update_ddbox(document.getElementById("player_node"), gco.nodes, false);
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
/**
The width metod calculates the width of a sting in pixels
@method width
@return Integer width
	The width of the string in pixels
**/
String.prototype.width = function() { // function to calculate the length of a string in pixels
	var font = '12px arial',
			
		o = $('<div>' + this + '</div>')
				.css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': font})
				.appendTo($('body')),
		w = o.width();

	o.remove();

	return w;
}
/**
Cut to size cuts down a string in length untill it is below a provided amount of pixels 
@method cut_to_size
@param String string 
	The string that should be cut to size  
@param Integer maxwidth 
	The with that the string should be cut to or lover than, default 50, optional 
@return String string
	The string after its been cut to size
**/
gco.cut_to_size = function(string, maxwidth){ // function to cut down string to a spesific(default 50) width of pixels
	var highestwidth = (maxwidth > 50) ? maxwidth : 50;
	var stringwidth = string.width();
	
	if(stringwidth > highestwidth){
		
		
		string = string.slice(0, parseInt(string.length -((stringwidth - highestwidth)/9)));
		return gco.cut_to_size(string, maxwidth);
	}
	return string;
}
/**
Toggle hotkeys sets the boolean gco.hotkeys to either true or false depending on its previous value and then changes the text on 
the buttons so it either hides the hotkeybuttons or no.
@mehtod toggle_hotkeys
**/
gco.toggle_hotkeys = function(){ // toggle hotkeys on or off
	if(gco.hotkeys){
		gco.hotkeys = false;
		document.getElementById("delete_node_button").innerHTML="Delete node";
		document.getElementById("node_connection_button").innerHTML="Start node connection";
		document.getElementById("add_zone_button").innerHTML="Add zone node";
		document.getElementById("clear_zone_nodes_button").innerHTML="Clear zone nodes";
		document.getElementById("create_zone_button").innerHTML="Create zone";
		document.getElementById("delete_zone_button").innerHTML="Delete zone";
		document.getElementById("toggle_hotkeys_button").innerHTML="Turn On hotkeys";
		return;

	}
	gco.hotkeys = true;
	document.getElementById("delete_node_button").innerHTML="Delete node (D)";
	document.getElementById("node_connection_button").innerHTML="Start node connection (C)";
	document.getElementById("add_zone_button").innerHTML="Add zone node (A)";
	document.getElementById("clear_zone_nodes_button").innerHTML="Clear zone nodes (X)";
	document.getElementById("create_zone_button").innerHTML="Create zone (Z)";
	document.getElementById("delete_zone_button").innerHTML="Delete zone (D)";
	document.getElementById("toggle_hotkeys_button").innerHTML="Turn Off hotkeys";

}
