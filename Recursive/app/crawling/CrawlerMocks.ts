/// <reference path="../../app.ts" />

class CrawlerMocks {

    static getRandomCompleteCrawler(parent: Crawler = null, url:string=null): Crawler {
        var u = url?url:"http://"+Helpers.randomString(5) + "." + Helpers.randomString(5) + ".com";        
        var c = new Crawler(u);
        c.state = CrawlerSate.CRAWL_SUCCESS;
        if (parent) {
            c.parent = parent;
            c.depth = parent.depth + 1;
        }
        return c;
    }

}
