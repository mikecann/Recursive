var CrawlerSignal = (function () {
    function CrawlerSignal() {
        this.handlers = [];
        this.onceHandlers = [];
    }
    CrawlerSignal.prototype.removeAll = function () {
        this.handlers = [];
        this.onceHandlers = [];
    };
    CrawlerSignal.prototype.add = function (handler) {
        this.handlers.push(handler);
    };
    CrawlerSignal.prototype.addOnce = function (handler) {
        this.onceHandlers.push(handler);
    };
    CrawlerSignal.prototype.dispatch = function (crawler) {
        this.handlers.forEach(function (h) {
            return h(crawler);
        });
        this.onceHandlers.forEach(function (h) {
            return h(crawler);
        });
        this.onceHandlers = [];
    };
    return CrawlerSignal;
})();
var CrawlerFileSignal = (function () {
    function CrawlerFileSignal() {
        this.handlers = [];
        this.onceHandlers = [];
    }
    CrawlerFileSignal.prototype.removeAll = function () {
        this.handlers = [];
        this.onceHandlers = [];
    };
    CrawlerFileSignal.prototype.add = function (handler) {
        this.handlers.push(handler);
    };
    CrawlerFileSignal.prototype.addOnce = function (handler) {
        this.onceHandlers.push(handler);
    };
    CrawlerFileSignal.prototype.dispatch = function (f) {
        this.handlers.forEach(function (h) {
            return h(f);
        });
        this.onceHandlers.forEach(function (h) {
            return h(f);
        });
        this.onceHandlers = [];
    };
    return CrawlerFileSignal;
})();
//@ sourceMappingURL=CrawlerSignals.js.map
