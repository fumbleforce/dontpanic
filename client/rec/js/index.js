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
	
	if (d){
		for (var i = 0; i < d.length; i++){
			t = d[i];

			cont += "<a href='http://127.0.0.1:8008/game/ onclick='selected_template("+t.id+")'><div class='template-entry clearfix'>";
			
			for (thing in t){ 
				console.log(thing);
				cont += "<div class='template-info'>"+ thing + "</div>";	
			}
			cont += "</div></a>";
		}
		$("#maindiv").html(cont);
	}
	else{
		alert("No templates are available!");
	}
}

function selected_template(id){
	create_cookie("template_id", id, 1);
}















