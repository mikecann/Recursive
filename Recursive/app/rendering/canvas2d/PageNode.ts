/// <reference path="../../../app.ts" />

class PageNode extends RenderNode {

    crawler: Crawler;
    pageIcon: IconGroup;
    requiresRefresh = new Signal0();

    constructor (crawler: Crawler, renderer: Renderer) {
        super(renderer);
        this.crawler = crawler;
        this.icon = images.getImage("images/document-clock.png");
        this.inCameraSpace = false;
        crawler.crawlError.addOnce((c) =>{
            this.icon = images.getImage("images/document-smiley-sad.png");
            this.requiresRefresh.dispatch();
        });
        crawler.crawlComplete.addOnce((c) =>{
            this.icon = images.getImage("images/document-smiley.png");
            this.requiresRefresh.dispatch();
        });
    }
            
}