function removeCookie(cookie){
	var subWhitelist = ["github.com", "facebook.com", "youtube.com", "reddit.com"];
	var subCheck = 0;
	for(var i = 0; i < subWhitelist.length; i++){
		if(cookie.domain.endsWith(subWhitelist[i])){
			subCheck++;
		}
	}

	var defWhitelist = ["accounts.google.com", "encrypted.google.com", "google.com"];
	var defCheck = 0;

	for(var i = 0; i < defWhitelist.length; i++){
		if(cookie.domain == defWhitelist[i] || cookie.domain == "." + defWhitelist[i] || cookie.domain == "www." + defWhitelist[i]){
			defCheck++;
		}
	}

	if(subCheck == 0 && defCheck == 0){
		var url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path;
		chrome.cookies.remove({"url": url, "name": cookie.name});
		console.log("Removed: " + cookie.domain + " " + url);
	}
};

function clearCookies(){
	chrome.cookies.getAll({}, function(all_cookies){
		var count = all_cookies.length;

		for(var i = 0; i < count; i++){
			removeCookie(all_cookies[i]);
		}
	});

	chrome.browsingData.remove({
		"originTypes": {
			"unprotectedWeb": true
		}
    }, {
		"fileSystems": true,
		"indexedDB": true,
		"localStorage": true,
		"pluginData": true,
		"webSQL": true,
		"serverBoundCertificates": true,
		"serviceWorkers": true
    }, function(){
		console.log("Cleared all other site data.");
	});
}

clearCookies();
