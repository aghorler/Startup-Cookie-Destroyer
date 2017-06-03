function saveOptions(){
	var subDomainArray = document.getElementById('subdomain-whitelist').value.split('\n');
	subDomainArray = subDomainArray.filter(Boolean);
	var rootDomainArray = document.getElementById('domain-only-whitelist').value.split('\n');
	rootDomainArray = rootDomainArray.filter(Boolean);
	var cacheOption = document.getElementById('cache_option').checked;
	var historyOption = document.getElementById('history_option').checked;

	chrome.storage.local.set({
		subDomainWhitelist: subDomainArray,
		rootDomainWhitelist: rootDomainArray,
		clearCache: cacheOption,
		clearHistory: historyOption,
		configured: true
	}, function(){
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		status.style.color = "green";
		setTimeout(function(){
			status.textContent = '';
		}, 750);
	});
}

function restoreOptions(){
	chrome.storage.local.get({
		subDomainWhitelist: [],
		rootDomainWhitelist: [],
		clearCache: false,
		clearHistory: false,
		configured: false
	}, function(items){
		document.getElementById('subdomain-whitelist').value = items.subDomainWhitelist.join("\n");
		document.getElementById('domain-only-whitelist').value = items.rootDomainWhitelist.join("\n");
		document.getElementById('cache_option').checked = items.clearCache;
		document.getElementById('history_option').checked = items.clearHistory;

		if(items.configured){
			document.getElementById("conf-warning").style.display = 'none';
		}
	});
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
