/* Function to check whitelist status of cookie, and delete accordingly. */
function checkCookie(cookie){
  chrome.storage.local.get({
    subDomainWhitelist: [],
    rootDomainWhitelist: []
  }, function(array){

    /* Check if cookie matches element of subdomain whitelist. (example.com or *.example.com) */
    var preserveCookieSubdomain = false;
    for(var i = 0; i < array.subDomainWhitelist.length; i++){
      if(cookie.domain == array.subDomainWhitelist[i] || cookie.domain.endsWith("." + array.subDomainWhitelist[i])){
        preserveCookieSubdomain = true;
        break;
      }
    }

    /* Check if cookie matches element of root domain whitelist. (example.com or .example.com or www.example.com) */
    var preserveCookieRoot = false;
    for(var i = 0; i < array.rootDomainWhitelist.length; i++){
      if(cookie.domain == array.rootDomainWhitelist[i] || cookie.domain == "." + array.rootDomainWhitelist[i] || cookie.domain == "www." + array.rootDomainWhitelist[i]){
        preserveCookieRoot = true;
        break;
      }
    }

    /* Delete cookie if preservation flag not set. */
    if(preserveCookieSubdomain == false && preserveCookieRoot == false){
      var url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path;
      chrome.cookies.remove({"url": url, "name": cookie.name});
      console.log("Removed: " + cookie.domain + " " + url);
    }
  });
}

/* Function to delete cookies using the checkCookie function, and indiscriminately delete all other relevant site data. */
function clearSiteData(){
  chrome.storage.local.get('configured', function(check){

    /* Check if extension has been configured. This prevents the extension from removing all cookies on installation. */
    if(check.configured){

      /* Pass all cookies, one-by-one, to the checkCookie function. */
      chrome.cookies.getAll({}, function(allCookies){
        for(var i = 0; i < allCookies.length; i++){
          checkCookie(allCookies[i]);
        }
      });

      /* Delete various other forms of site data, along with history and cache depending on user preference, indiscriminately. */
      chrome.browsingData.remove({
        "originTypes": {
          "unprotectedWeb": true,
          "protectedWeb": true
        }
      }, {
        "appcache": true,
        "cacheStorage": true,
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

/* Open extension options page on installation. */
chrome.runtime.onInstalled.addListener(function(details){
  if(details.reason == "install"){
    chrome.runtime.openOptionsPage();
  }
});


/* Run clearSiteData function on extension toolbar icon click. */
chrome.browserAction.onClicked.addListener(function(){
  clearSiteData();
});

/* Run clearSiteData function on extension load (on start-up). */
clearSiteData();
