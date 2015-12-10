    
enum CrawlerSate {
    INITTED,
    CRAWLING,
    CRAWL_SUCCESS,
    CRAWL_ERROR
}

class Crawler {

    state: CrawlerSate = CrawlerSate.INITTED;
    errorText: string;
    pageHTML: string;
    parsedLinks: string[] = [];
    parent: Crawler;
    progress = 0;
    files: CrawlerFile[] = [];
    children: Crawler[] = [];
    inboundCrawlers: Crawler[] = [];
    crawlError = new CrawlerSignal();
    crawlComplete = new CrawlerSignal();
    crawlStarted = new CrawlerSignal();
    crawlProgress = new CrawlerSignal();
    fileAdded = new CrawlerFileSignal();
    depth = 0;
    url: string;
    parsedUrl: URI;
    handled: boolean = false;

    constructor (url: string) {
        this.url = url;
        this.parsedUrl = Helpers.parseUri(url);
    }

    crawl() {
        this.state = CrawlerSate.CRAWLING;      
        this.crawlStarted.dispatch(this);
        this.handled = false;
        console.log("Crawling: " + this.url);        
        $.ajax(this.url, {
            type: 'GET',
            url: this.url,
            error: (jqXHR, textStatus) =>this.onError(textStatus),
            complete: (data, status) => status == "success" ? this.onSuccess(data) : this.onError("fail whale"),
            //progress: (e) => this.onProgress(e)
        });
    }

    destroy() {
        this.crawlError.removeAll();
        this.crawlComplete.removeAll();
        this.crawlProgress.removeAll();
        this.crawlStarted.removeAll();
        this.fileAdded.removeAll();
    }

    addFile(fileUrl: string) {
        var cf = new CrawlerFile(this, fileUrl);
        this.files.push(cf);
        this.fileAdded.dispatch(cf);
    }

    addUserFile(fileUrl: string) {
        var cf = new CrawlerFile(this, fileUrl);
        cf.type = CrawlerFileTypes.USER;
        this.files.push(cf);
        this.fileAdded.dispatch(cf);
    }

    private onError(textStatus: string) {
        this.state = CrawlerSate.CRAWL_ERROR;
        this.errorText = textStatus;
        this.crawlError.dispatch(this);
    }

    private onSuccess(data: any) {
        this.state = CrawlerSate.CRAWL_SUCCESS;
        this.pageHTML = data.responseText;
        this.crawlComplete.dispatch(this);
    }

    private onProgress(e: any) {
        if (e.total == 0) this.progress = 100;
        else this.progress = (e.loaded / e.total) * 100;
    }
}

