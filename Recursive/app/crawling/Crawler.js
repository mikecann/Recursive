var CrawlerSate;
(function (CrawlerSate) {
    CrawlerSate[CrawlerSate["INITTED"] = 0] = "INITTED";
    CrawlerSate[CrawlerSate["CRAWLING"] = 1] = "CRAWLING";
    CrawlerSate[CrawlerSate["CRAWL_SUCCESS"] = 2] = "CRAWL_SUCCESS";
    CrawlerSate[CrawlerSate["CRAWL_ERROR"] = 3] = "CRAWL_ERROR";
})(CrawlerSate || (CrawlerSate = {}));
var Crawler = (function () {
    function Crawler(url) {
        this.state = CrawlerSate.INITTED;
        this.parsedLinks = [];
        this.progress = 0;
        this.files = [];
        this.children = [];
        this.inboundCrawlers = [];
        this.crawlError = new CrawlerSignal();
        this.crawlComplete = new CrawlerSignal();
        this.crawlStarted = new CrawlerSignal();
        this.crawlProgress = new CrawlerSignal();
        this.fileAdded = new CrawlerFileSignal();
        this.depth = 0;
        this.handled = false;
        this.url = url;
        this.parsedUrl = Helpers.parseUri(url);
    }
    Crawler.prototype.crawl = function () {
        var _this = this;
        this.state = CrawlerSate.CRAWLING;
        this.crawlStarted.dispatch(this);
        this.handled = false;
        console.log("Crawling: " + this.url);
        $.ajax(this.url, {
            type: 'GET',
            url: this.url,
            error: function (jqXHR, textStatus) { return _this.onError(textStatus); },
            complete: function (data, status) { return status == "success" ? _this.onSuccess(data) : _this.onError("fail whale"); },
        });
    };
    Crawler.prototype.destroy = function () {
        this.crawlError.removeAll();
        this.crawlComplete.removeAll();
        this.crawlProgress.removeAll();
        this.crawlStarted.removeAll();
        this.fileAdded.removeAll();
    };
    Crawler.prototype.addFile = function (fileUrl) {
        var cf = new CrawlerFile(this, fileUrl);
        this.files.push(cf);
        this.fileAdded.dispatch(cf);
    };
    Crawler.prototype.addUserFile = function (fileUrl) {
        var cf = new CrawlerFile(this, fileUrl);
        cf.type = CrawlerFileTypes.USER;
        this.files.push(cf);
        this.fileAdded.dispatch(cf);
    };
    Crawler.prototype.onError = function (textStatus) {
        this.state = CrawlerSate.CRAWL_ERROR;
        this.errorText = textStatus;
        this.crawlError.dispatch(this);
    };
    Crawler.prototype.onSuccess = function (data) {
        this.state = CrawlerSate.CRAWL_SUCCESS;
        this.pageHTML = data.responseText;
        this.crawlComplete.dispatch(this);
    };
    Crawler.prototype.onProgress = function (e) {
        if (e.total == 0)
            this.progress = 100;
        else
            this.progress = (e.loaded / e.total) * 100;
    };
    return Crawler;
})();
