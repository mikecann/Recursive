var Anim = (function () {
    function Anim(img, frameW, frameH) {
        this.frameTime = 1000 / 15;
        this.currentFrame = 0;
        this.img = img;
        this.frameW = frameW;
        this.frameH = frameH;
        this.timeSinceLastFrame = 0;
    }
    Anim.prototype.update = function (delta) {
        this.timeSinceLastFrame += delta;
        if (this.timeSinceLastFrame > this.frameTime) {
            this.timeSinceLastFrame = 0;
            this.currentFrame++;
            var offx = this.currentFrame * this.frameW;
            if (offx >= this.img.width) {
                this.currentFrame = 0;
            }
        }
    };
    Anim.prototype.render = function (c, x, y, w, h) {
        var offx = this.currentFrame * this.frameW;
        c.drawImage(this.img, offx, 0, this.frameW, this.frameH, x, y, w, h);
    };
    return Anim;
})();
