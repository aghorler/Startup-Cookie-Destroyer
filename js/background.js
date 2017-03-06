function removeCookie(cookie){
	chrome.storage.local.get({
		subdomainWhitelist: [],
		domainOnlyWhitelist: []
	}, function(array){
		var subdomainCheck = 0;
		for(var i = 0; i < array.subdomainWhitelist.length; i++){
			if(cookie.domain.endsWith(array.subdomainWhitelist[i])){
				subdomainCheck++;
			}
		}

		var domainCheck = 0;
		for(var i = 0; i < array.domainOnlyWhitelist.length; i++){
			if(cookie.domain == array.domainOnlyWhitelist[i] || cookie.domain == "." + array.domainOnlyWhitelist[i] || cookie.domain == "www." + array.domainOnlyWhitelist[i]){
				domainCheck++;
			}
		}

		if(subdomainCheck == 0 && domainCheck == 0){
			var url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path;
			chrome.cookies.remove({"url": url, "name": cookie.name});
			console.log("Removed: " + cookie.domain + " " + url);
		}
	});
}

function clearSiteData(){
	chrome.storage.local.get('configured', function(check){
		if(check.configured){
			chrome.cookies.getAll({}, function(allCookies){
				for(var i = 0; i < allCookies.length; i++){
					removeCookie(allCookies[i]);
				}
			});

			chrome.browsingData.remove({
				"originTypes": {
					"unprotectedWeb": true,
					"protectedWeb": true
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
				
				chrome.storage.local.get(null, function(option){
					if(option.clearHistory){
						chrome.browsingData.removeHistory({
							"originTypes": {
								"protectedWeb": true,
								"unprotectedWeb": true,
								"extension": true
							}
						}, function(){
							console.log("Cleared history (as per user preference).");
							if(option.clearCache){
								chrome.browsingData.removeCache({
									"originTypes": {
										"protectedWeb": true,
										"unprotectedWeb": true
									}
								}, function(){
									console.log("Cleared cache (as per user preference).");
								});
							}
						});
					}
					else if(option.clearCache){
						chrome.browsingData.removeCache({
							"originTypes": {
								"protectedWeb": true,
								"unprotectedWeb": true
							}
						}, function(){
							console.log("Cleared cache (as per user preference).");
						});
					}
				});
			});
		}
		else{
			console.log("Extension not configured. Clearing aborted.")
		}
	});
}

chrome.runtime.onInstalled.addListener(function(details){
	if(details.reason == "install"){
		chrome.runtime.openOptionsPage();
	}
});

chrome.browserAction.onClicked.addListener(function(){
	clearSiteData();
});

clearSiteData();
