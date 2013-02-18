var game = function (players, settings) {
	
	this.settings = settings;
	this.players = players;
	
};


var player = function (user, node, color, role, info_cards, actions_left) {
	
	this.user = user;
	this.node = node;//Position of the player
	this.color = color;
	this.role = role;
	this.info_cards = info_cards;
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
	if (actions_left != 0) {
		this.actions_left -= 1;		
	}
	//update gui?
};

player.prototype.remove_info_card = function(info_card) {
	for (var i = 0; i < info_cards.length(); i++) {
		if (info_cards[i] == info_card) {
			info_cards.splice(i, 1);
			//update gui?
		}
	}
};

player.prototype.add_info_card = function(info_card) {
	this.info_cards.splice(0, 1, info_card);
	//update gui?
};

player.prototype.update_position = function (Node) {
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

zone.prototype.update_panic_level = function (zone, panic_level) {
	zone.panic_level += paniclevel;		
	if (zone.panic_level >= 50) {
		zone.panic_level == 50;
		//send beskjed om maks panikk
	}
};

zone.prototype.move_people = function (people, to_zone) {
	if (this.zone.people >= people) {
		
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

var map = function (nodes, zones) {
	
	this.nodes = nodes;
	this.zones = zones;
	
};

map.prototype.update_map_panic = function (increase_panic_level) {
	for (var i = 0; i < zones.length; i++) {
		zone.prototype.update_panic_level(zones[i], increase_panic_level);
	}
};

var settings = function (timer_interval) {
	var timer = new timer(timer_interval);
};
