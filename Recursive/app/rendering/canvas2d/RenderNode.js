var RenderNode = (function () {
    function RenderNode(r) {
        this.pos = new TSM.vec2();
        this.scale = 1;
        this.inCameraSpace = true;
        this.isMouseOver = false;
        this.radius = 16;
        this.renderer = r;
        this.cam = r.camera;
        this.icon = images.unknown;
    }
    RenderNode.prototype.update = function (deta) {
    };
    RenderNode.prototype.updatePosition = function (x, y) {
        this.pos.x = x;
        this.pos.y = y;
    };
    RenderNode.prototype.render = function (c) {
        if (!this.icon)
            return;
        if (this.inCameraSpace) {
            c.drawImage(this.icon, (this.pos.x + this.cam.pos.x - this.icon.width / 2) * this.cam.scale, (this.pos.y + this.cam.pos.y - this.icon.height / 2) * this.cam.scale, this.cam.scale * this.icon.width, this.cam.scale * this.icon.height);
        }
        else {
            c.drawImage(this.icon, this.pos.x - this.icon.width / 2, this.pos.y - this.icon.height / 2);
        }
    };
    return RenderNode;
})();
