var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var FileNode = (function (_super) {
    __extends(FileNode, _super);
    function FileNode(page, renderer, file) {
        _super.call(this, renderer);
        this.page = page;
        this.icon = images.getImageForFileType(file);
        this.inCameraSpace = false;
    }
    FileNode.prototype.render = function (c) {
        if(!this.icon) {
            return;
        }
        c.drawImage(this.icon, this.pos.x - this.icon.width / 2, this.pos.y - this.icon.height / 2);
    };
    return FileNode;
})(RenderNode);
//@ sourceMappingURL=FileNode.js.map
