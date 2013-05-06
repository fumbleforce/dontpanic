

/** 
* The chosen language, default set to English
*
* @property chosen_lang
*/
var chosen_lang = "en";

/** 
* List of supported languages
*
* @property supported_lang
*/
var supported_lang = ['en', 'no', 'it'];


/** 
* Object containing all labels.
* Change the text after the colon ( : ) 
* to change the associated label.
*
* @property lang
*/
var lang = {
	
	// English
	'en': {
	
		'none' : ' ',
	
		// Button Labels
		'end-game-label' : 'End Game',
		'player-turn-label' : ['Player ','s turn'],
		'turn-label' : 'Turn: ',
		'action-label' : 'Action points left: ',
		'timer-label' : 'Panic increase in: ',
		'player' : 'Player ',
		
		// Game related
		'role_desc' : {
			'crowd manager':'The Crowd Manager can decrease panic by 10 instead of 5',
			'operation expert':'The Operation Expert can build and remove roadblocks alone',
			'driver':'The Driver can move 10 people between zones instead of 5',
		},
		'role_name' : {
			'crowd manager':'Crowd Manager',
			'operation expert':'Operation Expert',
			'driver':'Driver',
		},
		
		// Actions
		'op-add-road-block' : 'Add road block',
		'op-info-center' : 'Add information center',
		'op-dec-panic' : 'Decrease panic',
		'op-move-people' : 'Move people',
		'op-rem-block' : 'Remove road block',
		'op-next-player' : 'Next player',
		
		
		// Status updates
		'stat-move-people' : 'Moving people from zone ',
		'stat-click-player' : 'Clicked on player ',
		'stat-select-node' : 'Selected node ',
		'stat-select-zone' : 'Selected zone ',
		'stat-moved-people' : 'Moved people to zone ',
		'stat-dragging-player' : 'Dragging player ',
		
		
		// Index
		'play' : 'Play',
		'expert-interface' : 'Expert Interface',
		'game-master' : 'Game Master',
		'replay' : 'Replay',
		
		'footer' : 'A game by Group 10',
		'title' : "Don't Panic",
	
		'default-template' : 'Default template',
		'no-active-rooms' : 'No active rooms!',
		'no-avail-replay' : 'No available replays!',
		
		// Errors
		'player-not-adj' : "Player is not adjacent to zone",
		'not-enough-people' : "Not enough people in zone",
		'panic-too-low' : "The panic is too low to decrease",
		'not-adj-node' : "The node is not adjacent",
		'need-player-node' : "Need another player on node",
		'no-rb' : "No road block on this node",
		'node-has-rb' : "Node already has road block",
		'player-not-node' : "Player is not on this node",
		'has-info' : "Node already has info center",
		'node-not-conn' : 'Node is not connected',
		'player-lacks-action' : "Player doesn't have enough actions",
		'move-same' : "Cannot move to the same node"
		
		
		
	},
	
	
	// Norwegian
	'no': {
		// Button Labels
		'end-game-label' : 'Avslutt',
		'player-turn-label' : ['Spiller ','s tur'],
		'turn-label' : 'Runde: ',
		'action-label' : 'Handlinger igjen: ',
		'timer-label' : 'Panikk øker om: ',
		'player' : 'Spiller ',
		
		// Game related
		'role_desc' : {
			'coordinator':'Koordinerer ting',
			'passer by':'Går forbi',
			'crowd manager':'Passer på massene',
			'operation expert':'Opererer',
			'driver':'Kjører rundt',
		},
		'role_name' : {
			'coordinator':'Koordinator',
			'passer by':'Forbipasserende',
			'crowd manager':'Folkestyrer',
			'operation expert':'Operasjonsekspert',
			'driver':'Sjåfør',
		},
		
		// Actions
		'op-add-road-block' : 'Legg til blokkade',
		'op-info-center' : 'Legg til informasjonssenter',
		'op-dec-panic' : 'Senk panikk',
		'op-move-people' : 'Flytt folk',
		'op-rem-block' : 'Fjern blokkade',
		'op-next-player' : 'Neste spiller',
		
		
		// Status updates
		'stat-move-people' : 'Flytter folk fra sone ',
		'stat-click-player' : 'Trykker på spiller ',
		'stat-select-node' : 'Valgte node ',
		'stat-select-zone' : 'Valgte sone ',
		'stat-moved-people' : 'Flyttet folk til sone ',
		'stat-dragging-player' : 'Flytter spiller ',
		
		// Index
		'play' : 'Spill',
		'expert-interface' : 'Ekspert Grensesnitt',
		'game-master' : 'Spill Herre',
		'replay' : 'Reprise',
		
		'footer' : 'Et spill av gruppe 10',
		'title' : 'Ikke få panikk!',
		
		'default-template' : 'Standard mal',
		'no-active-rooms' : 'Ingen aktive rom!',
		'no-avail-replay' : 'Ingen tilgjengelige repriser!',
		
		// Errors
		'player-not-adj' : "Spiller er ikke i nærheten av sonen",
		'not-enough-people' : "Ikke nok folk i sonen",
		'panic-too-low' : "Panikken er for lav til å senke",
		'not-adj-node' : "Noden er ikke i nærheten",
		'need-player-node' : "Trenger en spiller til på noden",
		'no-rb' : "Ingen veiblokkering i noden",
		'node-has-rb' : "Noden har allerede en blokkering",
		'player-not-node' : "Spilleren er ikke på denne noden",
		'has-info' : "Noden har allerede et info senter",
		'node-not-conn' : 'Noden er ikke koblet til denne',
		'player-lacks-action' : "Spilleren har ikke nok handlinger",
		'move-same' : "Kan ikke flytte til samme node"
	},
	
	
	
	// Italian
	'it': {
		'none' : ' ',
	
		// Button Labels
		'end-game-label' : 'End Game',
		'player-turn-label' : ['Player ','s turn'],
		'turn-label' : 'Turn: ',
		'action-label' : 'Action points left: ',
		'timer-label' : 'Panic increase in: ',
		'player' : 'Player ',
		
		// Game related
		'role_desc' : {
			'crowd manager':'The Crowd Manager can decrease panic by 10 instead of 5',
			'operation expert':'The Operation Expert can build and remove roadblocks alone',
			'driver':'The Driver can move 10 people between zones instead of 5',
		},
		'role_name' : {
			'crowd manager':'Crowd Manager',
			'operation expert':'Operation Expert',
			'driver':'Driver',
		},
		
		// Actions
		'op-add-road-block' : 'Add road block',
		'op-info-center' : 'Add information center',
		'op-dec-panic' : 'Decrease panic',
		'op-move-people' : 'Move people',
		'op-rem-block' : 'Remove road block',
		'op-next-player' : 'Next player',
		
		
		// Status updates
		'stat-move-people' : 'Moving people from zone ',
		'stat-click-player' : 'Clicked on player ',
		'stat-select-node' : 'Selected node ',
		'stat-select-zone' : 'Selected zone ',
		'stat-moved-people' : 'Moved people to zone ',
		'stat-dragging-player' : 'Dragging player ',
		
		
		// Index
		'play' : 'Play',
		'expert-interface' : 'Expert Interface',
		'game-master' : 'Game Master',
		'replay' : 'Replay',
		
		'footer' : 'A game by Group 10',
		'title' : "Don't Panic",
	
		'default-template' : 'Default template',
		'no-active-rooms' : 'No active rooms!',
		'no-avail-replay' : 'No available replays!',
		
		// Errors
		'player-not-adj' : "Player is not adjacent to zone",
		'not-enough-people' : "Not enough people in zone",
		'panic-too-low' : "The panic is too low to decrease",
		'not-adj-node' : "The node is not adjacent",
		'need-player-node' : "Need another player on node",
		'no-rb' : "No road block on this node",
		'node-has-rb' : "Node already has road block",
		'player-not-node' : "Player is not on this node",
		'has-info' : "Node already has info center",
		'node-not-conn' : 'Node is not connected',
		'player-lacks-action' : "Player doesn't have enough actions",
		'move-same' : "Cannot move to the same node"
	},
}















/**
* Translates the given language to chosen language.
* Defaults firsts to the english translation,
* then to "Label not defined"
*
* @method speak
* @param {String} label String to be translated
*/
function speak(label){
	var w = lang[chosen_lang][label];
	if (!w || w === 'undefined' || w === undefined) {
		w = lang['en'][label];
		if (!w || w === 'undefined' || w === undefined) {
			return "Label not defined";
		}
	}
	return w;
}

/**
* Changes the language
*
* @method set_lang
* @param {String} l Language
*/
function set_lang(l){
	if(supported_lang.indexOf(l) === -1){
		chosen_lang = 'en';
	}
	else{
		chosen_lang = l;
	}
	create_cookie('chosen_lang', chosen_lang, 1);
}



