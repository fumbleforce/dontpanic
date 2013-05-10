/**
* Called by the "play" button on the index page.
* Sends an ajax request to the server to retrieve a list of templates.
*
* @method play
*/
function play(){

	create_cookie("is_gm", false, 1);
    $.ajax({
        url: remote_ip+':8124/templates',
        dataType: "jsonp",
        jsonpCallback: "templates",
        cache: false,
        timeout: 5000,
        success: function(data) {
            console.log("Received data: "+data);
            console.log(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });

}
/**
* Callback from the "play" function.
* Interprets the templates loaded from 
* database and creates a list on the index page.
*
* @method templates
* @param {List} d List of templates
*/
function templates(d){
	var cont = "",
		t;
	console.log(d);
	console.log("Type: " + typeof d);
	var info, desc, author;
	if (d.length){
		for (var i = 0; i < d.length; i++){
			t = JSON.parse(d[i]);
			info = JSON.parse(t.json_string);
			console.log("Template parsed:");
			console.log(info);
			desc = info.desc ? info.desc : "Default template";
			author = info.author ? info.author : "Admin";
			cont += "<a href='"+remote_ip+":8008/game/' onclick='selected_template("+t.id+")'><div class='template-entry clearfix'>";
			cont += "<div class='template-info'>"+ t.id + "</div>";	
			cont += "<div class='template-info'>"+ desc + "</div>";	
			cont += "<div class='template-info'>"+ author + "</div>";	
			cont += "</div></a>";
		}
		$("#maindiv").html(cont);
	}
	else if (typeof d === 'object'){
		info = JSON.parse(d.json_string);
		desc = info.desc ? info.desc : "Default template";
		author = info.author ? info.author : "Admin";
		cont += "<a href='"+remote_ip+":8008/game/' onclick='selected_template("+d.id+")'><div class='template-entry clearfix'>";
		cont += "<div class='template-info'>"+ d.id + "</div>";	
		cont += "<div class='template-info'>"+ desc + "</div>";
		cont += "<div class='template-info'>"+ author + "</div>";	
		cont += "</div></a>";
		$("#maindiv").html(cont);
	}
	else{
		alert("No templates are available!");
	}
}

/**
* Creates a cookie for selected template, when a template is selected.
*
* @method selected_template
* @param {Integer} id Template id
*/
function selected_template(id){
	console.log("Creating cookie for chosen template: "+id);
	create_cookie("is_gm", false, 1);
	create_cookie("template_id", id, 1);
}

/**
* Called by the "replay" button on the index page.
* Sends an ajax request to the server to retrieve a list of replays.
*
* @method replay
*/
function replay(){
	create_cookie("is_gm", false, 1);

	$.ajax({
        url: remote_ip+':8124/replays',
        dataType: "jsonp",
        jsonpCallback: "replays",
        cache: false,
        timeout: 5000,
        success: function(data) {
            console.log("Received data: "+data);
            console.log(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
}

function replays(d){
	var cont = "",
		t;
	console.log(d);
	console.log("Type: " + typeof d);
	var info, desc;
	if (d.length){
		for (var i = 0; i < d.length; i++){
			t = JSON.parse(d[i]);
			info = JSON.parse(t.replay_id);
			console.log("Replay parsed:");
			console.log(info);
			desc = info.desc ? info.desc : "Default replay";
			cont += "<a href='"+remote_ip+":8008/replay/' onclick='selected_replay("+info+")'><div class='template-entry clearfix'>";
			cont += "<div class='template-info'>"+ info + "</div>";	
			cont += "<div class='template-info'>"+ desc + "</div>";	
			cont += "</div></a>";
		}
		$("#maindiv").html(cont);
	}
	else if (typeof d === 'object'){
		info = JSON.parse(d.json_string);
		desc = info.desc ? info.desc : "Default replay";
		cont += "<a href='"+remote_ip+":8008/replay/' onclick='selected_replay("+info+")'><div class='template-entry clearfix'>";
		cont += "<div class='template-info'>"+ info + "</div>";	
		cont += "<div class='template-info'>"+ desc + "</div>";
		cont += "</div></a>";
		$("#maindiv").html(cont);
	}
	else{
		alert(speak("no-avail-replay"));
	}
}

/**
* Creates a cookie for selected replay, when a replay is selected.
*
* @method selected_replay
* @param {Integer} replay_id Replay id
*/
function selected_replay (replay_id) {
	console.log("creating cookie for chosen replay: "+replay_id);
	create_cookie("is_gm", false, 1);
	create_cookie("replay_id", replay_id, 1);
}	


/**
* Called by the "Game Manager" button on the index page.
* Sends an ajax request to the server to retrieve a list of active rooms.
*
* @method game_manager
*/
function game_manager(){
	console.log("Creating cookie for GM: ");
	create_cookie("is_gm", true, 1);
	
	$.ajax({
        url: remote_ip+':8124/game_master',
        dataType: "jsonp",
        jsonpCallback: "game_master",
        cache: false,
        timeout: 5000,
        success: function(data) {
            console.log("Received data: "+data);
            console.log(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });

}

/**
* Callback from the "game_manager" function.
* Interprets the rooms loaded from 
* database and creates a list on the index page.
*
* @method game_master
* @param {List} d List of rooms
*/
function game_master(d){
	var cont = "",
		t;
	console.log(d);
	console.log("Type: " + typeof d);
	var info, desc, author;
	if (d.length){
		for (var i = 0; i < d.length; i++){
			t = JSON.parse(d[i]);
			
			console.log("Room parsed:");
			console.log(t);
			desc = t.desc ? t.desc : speak("default-template");

			cont += "<a href='"+remote_ip+":8008/game/' onclick='selected_game("+t.id+")'><div class='template-entry clearfix'>";
			cont += "<div class='template-info'>"+ t.id + "</div>";	
			cont += "<div class='template-info'>"+ desc + "</div>";	

			cont += "</div></a>";
		}
		$("#maindiv").html(cont);
	}
	/*else if (typeof d === 'object'){
		t = JSON.parse(d);
		console.log("Room parsed:");
		console.log(t);
		desc = t.desc ? t.desc : "Default template";

		cont += "<a href='http://127.0.0.1:8008/game/' onclick='selected_game("+t.id+")'><div class='template-entry clearfix'>";
		cont += "<div class='template-info'>"+ t.id + "</div>";	
		cont += "<div class='template-info'>"+ desc + "</div>";	

		cont += "</div></a>";
		$("#maindiv").html(cont);
	}*/
	else{
		alert(speak("no-active-rooms"));
	}


}

/**
* Creates a cookie for selected room, when a room is selected.
*
* @method selected_game
* @param {Integer} id Room id
*/
function selected_game(id){
	console.log("Creating cookie for chosen game: "+id);
	create_cookie("game_id", id, 1);
}


/**
* Translates the page to the selected language.
*
* @method translate_page
*/
function translate_page(){
	$("#play-btn").html(speak("play"));
	$("#expert-btn").html(speak("expert-interface"));
	$("#gm-btn").html(speak("game-master"));
	$("#replay-btn").html(speak("replay"));
	$("footer").html(speak("footer"));
	$("#title-text").html(speak("title"));
}
translate_page();



