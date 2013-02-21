
var players, map, settings, 
    nodes = map.nodes,
    zones = map.zones,
    canvas = document.getElementById("viewport"),
    ctx = canvas.getContext("2d"),
    cst = {};
    //timer = timer??
    
    
function init_game(ps, g_t) {
    players = ps;
    map = g_t.map;
    settings = g_t.settings;
    
    set_canvas_listener();
    draw();
}


function player_draw(player, ctx){
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(nodes[player.node].x, nodes[player.node].y, 5, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
}

function node_draw(node, ctx){
    if (node.info_center){
        ctx.fillStyle = 'white';
        ctx.fillRect(node.x-10, node.y-10, 20, 20);
    }
    else{
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 10, 0, Math.PI*2, true); 
        ctx.closePath();
        ctx.fill();
    }
}

function zone_draw(zone, ctx){
    ctx.beginPath();
    ctx.moveTo(nodes[zone.adjacent_nodes[0]].x, nodes[zone.adjacent_nodes[0]].y);
    for (var j = 1; j < zone.adjacent_nodes.length; j++){
        ctx.lineTo(nodes[zone.adjacent_nodes[j]].x, nodes[zone.adjacent_nodes[j]].y);
    }
    ctx.lineTo(nodes[zone.adjacent_nodes[0]].x, nodes[zone.adjacent_nodes[0]].y);
    ctx.closePath();
    ctx.fill();
}


function draw(){
    var to_node = {},
        node = {},
        zone = {}
        pl;
        
    for (var i = 0; i < nodes.length; i++) {
        node = nodes[i];
        node_draw(node, ctx);
        
        for (var j = 0; j < node[i].connects_to.length; j++) {
            to_node = node.connects_to[j];
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(node_to.x, node_to.y);
            ctx.closePath();
            ctx.stroke();
        }
    }
    
    
    for (var i = 0; i < players.length; i++) {
        pl = players[i];
        player_draw(pl, ctx);
    }
    
    
    for (var i = 0; i < zones.length; i++) {
        zone = zones[i];
        zone_draw(zone,ctx);
    }

}


function set_canvas_listener(){
 
    canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);

    canvas.addEventListener('mousedown', function(e) {
        var mouse = getMouse(e),
            mx = mouse.x,
            my = mouse.y,
            selected;
        
        
        for (var i = 0; i < players.length; i++) {
            if (players[i].contains(mx,my)){
                selected = players[i];
                selected.x = players[i].node.x;
                selected.y = players[i].node.y;
                break;
            }
            

            cst.dragoffx = mx - selected.x;
            cst.dragoffy = my - selected.y;
            cst.dragging = true;
            cst.selection = selected;
            cst.valid = false;
            return;
            
        }
    // havent returned means we have failed to select anything.
    // If there was an object selected, we deselect it
        if (cst.selection) {
            cst.selection = null;
            cst.valid = false;
        }
    }, true);//end mousedown listener
  
  
    canvas.addEventListener('mousemove', function(e) {
        if (cst.dragging){
            var mouse = cst.getMouse(e);
            cst.selection.x = mouse.x - cst.dragoffx;
            cst.selection.y = mouse.y - cst.dragoffy;   
            cst.valid = false; // Something's dragging so we must redraw
        }
    }, true);//end mousemove listener
    
}//end set canvas listener




