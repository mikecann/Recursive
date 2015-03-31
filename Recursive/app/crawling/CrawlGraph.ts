/// <reference path="../../app.ts" />

class CrawlGraph {

    root: Crawler;
    crawlerAdded = new CrawlerSignal();
    crawlFinished = new Signal0();
    stateChanged = new Signal0();
    allCrawlers: any = {};
    queuedCrawlers: Crawler[] = [];
    outboundCrawlers: Crawler[] = [];
    parser: CrawlingResultParser = new CrawlingResultParser();
    
    private _state = CrawlGraphState.DEFAULT;
    get state() { return this._state; }
    set state(val) 
    {
        if(val==this._state) return;
         this._state = val;
         this.stateChanged.dispatch();
     }

    constructor () {
        setTimeout(() =>this.onTick(), 30);
    }

    start(url: string) {
        this.reset();
        this.state = CrawlGraphState.RUNNING;

        // We need a protocol
        var parsed = Helpers.parseUri(url);
        if (!parsed.protocol) url = "http://" + url;

        this.root = this.add(url);
        this.root.crawl();
    }

    reset() {
        for (var key in this.allCrawlers) {
            (<Crawler>this.allCrawlers[key]).destroy();
        }
        this.state = CrawlGraphState.DEFAULT;
        this.queuedCrawlers = [];
        this.outboundCrawlers = [];
        this.allCrawlers = {};
    }

    pause() {
        this.state = CrawlGraphState.PAUSED;
    }

    resume() {
        this.state = CrawlGraphState.RUNNING;
    }

    onTick() {
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
        setTimeout(()=>this.onTick(), 16);
    }

    private add(url: string, parent?: Crawler): Crawler {
        var c = new Crawler(url);
        c.parent = parent;
        if (parent) {
            c.depth = parent.depth + 1;
            parent.children.push(c);
        }
        c.crawlStarted.addOnce(c=>this.outboundCrawlers.push(c));
        c.crawlError.addOnce((c) => this.queuedCrawlers.push(c));
        c.crawlComplete.addOnce((c) => this.queuedCrawlers.push(c));
        this.allCrawlers[url] = c;
        //if(c.depth==1) console.log("url: "+url);        
        this.crawlerAdded.dispatch(c);        
        return c;
    }

    private handleReturnedCrawler(c: Crawler) {

        if (c.state != CrawlerSate.CRAWL_ERROR) {
            // Parse the result of the crawler
            var r = this.parser.parse(c);            
            r.files.forEach(f=>c.addFile(f));           
            r.userRegex.forEach(f=>c.addUserFile(f));            
            r.links.forEach(l=>
            {
                // If we have already crawled this link then record that fact but dont follow it
                if (this.allCrawlers.hasOwnProperty(l)) {
                    var existing: Crawler = this.allCrawlers[l];
                    existing.inboundCrawlers.push(c);
                }
                else {
                    var newC = this.add(l, c);
                    if (c.depth < settings.maxCrawlDepth - 1) newC.crawl();
                }
            });

            // To conserve memory ditch the HTML now
            c.pageHTML = null;
        }

        // Done with this crawler
        c.handled = true;
        this.outboundCrawlers.splice(this.outboundCrawlers.indexOf(c), 1);
    }

    getAllCrawlers(): Crawler[] {
        var c = new Crawler[];
        for (var key in this.allCrawlers) c.push(<Crawler>this.allCrawlers[key]);
        return c;
    }

    getAllCrawlersForHost(host: string) {
        var a = new Crawler[];
        this.getAllCrawlers().forEach(c=> (!c.parsedUrl || c.parsedUrl.host != host)?0:a.push(c) );
        return a;
    }
}

enum CrawlGraphState {
    DEFAULT,
    RUNNING,
    PAUSED,
    FINISHED
}