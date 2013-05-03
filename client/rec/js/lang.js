

// The default language
var chosen_lang = "it";

var lang = {
	
	// English
	'en': {
	
		// Button Labels
		'end-game-label' : 'End Game',
		'player-turn-label' : ['Player ','s turn'],
		'turn-label' : 'Turn: ',
		'action-label' : 'Action points left: ',
		'timer-label' : 'Panic increase in: ',

		
		// Game related
		'role_desc' : {
			'coordinator':'info',
			'passer by':'info',
			'crowd manager':'info',
			'operation expert':'info',
			'driver':'info',
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
		
		
	
	
	},
	
	// Italian
	'it': {
	
	},
	
	// Norwegian
	'no': {
		'end-game-label' : 'Avslutt spill',
		'player-turn-label' : 'Spiller 0s tur',
		'turn-label' : 'Runde: 0',
	},
}

var speak = function(label){
	var w = lang[chosen_lang][label];
	if (!w || w === 'undefined' || w === undefined) {
		return "Label not defined";
	}
	return w;
}




