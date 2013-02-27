var SCALE= 10; // Scale in pixels

var nodes = [];
    conn = [
        [1, 2, 3], // 0 
        [0, 4, 6],
        [0, 5, 7],
        [0, 4, 5, 8],
        [1, 3, 9],
        [2, 3, 7, 8], // 5
        [1, 9, 11],
        [2, 5, 10],
        [3, 5, 9, 13],
        [4, 6, 8, 14],
        [7, 12, 13], //10
        [6, 14, 17],
        [10, 15],
        [8, 10, 15, 16],
        [9, 11, 17, 19],
        [13, 16, 18],//15
        [13, 15, 18],
        [11, 14, 20],
        [15, 16],
        [14, 16, 18],
        [17, 19] // 20
           ];
    posx = [
        1*SCALE, 1*SCALE, 3*SCALE, 3*SCALE, 3*SCALE,
        5*SCALE, 5*SCALE, 7*SCALE, 7*SCALE, 7*SCALE,
        9*SCALE, 10*SCALE, 11*SCALE, 11*SCALE, 12*SCALE,
        13*SCALE, 13*SCALE, 13*SCALE, 15*SCALE, 15*SCALE,
        15*SCALE
    ]; 
    posy = [
        5*SCALE, 11*SCALE, 3*SCALE, 7*SCALE, 9*SCALE,
        7*SCALE, 15*SCALE, 3*SCALE, 7*SCALE, 9*SCALE,
        3*SCALE, 15*SCALE, 1*SCALE, 5*SCALE, 11*SCALE,
        3*SCALE, 7*SCALE, 15*SCALE, 8*SCALE, 11*SCALE,
        15*SCALE
    ];

//    conn = [[1, 3],[0, 2, 4],[1, 5],[0, 4],[1, 3, 5],[2, 4]];
    posx = [100, 350, 700, 100, 450, 600];
    posy = [60, 140, 80, 320, 420, 320];
	player_colors = ["blue","red","yellow","grey","purple","brown","green","orange"];

for(var i = 0; i < 21; i++){
		node = new models.node(i, posx[i], posy[i], true, conn[i]);
		nodes.push(node);
}

//test set road block between two nodes
//nodes[1].has_road_block = true;
//nodes[2].has_road_block = true;

//test draw info center on two nodes
//nodes[2].has_information_center = true;
//nodes[4].has_information_center = true;


var zones = [];
/*
zones[0] = new models.zone(0, [0, 1, 4, 3], [1]);
zones[1] = new models.zone(1, [1, 2, 5, 4], [0]);
zones[0].color = "yellow";
zones[1].color = "green";
*/
zones[0] = new models.zone(0, [0, 1, 3, 4], [1, 2, 5]);
zones[1] = new models.zone(1, [0, 2, 3, 5], [0, 3, 4]);
zones[2] = new models.zone(2, [1, 4, 6, 9], [0, 5, 7]);
zones[3] = new models.zone(3, [2, 5, 7], [1, 4, 6]);
zones[4] = new models.zone(4, [3, 5, 8], [1, 5, 6]);
zones[5] = new models.zone(5, [3, 4, 8, 9], [0, 2, 4, 10]);
zones[6] = new models.zone(6, [5, 7, 8, 10, 13], [3, 4, 8, 9]);
zones[7] = new models.zone(7, [6, 9, 11, 14], [2, 11, 12]);
zones[8] = new models.zone(8, [10, 12, 13, 15], [6, 13]);
zones[9] = new models.zone(9, [8, 13, 16], [6, 10, 13]);
zones[10] = new models.zone(10, [8, 9, 16], [5, 9, 11]);
zones[11] = new models.zone(11, [9, 14, 16, 19], [7, 10, 15, 16]);
zones[12] = new models.zone(12, [11, 14, 17], [7, 11, 16]);
zones[13] = new models.zone(13, [13, 15, 16], [8, 9, 14]);
zones[14] = new models.zone(14, [15, 16, 18], [13, 15]);
zones[15] = new models.zone(15, [16, 18, 19], [11, 14]);
zones[16] = new models.zone(16, [14, 17, 19, 20], [11, 12]);

zones[0].color = "aqua";
zones[1].color = "blue";
zones[2].color = "brown";
zones[3].color = "darkblue";
zones[4].color = "darkgreen";
zones[5].color = "indigo";
zones[6].color = "gold";
zones[7].color = "orange";
zones[8].color = "grey";
zones[9].color = "peru";
zones[10].color = "silver";
zones[11].color = "teal";
zones[12].color = "yellow";
zones[13].color = "yellowgreen";
zones[14].color = "tomato";
zones[15].color = "seashell";
zones[16].color = "lightgoldenrodyellow";

var players = [];
player_colors = ["blue","red","yellow","grey","purple","brown","green","orange"];

for(var i = 0; i < 8; i++){
	player = new models.Player(i, "player" + i, 0, player_colors[i], {}, 4);
	players.push(player);
}



