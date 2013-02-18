var game = function (players, settings) {
	
	this.settings = settings;
	this.players = players;
	
};


var player = function (user, node, color, role, actions_left) {
	//trenger vel ikke info cards fra starten? legger til 2 ved gamestart?
	this.user = user;
	this.node = node;//Position of the player
	this.color = color;
	this.role = role;
	this.info_cards = [];
	this.actions_left = actions_left;
	
};

var user = function (username, password, name, email, is_admin) {
	this.username = username;
	this.password = password;
	this.name = name;
	this.email = email;
	this.is_admin = is_admin;
};

var position = function(x, y, z){
	
	this.x = x;
	this.y = y;
	this.z = z;
	
};

position.prototype.set_x = function (x) {
	this.x = x;
	//update gui?
};
position.prototype.set_y = function (y) {
	this.y = y;
	//update gui?
}; 
position.prototype.set_z = function (z) {
	this.z = z;
	//update gui?
};
player.prototype.set_actions_left = function (actions_left) {
	this.actions_left = actions_left;
};

player.prototype.minus_one_action = function () {
	if (this.actions_left !== 0) {
		this.actions_left -= 1;		
	}
	//update gui?
};

player.prototype.remove_info_card = function(info_card) {
	for (var i = 0; i < this.info_cards.length; i++) {
		if (this.info_cards[i] === info_card) {
			this.info_cards.splice(i, 1);
			//update gui?
		}
	}
};

player.prototype.add_info_card = function(info_card) {
	this.info_cards.push(info_card);
	//update gui?
};

player.prototype.move_player = function (node) {
	this.node = node;
	//update gui?
};

var node = function (position, adjacent_zones, is_start_position, connects_to) {
	
	this.position = position;
	this.adjacent_zones = adjacent_zones;
	this.is_start_position = is_start_position;
	this.connects_to = connects_to;
	this.has_information_center = false;
	this.has_road_block = false;
	
};

node.prototype.add_information_center = function () {
	if (this.has_information_center) {
		//error to gui
	}
	else {
		this.has_information_center = true;
		//update gui?		
	}
};

node.prototype.add_road_block = function () {
	if (this.has_road_block) {
		//error to gui
	}
	else {
		this.has_road_block = true;
		//update gui?		
	}
};

node.prototype.remove_road_block = function () {
	this.has_road_block = false;
	//update gui?
};

var role = function (title, effect) {
	this.title = title;
	this.effect = effect;
};

var event = function (text, effect) {
	this.text = text;
	this.effect = effect;
};

var zone = function (type, people, nodes, adjacent_zones, panic_level) {
	this.type = type;
	this.people = people;
	this.nodes = nodes;
	this.adjacent_zones = adjacent_zones;
	this.panic_level = panic_level;//settes til 0 i starten??
};

zone.prototype.update_panic_level = function (panic_level) {
	this.panic_level += panic_level;		
	if (this.panic_level >= 50) {
		this.panic_level == 50;
		//send beskjed om maks panikk
	}
};

zone.prototype.move_people = function (p, to_zone) {
	if (this.zone.people >= p) {
		for (var i = 0; i < this.adjacent_zones.length; i++) {
			//hvis zonen er nabo kan du flytte
			if (adjacent_zones[i] === to_zone) {
				this.people -= people;
				to_zone.people += people;
			}
			else {
				//error message to gui
			}
		}
	}
	else {
		//error 
	}
};


var timer = function (timer_interval) {
	//sets the interval for increased panic in minutes
	setInterval(function(){
		alert("Time interval has passed, the panic is increasing in " +
			"the city!");
	},(interval * 60 * 1000));
};

var info_card = function (text, effect) {
	this.text = text;
	this.effect = effect;
}
var map = function (nodes, zones) {
	
	this.nodes = nodes;
	this.zones = zones;
	
};

var settings = function (timer_interval) {
	var timer = new timer(timer_interval);
};

zone1 = new zone("type", 100, "nodes", "adjacent_zones", 10);
zone2 = new zone("type", 10, "nodes", "adjacent_zones,", "panic_level");
console.log("zone1ppl. " + zone1.people);
console.log("zone2ppl: " + zone2.people);
//zone1.move_people(50, zone2);
console.log("zone1ppl. " + zone1.people);
console.log("zone2ppl: " + zone2.people);

position1 = new position(1,2,3);
position2 = new position(2,1,3);
node1 = new node(position1, "adjacent_zones", "is_start_position", "connects_to");
node2 = new node(position2, "adjacent_zones", "is_start_position", "connects_to");
player1 = new player("user1", node1, "blue", "driver", 4);
info_card1 = new info_card("BOMB!", "+50 pl industrial sectors");

