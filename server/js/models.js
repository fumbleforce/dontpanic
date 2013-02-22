module.exports = models = {};

models.game = function (players, client, game_template) {
	this.id = 0;
	this.map = game_template.map;
	this.settings = game_template.settings;
	this.players = players;
	this.client = client;
	this.active_player = 0;
	this.turn = 1;
}



models.game.prototype.move_player = function(player_id, node) {
	return this.players[player_id].move_player(node);
}




models.Player = function(id, user, node, color, role, actions_left) {
	this.id = id;
	this.user = user;
	this.node = node;//Position of the player
	this.color = color;
	this.role = role;
	this.info_cards = [];
	this.actions_left = actions_left;
	this.class = 'player';
	
}



models.Player.prototype.set_actions_left = function (actions_left) {
	this.actions_left = actions_left;
}

models.Player.prototype.minus_one_action = function () {
	if (this.actions_left != 0) {
		this.actions_left -= 1;	
		return true;
	}
	return false;
	//update gui?
}

models.Player.prototype.remove_info_card = function(info_card) {
	for (var i = 0; i < this.info_cards.length; i++) {
		if (this.info_cards[i] === info_card) {
			this.info_cards.splice(i, 1);
			//update gui?
		}
	}
}

models.Player.prototype.add_info_card = function(info_card) {
	this.info_cards.push(info_card);
	//update gui?
}

models.Player.prototype.move_player = function (node) {
	if (this.node === node) {
		return false
	} else if (this.node.connects_to.indexOf(node) >= 0) {
		this.node = node;
		this.minus_one_action;
		return true;
	}
	return false;
	//update gui?
}

models.Player.prototype.add_information_center = function () {
	if (this.node.has_information_center){
		return false;
	}
	else if (this.actions_left < 4){ // TODO: finne max antall actions for player
		return false;
	}
	else {
		this.node.has_information_center = true;
		this.set_actions_left(0);
		return true;
	}
}

models.Player.prototype.add_road_block = function () {
	if(this.node.has_road_block){
		return false;
	}
	else if(this.minus_one_action){
		return this.node.add_road_block();
	}
	return false;
}

models.Player.prototype.remove_road_block = function () {
	if(!this.node.has_road_block){
		return false;
	}
	else if(this.minus_one_action){
		return this.node.remove_road_block();
	}
	return false;
}
models.user = function (username, password, name, email, is_admin) {
	this.username = username;
	this.password = password;
	this.name = name;
	this.email = email;
	this.is_admin = is_admin;
}












models.node = function (id, x, y, is_start_position, connects_to) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.is_start_position = is_start_position;
	this.connects_to = connects_to; // Nodes
	this.has_information_center = false;
	this.has_road_block = false;
	
}


models.node.prototype.set_x = function(x) {
	this.x = x;
}
models.node.prototype.set_y = function(y) {
	this.y = y;
}

models.node.prototype.add_information_center = function () {
	if (this.has_information_center) {
		return false;
		//error to gui
	}
	else {
		this.has_information_center = true;
		return true;
		//update gui?		
	}
}

models.node.prototype.add_road_block = function () {
	if (this.has_road_block) {
		return false;
		//error to gui
	}
	else {
		this.has_road_block = true;
		return true;
		//update gui?		
	}
	return true;
}

models.node.prototype.remove_road_block = function () {
	if (this.has_road_block = false) {
		return false;
		//error to gui
	}
	else {
		this.has_road_block = false;
		return true;
		//update gui?
	}	
	return true;
}










models.role = function (title, effect) {
	this.title = title;
	this.effect = effect;
}






models.event = function (text, effect) {
	this.text = text;
	this.effect = effect;
}










models.zone = function (id, nodes, zones) {
	this.id = id;
	this.type = "regular";
	this.people = 50;
	this.nodes = nodes;
	this.adjacent_zones = zones;
	this.panic_level = 0;//settes til 0 i starten??
}



models.zone.prototype.update_panic_level = function (panic_level) {
	this.panic_level += panic_level;		
	if (this.panic_level >= 50) {
		this.panic_level = 50;
		//send beskjed om maks panikk
	} else if (this.panic_level < 0) {
		this.panic_level = 0;
	}
}


models.zone.prototype.dec_panic = function(player) {
	if (player.node.adjacent_zones.indexOf(this) >= 0) {
		this.update_panic_level(-5);
		return true;
	}
	return false;
}
models.zone.prototype.move_people = function(player, to_zone) {
	if (player.node.adjacent_zones.indexOf(this) >= 0 &&
		this.adjacent_zones.indexOf(to_zone) >= 0) {
		this.people -= 5; //TODO: add roles-difference
		to_zone.people += 5;
		return true;
	}
	return false;
}


models.zone.prototype.move_people = function (people, to_zone) {
	if (this.people >= people) {
		for (var i = 0; i < this.adjacent_zones.length; i++) {
			//hvis zonen er nabo kan du flytte
			if (this.adjacent_zones[i] === to_zone) {
				this.people -= people;
				to_zone.people += people;
				return 1;
			}
		}
		//error message to gui
		console.log("The zone is not adjacent!!");
		return 0;
	}
	else {
		//error 
		console.log("There isnt that many people in this zone!!");
	}
}









models.timer = function (timer_interval) {
	//sets the interval for increased panic in minutes
	setInterval(function(){
		alert("Time interval has passed, the panic is increasing in " +
			"the city!");
	},(interval * 60 * 1000));
}







models.info_card = function (text, effect) {
	this.text = text;
	this.effect = effect;
}







models.map = function (nodes, zones) {
	this.nodes = nodes;
	this.zones = zones;
}






models.settings = function (timer_interval) {
	var timer = new timer(timer_interval);
}


