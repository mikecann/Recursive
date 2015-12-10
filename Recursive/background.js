chrome.pageAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({ url: chrome.extension.getURL('app.htm?url=' + encodeURI(tab.url)) }, function (tab) {
        // Tab opened.
    });
});
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    var url = tab.url;
    if (url.indexOf("http://") == -1 && url.indexOf("https://") == -1) { }
    else
        chrome.pageAction.show(tabId);
});
