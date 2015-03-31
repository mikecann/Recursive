var CrawlerMocks = (function () {
    function CrawlerMocks() { }
    CrawlerMocks.getRandomCompleteCrawler = function getRandomCompleteCrawler(parent, url) {
        if (typeof parent === "undefined") { parent = null; }
        if (typeof url === "undefined") { url = null; }
        var u = url ? url : "http://" + Helpers.randomString(5) + "." + Helpers.randomString(5) + ".com";
        var c = new Crawler(u);
        c.state = CrawlerSate.CRAWL_SUCCESS;
        if(parent) {
            c.parent = parent;
            c.depth = parent.depth + 1;
        }
        return c;
    }
    return CrawlerMocks;
})();
//@ sourceMappingURL=CrawlerMocks.js.map
