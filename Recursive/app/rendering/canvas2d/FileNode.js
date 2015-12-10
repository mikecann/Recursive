var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
        if (!this.icon)
            return;
        c.drawImage(this.icon, this.pos.x - this.icon.width / 2, this.pos.y - this.icon.height / 2);
    };
    return FileNode;
})(RenderNode);
