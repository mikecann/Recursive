var ContextMenuController = (function () {
    function ContextMenuController(layerSelector) {
        this.layer = $(layerSelector);
    }
    ContextMenuController.prototype.showContext = function (forCrawler, x, y) {
        // this.menu.doMenu(x,y);
        var crawlersForThisHost = graph.getAllCrawlersForHost(forCrawler.parsedUrl.host);
        var files = CrawlerFile.getAllFilesFromCrawlers(crawlersForThisHost);
        var numFiles = files.length;
        if (settings.removeDuplicateFiles) {
            numFiles = CrawlerFile.getNonDuplicateFileList(files).length;
        }
        var items = [];
        items.push({
            label: 'Recurse', icon: 'images/icon16.png', action: function () {
                crawlersForThisHost.forEach(function (c) {
                    if (c.state == CrawlerSate.INITTED)
                        c.crawl();
                });
                if (crawlersForThisHost.length > 0)
                    graph.state = CrawlGraphState.RUNNING;
            }
        });
        items.push({
            label: 'View Files (' + numFiles + ')', icon: 'images/documents-stack.png', action: function () {
                filesModal.open(forCrawler);
            }
        });
        items.push({
            label: 'Open Pages (' + crawlersForThisHost.length + ')', icon: 'images/ui-tab--arrow.png', action: function () {
                crawlersForThisHost.forEach(function (c) { return chrome.tabs.create({ 'url': c.url }); });
            }
        });
        this.layer.contextPopup({ pageX: x, pageY: y, items: items });
        //this.layer.trigger({type:"contextmenu", pageX:x, pageY:y});
    };
    return ContextMenuController;
})();
