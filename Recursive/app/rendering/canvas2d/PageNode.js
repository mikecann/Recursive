var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PageNode = (function (_super) {
    __extends(PageNode, _super);
    function PageNode(crawler, renderer) {
        var _this = this;
        _super.call(this, renderer);
        this.requiresRefresh = new Signal0();
        this.crawler = crawler;
        this.icon = images.getImage("images/document-clock.png");
        this.inCameraSpace = false;
        crawler.crawlError.addOnce(function (c) {
            _this.icon = images.getImage("images/document-smiley-sad.png");
            _this.requiresRefresh.dispatch();
        });
        crawler.crawlComplete.addOnce(function (c) {
            _this.icon = images.getImage("images/document-smiley.png");
            _this.requiresRefresh.dispatch();
        });
    }
    return PageNode;
})(RenderNode);
//@ sourceMappingURL=PageNode.js.map
