/*
class Renderer {

    container: JQuery;
    renderers: any;
    depths: NodeView[][];
    updatedCrawlers: Crawler[];
    nodeCount: number;

    constructor (containerSelector: string) {
        this.renderers = {};
        this.depths = [];
        this.updatedCrawlers = [];
        this.container = $(containerSelector);
        //crawlers.crawlerUpdated = (c:Crawler)=> this.updateCrawler(c);
        setInterval(() =>this.onTick(), 100);
    }

    reset() {
        this.container.empty();
        this.renderers = {};
        this.depths = [];
        this.nodeCount = 0;
    }

    updateCrawler(crawler: Crawler) {
        if(this.updatedCrawlers.indexOf(crawler)==-1)
            this.updatedCrawlers.push(crawler);
    }

    onTick() {

        var newHTML = "";
        var newNodes : NodeView[] = [];

        while (this.updatedCrawlers.length > 0) {
            var c = this.updatedCrawlers.pop();

            if (this.renderers.hasOwnProperty(c.uri.source)) {
                this.renderers[c.uri.source].update();
            }
            else {
                var node = new NodeView(c, "node_"+(this.nodeCount++));
                newHTML += node.getHTML();
                this.renderers[c.uri.source] = node;
                if (!this.depths[c.depth]) this.depths[c.depth] = [];
                this.depths[c.depth].push(node);
                newNodes.push(node);
            }
        }

        this.container.append(newHTML);
        newNodes.forEach(n=>n.postAppend());

        this.repositionNodes();
    }

    repositionNodes() {
        for (var i:number = 0; i < this.depths.length; i++) {
            var nodes = this.depths[i];
            var totalH = nodes.length * 20;
            for (var j: number = 0; j < nodes.length; j++) {
                var node = nodes[j];
                node.view.css({left:i*130, top:(j*20)-(totalH/2)});
            }
        }
    }

}

class NodeView {

    view: JQuery;
    crawler: Crawler;
    id: string;

    //view: JQuery;
    //label: JQuery;
    //progressBar: JQuery;
    //imagesBadge: JQuery;
    //videosBadge: JQuery;
    //soundsBadge: JQuery;

    constructor(crawler : Crawler, id:string) {
        this.crawler = crawler;
        this.id = id;
    }

    getHTML(): string {
        
        var labelTxt = "";
        if (!this.crawler.parent) labelTxt = this.crawler.uri.source;
        else labelTxt = this.crawler.uri.directory;

        labelTxt.length > 30 ? labelTxt.substr(0, 27) + "..." : labelTxt;

        var labelType = '';
        if (this.crawler.state == CrawlerSate.CRAWL_SUCCESS) labelType = 'label-success';
        else if (this.crawler.state == CrawlerSate.CRAWL_ERROR) labelType = 'label-important';

        return "<a id="+this.id+" data-original-title='" + this.crawler.uri.source + "' class='node-view label "+labelType+"'>" + labelTxt + "</a>";
    }

    postAppend() {
        this.view = $("#" + this.id);
        this.view.tooltip();
        this.view.click(e => filesModal.open(this.crawler) );
    }

    update() {
        
        if (this.crawler.state == CrawlerSate.CRAWL_SUCCESS) { this.view.addClass('label-success'); }
        else if (this.crawler.state == CrawlerSate.CRAWL_ERROR)
        {
            console.log('ERRRRRR');
            this.view.attr("data-original-title", this.crawler.pageHTML + "");
            this.view.addClass('label-important');
        }
    }
}

*/ 
