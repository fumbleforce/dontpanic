/*  Game and canvas variables

    TODO These are global for now, but  SHOULD be encapsulated, along with all the functions. IMPORTANT.
*/
var players, 
    nodes,
    zones,
    c_height = 1500,
    c_width = 1500,
    canvas = document.getElementById("viewport"),
    ctx = canvas.getContext("2d"),
    cst = {},
    node_size = 50;
    player_size = 20,
    info_center_size = 35,
    //panic info stuff
    panic_info_size = 40,
    averageX = 0;
    averageY = 0;
    
    
    turn = 0,
    padding = 30,
    //how far from node circumference should player center be (higher = closer to center) must be >1
    offset_distance = node_size*1,
    //where to put the max 8 players on the node (on circle circumference?) yay dirtytrigonometry
    player_offsetX = [0, 
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
    	
    //timer = timer??
    



function init_game(ps, map) {
    console.log("Game initiated");
    players = ps;
    zones = map.zones;
    nodes = map.nodes;
    
    setup_canvas();
    set_canvas_listener();

    draw();

}

function setup_canvas(){
    canvas.width = c_width;
    canvas.height = c_height;
    cst.selected_zone = null;
}

function move_player(p){
    players[p.id].node = p.node;
    players[p.id].x = nodes[p.node].x;
    players[p.id].y = nodes[p.node].y;
    draw();
}

function player_draw(player, ctx){
    if (player.x === undefined) player.x = nodes[player.node].x;
    if (player.y === undefined) player.y = nodes[player.node].y;
    ctx.fillStyle = player.color;
    ctx.beginPath();
    //old drawing
    //ctx.arc(player.x, player.y, player_size, 0, Math.PI*2, true);
    //draw on same node to test offset
    ctx.arc(player.x+player_offsetX[player.id], player.y+player_offsetY[player.id], player_size, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = "brown";
    ctx.beginPath();
    ctx.arc(player.x+player_offsetX[player.id], player.y+player_offsetY[player.id], player_size/5, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
    
    //draw player number (for testing at least)
    ctx.fillStyle = "White";
    ctx.font="10px Georgia",
    ctx.fillText(player.id, player.x+player_offsetX[player.id]-3, player.y+player_offsetY[player.id]+2);
    
    //draw circle to show active player when dragging
}

function node_draw(node, ctx){
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(node.x, node.y, node_size, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();    
    //draw node number
    ctx.fillStyle = "White";
    ctx.font="13px Georgia",
    ctx.fillText(node.id, node.x-3, node.y-15);
    //TODO move info center drawing somewhere else?
    //draw info center
    if (node.has_information_center){
    	ctx.fillStyle = 'steelblue';
        ctx.fillRect(node.x-(info_center_size/2), node.y-(info_center_size/2)+10, info_center_size, info_center_size);
        ctx.fillStyle = 'white';
        ctx.font='20px Georgia',
        //draw i for infocenter, or number for node?
        //
        ctx.fillText("i", node.x-3, node.y+15);
    }
}

//TODO draw road blocks (one on each node (as specification says) + something on the path between them?)
function roadblock_draw(node, ctx){
	ctx.strokeStyle = '#202020';
	ctx.lineWidth = 25;
	for (var i = 0; i < node.connects_to.length; i++){
		ctx.beginPath();
	    ctx.moveTo(node.x, node.y);
	    //maybe: 50% road block to another node with road block (50+50=100), 
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

function background_draw(ctx){
    ctx.fillStyle="lightgray";
    ctx.fillRect(0,0, c_width, c_height);
}

function zone_draw(zone, ctx){
    ctx.beginPath();
    ctx.moveTo(nodes[zone.nodes[0]].x, nodes[zone.nodes[0]].y);
    for (var j = 1; j < zone.nodes.length; j++){
        ctx.lineTo(nodes[zone.nodes[j]].x, nodes[zone.nodes[j]].y);
    }
    ctx.lineTo(nodes[zone.nodes[0]].x, nodes[zone.nodes[0]].y);
    ctx.closePath();
    //Draw outline of zones
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.stroke();
    //Fill zone with respective color
    ctx.fillStyle = zone.color;
    ctx.fill();
    //Add panic info in zones
    //Find center of zones (center of multi-point polygon, might be hard)
    
}

function selection_draw(ctx){
    if (cst.selected_zone !== null){
        var zone = zones[cst.selected_zone];
        ctx.beginPath();
        ctx.moveTo(nodes[zone.nodes[0]].x, nodes[zone.nodes[0]].y);
        for (var j = 1; j < zone.nodes.length; j++){
            ctx.lineTo(nodes[zone.nodes[j]].x, nodes[zone.nodes[j]].y);
        }
        ctx.lineTo(nodes[zone.nodes[0]].x, nodes[zone.nodes[0]].y);
        ctx.closePath();
        ctx.strokeStyle = "green";
        ctx.lineWidth = 40;
        ctx.stroke();
    }
}

function player_contains(p, mx, my) {
    var pn = nodes[p.node];
    return (mx<=(pn.x+player_offsetX[p.id]+player_size))&&
        (mx>=(pn.x+player_offsetX[p.id]-player_size))&&
        (my<=(pn.y+player_offsetY[p.id]+player_size))&&
        (my>=(pn.y+player_offsetY[p.id]-player_size));
}

function node_contains(node, mx, my) {
    return (mx<=(node.x+node_size))&&
        (mx>=(node.x-node_size))&&
        (my<=(node.y+node_size))&&
        (my>=(node.y-node_size));
}

function zone_contains(z, mx, my){
    var n = z.nodes;
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

function draw(){
    var to_node = {},
        node = {},
        zone = {},
        pl;
        
    background_draw(ctx);    
        
    for (var i = 0; i < zones.length; i++) {
        zone = zones[i];
        zone_draw(zone,ctx);
    }
    
    selection_draw(ctx);
    
    //road blocks (move into node draw?)
    //road blocks are now drawn ABOVE zones, but BELOW players and nodes
    for (var i = 0; i < nodes.length; i++) {
    	if (nodes[i].has_road_block){
    		node = nodes[i]
    		roadblock_draw(nodes[i], ctx)
    	}
        
    }

    for (var i = 0; i < nodes.length; i++) {
        node = nodes[i];
        node_draw(node, ctx);
        
        //not needed as of now
//        for (var j = 0; j < nodes[i].connects_to.length; j++) {
//            to_node = node.connects_to[j];
//            ctx.lineWidth = 15;
//            ctx.strokeStyle = "gray";
//            ctx.beginPath();
//            ctx.moveTo(node.x, node.y);
//            ctx.lineTo(to_node.x, to_node.y);
//            ctx.stroke();
//        }
    }
    
    
    for (var i = 0; i < players.length; i++) {
        pl = players[i];
        player_draw(pl, ctx);
    }
    
}// end draw


function set_canvas_listener(){
 
    canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);

    canvas.addEventListener('mousedown', function(e) {
        
        var mx = e.offsetX,
            my = e.offsetY,
            selected;

        cst.selected_zone = null;
        
        if (cst.selection) {
            console.log("clearing selection");
            cst.selection.x = nodes[cst.selection.node].x
            cst.selection.y = nodes[cst.selection.node].y
            cst.selection = undefined;
            cst.dragging = false;
            draw();
        }
        
        
        for (var i = 0; i < players.length; i++) {
            
            if (player_contains(players[i], mx, my)) {
                console.log("Clicked on a player "+players[i].id);
                selected = players[i];
                selected.x = nodes[players[i].node].x;
                selected.y = nodes[players[i].node].y;
                cst.dragoffx = mx - selected.x;
                cst.dragoffy = my - selected.y;
                cst.dragging = true;
                cst.selection = selected;
                draw();
                return;
           }
        }
        
        for (var i = 0; i < zones.length; i++) {
            
            if (zone_contains(zones[i], mx, my)) {
                console.log("Clicked on zone "+i);
                cst.selected_zone = i;
                draw();
                return;
           }
        }
        draw();
        
    }, true);//end mousedown listener
  
    canvas.addEventListener('mousemove', function(e) {
        if (cst.dragging){
            console.log("Mouse is dragging");
            var mx = e.offsetX,
                my = e.offsetY;
            cst.selection.x = mx - cst.dragoffx;
            cst.selection.y = my - cst.dragoffy;   
            draw();
        }
    }, true);//end mousemove listener
    
    canvas.addEventListener('mouseup', function(e) {
        var mx = e.offsetX,
            my = e.offsetY;
             
         
        if (cst.dragging && cst.selection !== undefined) {
            console.log("Mouse let go of player");
            for (var i = 0; i < nodes.length; i++) {
                if (node_contains(nodes[i], mx, my)) {
                    
                    command('move_player', {
                        player_id : cst.selection.id,
                        node_id : i
                    });
                    cst.selection = undefined;
                    cst.dragging = false;
                    draw();
                    return;
                }
            }
            cst.selection.x = nodes[cst.selection.node].x
            cst.selection.y = nodes[cst.selection.node].y
            cst.selection = undefined;
            cst.dragging = false;
            draw();
        }
        
    }, true);//end mouseup listener
    
}//end set canvas listener




