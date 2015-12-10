/// <reference path="../../../app.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
