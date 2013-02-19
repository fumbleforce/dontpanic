
var players, map, settings,
    canvas = document.getElementById("viewport"),
    ctx = canvas.getContext("2d"),
    cst = {};
    //timer = timer??
    
    
function init_game(ps, g_t) {
    players = ps;
    map = g_t.map;
    settings = g_t.settings;
    
    draw();
    
    
    
    
}

function draw(){
    var nodes = map.nodes,
        zones = map.zones,
        to_node = {},
        node = {},
        zone = {};
        
    for (var i = 0; i < nodes.length; i++) {
        node = nodes[i];
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 10, 0, Math.PI*2, true); 
        ctx.closePath();
        ctx.fill();
        
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
        ctx.fillStyle = player[i].color;
        ctx.beginPath();
        ctx.arc(player[i].node.x, player[i].node.y, 5, 0, Math.PI*2, true); 
        ctx.closePath();
        ctx.fill();
    }
    
    
    for (var i = 0; i < zones.length; i++) {
        zone = zones[i];
        ctx.beginPath();
        ctx.moveTo(zone.adjacent_nodes[0].x, zone.adjacent_nodes[0].y);
        for (var j = 1; j < zone.adjacent_nodes.length; j++){
            ctx.lineTo(zone.adjacent_nodes[j].x, zone.adjacent_nodes[j].y);
        }
        ctx.lineTo(zone.adjacent_nodes[0].x, zone.adjacent_nodes[0].y);
        ctx.closePath();
        ctx.fill();
    }
   
    
    //for events
    
    
    //timer
}


function set_canvas_listener(){
 
    canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);

    canvas.addEventListener('mousedown', function(e) {
    var mouse = getMouse(e),
        mx = mouse.x,
        my = mouse.y;
        
    contains(mx, my)
    
    
    for (var i = 0; i < players.length; i++) {
        if(players[i].contains(mx,my)){
        
        // Keep track of where in the object we clicked
        // so we can move it smoothly (see mousemove)
        cstate.dragoffx = mx - mySel.x;
        cstate.dragoffy = my - mySel.y;
        cstate.dragging = true;
        cstate.selection = mySel;
        cstate.valid = false;
        return;
        }
    }
    // havent returned means we have failed to select anything.
    // If there was an object selected, we deselect it
    if (cstate.selection) {
      cstate.selection = null;
      cstate.valid = false; // Need to clear the old selection border
    }
  }, true);
  
  
canvas.addEventListener('mousemove', function(e) {
    if (cstate.dragging){
      var mouse = cstate.getMouse(e);
      // We don't want to drag the object by its top-left corner,
      // we want to drag from where we clicked.
      // Thats why we saved the offset and use it here
      cstate.selection.x = mouse.x - cstate.dragoffx;
      cstate.selection.y = mouse.y - cstate.dragoffy;   
      cstate.valid = false; // Something's dragging so we must redraw
    }
  }, true);
  
  

}





});






