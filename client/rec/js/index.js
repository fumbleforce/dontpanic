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
	
	if (d.templates){
		for (var i = 0; i < d.templates.length; i++){
			t = d.templates[i];
			console.log(t);
			cont += "<a href='http://127.0.0.1:8008/game/ onclick='selected_template("+t.id+")'><div class='template-entry clearfix'>"+ 
					"<div class='template-info'>"+ t.id + "</div>"+ 
					"<div class='template-info'>"+ t.desc + "</div>"+ 
					"<div class='template-info'>"+ t.author + "</div>"+ 
					"</div></a>";
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















