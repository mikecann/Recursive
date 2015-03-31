var Camera = (function () {
    function Camera(mouseTargetSelector) {
        var _this = this;
        this.scale = 1;
        this.targetScale = 1;
        this.pos = new TSM.vec2();
        this.vel = new TSM.vec2();
        this.scalePoint = new TSM.vec2();
        this.canvas = $(mouseTargetSelector);
        var isMouseDown = false;
        var startDownPoint = new TSM.vec2();
        var containerStartPos = new TSM.vec2();
        var lastDelta = new TSM.vec2();
        var lastPos = new TSM.vec2();
        this.canvas.mousedown(function (e) {
            isMouseDown = true;
            startDownPoint = new TSM.vec2([
                e.pageX, 
                e.pageY
            ]);
            containerStartPos = _this.pos.copy();
            lastPos = startDownPoint.copy();
            _this.distanceMouseMovedSinceButtonWentDown = 0;
            _this.vel.reset();
        });
        $(window).mouseup(function (e) {
            isMouseDown = false;
            startDownPoint.x = containerStartPos.x = 0;
            startDownPoint.y = containerStartPos.y = 0;
            _this.vel = lastDelta.copy().scale(2);
        });
        this.canvas.mousemove(function (e) {
            if(isMouseDown) {
                var dx = e.pageX - startDownPoint.x;
                var dy = e.pageY - startDownPoint.y;
                lastDelta.x = e.pageX - lastPos.x;
                lastDelta.y = e.pageY - lastPos.y;
                lastPos.x = e.pageX;
                lastPos.y = e.pageY;
                _this.distanceMouseMovedSinceButtonWentDown += lastDelta.length();
                _this.pos.x = containerStartPos.x + dx * (1 / _this.scale);
                _this.pos.y = containerStartPos.y + dy * (1 / _this.scale);
            }
        });
        this.canvas.bind('mousewheel', function (event) {
            event.originalEvent.preventDefault();
            var delta = (event.originalEvent.wheelDelta / 1000) * (_this.scale);
            _this.scalePoint.x = event.originalEvent.pageX;
            _this.scalePoint.y = event.originalEvent.pageY;
            _this.targetScale += delta;
            if(_this.targetScale < 0.01) {
                _this.targetScale = 0.01;
            }
            if(_this.targetScale > 2) {
                _this.targetScale = 2;
            }
        });
    }
    Camera.prototype.tick = function () {
        var d = (this.scale - this.targetScale) * 0.2;
        var before = this.scalePoint.copy().scale(1 / this.scale).add(this.pos);
        this.scale -= d;
        var after = this.scalePoint.copy().scale(1 / this.scale).add(this.pos);
        this.pos.add(after.subtract(before));
    };
    return Camera;
})();
//@ sourceMappingURL=Camera.js.map
