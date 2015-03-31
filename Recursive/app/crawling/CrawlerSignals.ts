/// <reference path="../../app.ts" />

class CrawlerSignal {

    handlers: { (crawler:Crawler): void; }[] = [];
    onceHandlers: { (crawler:Crawler): void; }[] = [];

    removeAll() {
        this.handlers = [];
        this.onceHandlers = [];
    }

    add(handler:(crawler:Crawler)=>any) {
        this.handlers.push(handler);
    }

    addOnce(handler:(crawler:Crawler)=>any) {
        this.onceHandlers.push(handler);
    }
    
    dispatch(crawler:Crawler) {
        this.handlers.forEach(h=>h(crawler));
        this.onceHandlers.forEach(h=>h(crawler));
        this.onceHandlers = [];
    }
}

class CrawlerFileSignal {

    handlers: { (f: CrawlerFile): void; }[] = [];
    onceHandlers: { (f: CrawlerFile): void; }[] = [];

    removeAll() {
        this.handlers = [];
        this.onceHandlers = [];
    }

    add(handler: (f: CrawlerFile) =>any) {
        this.handlers.push(handler);
    }

    addOnce(handler: (f: CrawlerFile) =>any) {
        this.onceHandlers.push(handler);
    }

    dispatch(f: CrawlerFile) {
        this.handlers.forEach(h=>h(f));
        this.onceHandlers.forEach(h=>h(f));
        this.onceHandlers = [];
    }
}