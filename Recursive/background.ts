declare var chrome: any;


chrome.pageAction.onClicked.addListener((tab:any) => {

    chrome.tabs.create({url: chrome.extension.getURL('app.htm?url='+encodeURI(tab.url))}, function(tab) {
        // Tab opened.
    });

});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    var url: String = tab.url;
    if (url.indexOf("http://") == -1 && url.indexOf("https://") == -1) { }
    else chrome.pageAction.show(tabId);
});
