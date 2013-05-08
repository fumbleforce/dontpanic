
/**
* Creates a cookie, which can be retrieved with the read_cookie function.
*
* @method create_cookie
* @param {String} name Cookie name/key
* @param {Object} value The value to be stored
* @param {Integer} days Number of days to store cookie
*/
function create_cookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

/**
* Reads an existing cookie. Returns null if no cookie is found.
*
* @method read_cookie
* @param {String} name Cookie name/key
*/
function read_cookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

/**
* Destroys a cookie.
*
* @method erase_cookie
* @param {String} name Cookie name/key
*/
function erase_cookie(name) {
	createCookie(name,"",-1);
}
