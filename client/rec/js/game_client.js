/*  Game and canvas variables

    These are global for now, but TODO SHOULD be encapsulated.
*/
var players, 
    nodes,
    zones,
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
    canvas.width = 1000;
    canvas.height = 800;
}

function player_draw(player, ctx){
    if (player.x === undefined) player.x = nodes[player.node].x;
    if (player.y === undefined) player.y = nodes[player.node].y;
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player_size, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
}

function node_draw(node, ctx){
    if (node.info_center){
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

function zone_draw(zone, ctx){
    ctx.beginPath();
    ctx.moveTo(nodes[zone.nodes[0]].x, nodes[zone.nodes[0]].y);
    for (var j = 1; j < zone.nodes.length; j++){
        ctx.lineTo(nodes[zone.nodes[j]].x, nodes[zone.nodes[j]].y);
    }
    ctx.lineTo(nodes[zone.nodes[0]].x, nodes[zone.nodes[0]].y);
    ctx.closePath();
    ctx.fillStyle = zone.color;
    ctx.fill();
}

function player_contains(player, mx, my) {
    var dx = mx-nodes[player.node].x
    var dy = my-nodes[player.node].y
    return dx*dx+dy*dy <= player_size*player_size;
}

function node_contains(node, mx, my) {
    var dx = mx-node.x
    var dy = my-node.y
    return dx*dx+dy*dy <= node_size*node_size;
}

function draw(){
    var to_node = {},
        node = {},
        zone = {},
        pl;
        
    for (var i = 0; i < zones.length; i++) {
        zone = zones[i];
        zone_draw(zone,ctx);
    }

    for (var i = 0; i < nodes.length; i++) {
        node = nodes[i];
        node_draw(node, ctx);
        
        for (var j = 0; j < nodes[i].connects_to.length; j++) {
            to_node = node.connects_to[j];
            ctx.lineWidth = 15;
            ctx.strokeStyle = "gray";
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(to_node.x, to_node.y);
            ctx.stroke();
        }
    }
    
    
    for (var i = 0; i < players.length; i++) {
        pl = players[i];
        player_draw(pl, ctx);
    }
    
    

}


function set_canvas_listener(){
 
    canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);

    canvas.addEventListener('mousedown', function(e) {
        var mx = e.clientX,
            my = e.clientY,
            selected;
        
        for (var i = 0; i < players.length; i++) {
            if (player_contains(players[i], mx, my)) {
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
            var mx = e.clientX,
            my = e.clientY;
            cst.selection.x = mx - cst.dragoffx;
            cst.selection.y = my - cst.dragoffy;   
            draw();
        }
    }, true);//end mousemove listener
    
    canvas.addEventListener('mouseup', function(e) {
        var mx = e.clientX,
            my = e.clientY;
                
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
                    return;
                }
            }
            cst.selection.x = nodes[cst.selection.node].x
            cst.selection.y = nodes[cst.selection.node].y
            cst.selection = null;
            cst.dragging = false;
            draw();
        }
        
    }, true);//end mouseup listener
    
}//end set canvas listener




