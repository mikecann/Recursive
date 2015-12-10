var CrawlGraph = (function () {
    function CrawlGraph() {
        var _this = this;
        this.crawlerAdded = new CrawlerSignal();
        this.crawlFinished = new Signal0();
        this.stateChanged = new Signal0();
        this.allCrawlers = {};
        this.queuedCrawlers = [];
        this.outboundCrawlers = [];
        this.parser = new CrawlingResultParser();
        this._state = CrawlGraphState.DEFAULT;
        setTimeout(function () { return _this.onTick(); }, 30);
    }
    Object.defineProperty(CrawlGraph.prototype, "state", {
        get: function () { return this._state; },
        set: function (val) {
            if (val == this._state)
                return;
            this._state = val;
            this.stateChanged.dispatch();
        },
        enumerable: true,
        configurable: true
    });
    CrawlGraph.prototype.start = function (url) {
        this.reset();
        this.state = CrawlGraphState.RUNNING;
        // We need a protocol
        var parsed = Helpers.parseUri(url);
        if (!parsed.protocol)
            url = "http://" + url;
        this.root = this.add(url);
        this.root.crawl();
    };
    CrawlGraph.prototype.reset = function () {
        for (var key in this.allCrawlers) {
            this.allCrawlers[key].destroy();
        }
        this.state = CrawlGraphState.DEFAULT;
        this.queuedCrawlers = [];
        this.outboundCrawlers = [];
        this.allCrawlers = {};
    };
    CrawlGraph.prototype.pause = function () {
        this.state = CrawlGraphState.PAUSED;
    };
    CrawlGraph.prototype.resume = function () {
        this.state = CrawlGraphState.RUNNING;
    };
    CrawlGraph.prototype.onTick = function () {
        var _this = this;
        if (this.state == CrawlGraphState.RUNNING) {
            //Helpers.shuffleArray(this.queuedCrawlers);
            var start = (new Date).getTime();
            var diff = (new Date).getTime() - start;
            while (this.queuedCrawlers.length > 0 && diff < 10) {
                this.handleReturnedCrawler(this.queuedCrawlers.shift());
                diff = (new Date).getTime() - start;
            }
            if (this.outboundCrawlers.length == 0 && this.queuedCrawlers.length == 0) {
                console.log("CRAWL FINISHED!");
                this.state = CrawlGraphState.FINISHED;
                this.crawlFinished.dispatch();
            }
        }
        setTimeout(function () { return _this.onTick(); }, 16);
    };
    CrawlGraph.prototype.add = function (url, parent) {
        var _this = this;
        var c = new Crawler(url);
        c.parent = parent;
        if (parent) {
            c.depth = parent.depth + 1;
            parent.children.push(c);
        }
        c.crawlStarted.addOnce(function (c) { return _this.outboundCrawlers.push(c); });
        c.crawlError.addOnce(function (c) { return _this.queuedCrawlers.push(c); });
        c.crawlComplete.addOnce(function (c) { return _this.queuedCrawlers.push(c); });
        this.allCrawlers[url] = c;
        //if(c.depth==1) console.log("url: "+url);        
        this.crawlerAdded.dispatch(c);
        return c;
    };
    CrawlGraph.prototype.handleReturnedCrawler = function (c) {
        var _this = this;
        if (c.state != CrawlerSate.CRAWL_ERROR) {
            // Parse the result of the crawler
            var r = this.parser.parse(c);
            r.files.forEach(function (f) { return c.addFile(f); });
            r.userRegex.forEach(function (f) { return c.addUserFile(f); });
            r.links.forEach(function (l) {
                // If we have already crawled this link then record that fact but dont follow it
                if (_this.allCrawlers.hasOwnProperty(l)) {
                    var existing = _this.allCrawlers[l];
                    existing.inboundCrawlers.push(c);
                }
                else {
                    var newC = _this.add(l, c);
                    if (c.depth < settings.maxCrawlDepth - 1)
                        newC.crawl();
                }
            });
            // To conserve memory ditch the HTML now
            c.pageHTML = null;
        }
        // Done with this crawler
        c.handled = true;
        this.outboundCrawlers.splice(this.outboundCrawlers.indexOf(c), 1);
    };
    CrawlGraph.prototype.getAllCrawlers = function () {
        var c = [];
        for (var key in this.allCrawlers)
            c.push(this.allCrawlers[key]);
        return c;
    };
    CrawlGraph.prototype.getAllCrawlersForHost = function (host) {
        var a = [];
        this.getAllCrawlers().forEach(function (c) { return (!c.parsedUrl || c.parsedUrl.host != host) ? 0 : a.push(c); });
        return a;
    };
    return CrawlGraph;
})();
var CrawlGraphState;
(function (CrawlGraphState) {
    CrawlGraphState[CrawlGraphState["DEFAULT"] = 0] = "DEFAULT";
    CrawlGraphState[CrawlGraphState["RUNNING"] = 1] = "RUNNING";
    CrawlGraphState[CrawlGraphState["PAUSED"] = 2] = "PAUSED";
    CrawlGraphState[CrawlGraphState["FINISHED"] = 3] = "FINISHED";
})(CrawlGraphState || (CrawlGraphState = {}));
