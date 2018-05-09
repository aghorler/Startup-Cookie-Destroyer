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

    if(!items.configured){
      items.configured = true;
    }
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('subdomain-whitelist').addEventListener('change', saveOptions);
document.getElementById('domain-only-whitelist').addEventListener('change', saveOptions);
document.getElementById('cache_option').addEventListener('change', saveOptions);
document.getElementById('history_option').addEventListener('change', saveOptions);
