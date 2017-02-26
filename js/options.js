function saveOptions(){
	var subdomainArray = document.getElementById('subdomain-whitelist').value.split('\n');
	subdomainArray = subdomainArray.filter(Boolean);
	var domainOnlyArray = document.getElementById('domain-only-whitelist').value.split('\n');
	domainOnlyArray = domainOnlyArray.filter(Boolean);
	var cacheOption = document.getElementById('cache_option').checked;
	var historyOption = document.getElementById('history_option').checked;

	chrome.storage.local.set({
		subdomainWhitelist: subdomainArray,
		domainOnlyWhitelist: domainOnlyArray,
		clearCache: cacheOption,
		clearHistory: historyOption
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
		subdomainWhitelist: [],
		domainOnlyWhitelist: [],
		clearCache: false,
		clearHistory: false
	}, function(items){
		document.getElementById('subdomain-whitelist').value = items.subdomainWhitelist.join("\n");
		document.getElementById('domain-only-whitelist').value = items.domainOnlyWhitelist.join("\n");
		document.getElementById('cache_option').checked = items.clearCache;
		document.getElementById('history_option').checked = items.clearHistory;
	});
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
