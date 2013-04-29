function play(){
	var $md = $("#maindiv");
	$md.html("");

    $.ajax({
        url: 'http://127.0.0.1:8124/',
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
			cont += "<a href='http://127.0.0.1:8008/game/' onclick='selected_template("+t.id+")'><div class='template-entry clearfix'>";
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
		cont += "<a href='http://127.0.0.1:8008/game/' onclick='selected_template("+d.id+")'><div class='template-entry clearfix'>";
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

function selected_template(id){
	console.log("Creating cookie for chosen template: "+id);
	create_cookie("is_gm", false, 1);
	create_cookie("template_id", id, 1);
}


function game_manager(){
	console.log("Creating cookie for GM: ");
	create_cookie("is_gm", true, 1);
}










