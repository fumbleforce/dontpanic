var Player = function (User, Node, color, Role, info_Cards, actions_left) {
	
	this.User = User;
	this.Node = Node;//Position of the player
	this.color = color;
	this.Role = Role;
	this.info_Cards = info_Cards;
	this.actions_left = actions_left;
	
};

var Position = function(x, y, z){
	
	this.x = x;
	this.y = y;
	this.z = z;
	
};

Position.prototype.setX = function (x) {
	this.x = x;
	//update gui?
};
Position.prototype.setY = function(y) {
	this.y = y;
	//update gui?
}; 
Position.prototype.setZ = function(z) {
	this.z = z;
	//update gui?
};
Person.prototype.setActionsLeft = function (actionsLeft) {
	this.actions_left = actionsLeft;
};

Person.prototype.minusOneAction = function () {
	if (actions_left != 0) {
		this.actions_left -= 1;		
	}
	//update gui?
};

Person.prototype.removeInfoCard = function(Info_card) {
	for (var i = 0; i < info_Cards.length(); i++) {
		if (info_Cards[i] == Info_card) {
			info_Cards.splice(i, 1);
			//update gui?
		}
	}
};

Person.prototype.addInfoCard = function(Info_card) {
	this.info_Cards.splice(0, 1, Info_card);
	//update gui?
};

Person.prototype.updatePosition = function (Node) {
	this.Node = Node;
	//update gui?
};

var Node = function (position, adjacent_zones, is_start_position, connects_to) {
	
	this.position = position;
	this.adjacent_zones = adjacent_zones;
	this.is_start_position = is_start_position;
	this.connects_to = connects_to;
	this.hasInformationCenter = false;
	this.hasRoadBlock = false;
	
};

Node.prototype.addInformationCenter = function () {
	this.hasInformationCenter = true;
	//update gui?
};

Node.prototype.addRoadBlock = function () {
	this.hasRoadBlock = true;
	//update gui?
};

Node.prototype.removeRoadBlock = function () {
	this.hasRoadBlock = false;
	//update gui?
};

var Role = function (title, Effect) {
	this.title = title;
	this.Effect = Effect;
};

var Event = function (text, Effect) {
	this.text = text;
	this.Effect = Effect;
};

var Zone = function (Type, People, nodes, adjacentZones, paniclevel) {
	this.Type = Type;
	this.People = People;
	this.nodes = nodes;
	this.adjacentZones = adjacentZones;
	this.paniclevel = paniclevel;//settes til 0 i starten??
	
};

Zone.prototype.updatePanicLevel (panicLevel) {
	this.panicLevel += panicLevel;		
	if (panicLevel >= 50) {
		this.panicLevel == 50;
		//send beskjed om maks panikk
	}
};

Zone.prototype.movePeople = function (people, toZone) {
	for (var i = 0; i < this.adjacentZones.length(); i++) {
		//hvis zonen er nabo kan du flytte
		if (adjacentZones[i] == toZone) {
			this.people -= people;
			toZone.people += people;
		}
		else {
			//error message to gui
		}
	}
};

