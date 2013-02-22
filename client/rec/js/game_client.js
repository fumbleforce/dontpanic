/*  Game and canvas variables

    These are global for now, but TODO SHOULD be encapsulated.
*/
var players, 
    nodes,
    zones,
    canvas = document.getElementById("viewport"),
    ctx = canvas.getContext("2d"),
    cst = {};
    //timer = timer??
    
    
function init_game(ps, g) {
    players = ps;
    zones = g.zones;
    nodes = g.nodes;
    draw();
    set_canvas_listener();
    
}


function player_draw(player, ctx){
    if (player.x === undefined) player.x = nodes[player.node].x;
    if (player.y === undefined) player.y = nodes[player.node].y;
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x, player.y, 5, 0, Math.PI*2, true); 
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

function player_contains(player, mx, my) {
    var dx = mx-nodes[player.node].x
    var dy = my-nodes[player.node].y
    return dx*dx+dy*dy <= 5*5
}

function node_contains(node, mx, my) {
    var dx = mx-node.x
    var dy = my-node.y
    return dx*dx+dy*dy <= 10*10
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
        var mouse = getMouse(e);
        var mx = mouse.x,
            my = mouse.y,
            selected;
        
        for (var i = 0; i < players.length; i++) {
            if (player_contains(players[i], mx, my) {
                selected = players[i];
                selected.x = players[i].node.x;
                selected.y = players[i].node.y;
                cst.dragoffx = mx - selected.x;
                cst.dragoffy = my - selected.y;
                cst.dragging = true;
                cst.selection = selected;
                draw();
                return;
           }
        }

        if (cst.selection) {
            cst.selection = null;
            draw();
        }
    }, true);//end mousedown listener
  
    canvas.addEventListener('mousemove', function(e) {
        if (cst.dragging){
            var mouse = cst.getMouse(e);
            cst.selection.x = mouse.x - cst.dragoffx;
            cst.selection.y = mouse.y - cst.dragoffy;   
            draw();
        }
    }, true);//end mousemove listener
    
    canvas.addEventListener('mouseup', function(e) {
        var mouse = getMouse(e);
        var mx = mouse.x,
            my = mouse.y;
                
        if (cst.dragging && cst.selection.class === 'player') {
            for (var i = 0; i < nodes.length; i++) {
                if (node_contains(nodes[i], mx, my)) {
                    
                    command('move_player', {
                        player : selection,
                        node : nodes[i]
                    });
                    
                    cst.selection = null;
                    cst.dragging = false;
                    draw();
                }
            }
        }
        else {
            cst.selection.x = nodes[cst.selection.node].x
            cst.selection.y = nodes[cst.selection.node].y
            cst.selection = null;
            cst.dragging = false;
            draw();
        }
        
    }, true);//end mouseup listener
    
}//end set canvas listener




