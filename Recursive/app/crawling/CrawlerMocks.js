var CrawlerMocks = (function () {
    function CrawlerMocks() {
    }
    CrawlerMocks.getRandomCompleteCrawler = function (parent, url) {
        if (parent === void 0) { parent = null; }
        if (url === void 0) { url = null; }
        var u = url ? url : "http://" + Helpers.randomString(5) + "." + Helpers.randomString(5) + ".com";
        var c = new Crawler(u);
        c.state = CrawlerSate.CRAWL_SUCCESS;
        if (parent) {
            c.parent = parent;
            c.depth = parent.depth + 1;
        }
        return c;
    };
    return CrawlerMocks;
})();
