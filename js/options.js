function saveOptions(){
	var subdomianArray = document.getElementById('subdomain-whitelist').value.split('\n');
	var domianOnlyArray = document.getElementById('domain-only-whitelist').value.split('\n');
	chrome.storage.local.set({
		subdomianWhitelist: subdomianArray,
		domainOnlyWhitelist: domianOnlyArray
	}, function(){
		var status = document.getElementById('status');
		status.textContent = 'Whitelists saved.';
		status.style.color = "green";
		setTimeout(function(){
			status.textContent = '';
		}, 750);
	});
}

function restoreOptions(){
	chrome.storage.local.get({
		subdomianWhitelist: [],
		domainOnlyWhitelist: []
	}, function(items){
		document.getElementById('subdomain-whitelist').value = items.subdomianWhitelist.join("\n");
		document.getElementById('domain-only-whitelist').value = items.domainOnlyWhitelist.join("\n");
	});
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
