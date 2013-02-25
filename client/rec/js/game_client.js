/*  Game and canvas variables

    TODO These are global for now, but  SHOULD be encapsulated, along with all the functions. IMPORTANT.
*/
var players, 
    nodes,
    zones,
    c_height = 800,
    c_width = 1000,
    canvas = document.getElementById("viewport"),
    ctx = canvas.getContext("2d"),
    cst = {},
    node_size = 50;
    player_size = 30;
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
}

function player_draw(player, ctx){
    if (player.x === undefined) player.x = nodes[player.node].x;
    if (player.y === undefined) player.y = nodes[player.node].y;
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player_size, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = "brown";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player_size/5, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
    
    //draw player number (for testing at least)
    ctx.fillStyle = "White";
    ctx.font="10px Georgia",
    ctx.fillText(player.id, (player.x-3), (player.y+2));
}

function node_draw(node, ctx){
	//TODO move info center drawing somewhere else?
    if (node.has_information_center){
        ctx.fillStyle = 'white';
        ctx.fillRect(node.x, node.y, 20, 20);
    }
    else{
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node_size, 0, Math.PI*2, true); 
        ctx.closePath();
        ctx.fill();
    }
}

//TODO draw road blocks (one on each node (as specification says) + something on the path between them?)
function roadblock_draw(node, ctx){
	context.fillStyle   = 'green';
	//context.fillRect  (what,to,put,here);
}

function background_draw(ctx){
    ctx.fillStyle="white";
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
}

function player_contains(player, mx, my) {
    return node_contains(nodes[player.node], mx, my);
}

function node_contains(node, mx, my) {
    return (mx<=(node.x+node_size))&&
        (mx>=(node.x-node_size))&&
        (my<=(node.y+node_size))&&
        (my>=(node.y-node_size));
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
    
    //road blocks (move into node draw?)
    for (var i = 0; i < nodes.length; i++) {
    	if (nodes[i].has_road_block){
    		node = nodes[i]
    		roadblock_draw(nodes[i], ctx)
    	}
        
    }
    
    

}


function set_canvas_listener(){
 
    canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);

    canvas.addEventListener('mousedown', function(e) {
        console.log("Mouse is down");
        var mx = e.offsetX,
            my = e.offsetY,
            selected;
            
        if (cst.selection) {
            console.log("clearing selection");
            cst.selection = null;
            draw();
        }
        
        for (var i = 0; i < players.length; i++) {
            console.log(nodes[players[i].node]);
            console.log(""+ mx + " "+ my);
            if (player_contains(players[i], mx, my)) {
                console.log("Clicked on a player");
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
             
        console.log("Mouse released");   
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




