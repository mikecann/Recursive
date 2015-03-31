var Branch = (function () {
    function Branch() { }
    return Branch;
})();
var HeroController = (function () {
    function HeroController(heroId) {
        var _this = this;
        this.isRendering = true;
        var q = (Helpers.parseUri(window.location.href)).queryKey.url;
        if(q) {
            $('#heroRecurseSearchBox').attr('value', q);
        }
        this.view = $("#" + heroId);
        this.view.click(function () {
            return _this.tree = _this.getBranch(0);
        });
        this.view.find("#heroRecurseButton").click(function (e) {
            $('#urlInput').attr('value', $("#heroRecurseSearchBox").attr('value'));
            $("#goBtn").trigger('click');
            _this.view.hide();
            $("#topBar").show();
            e.preventDefault();
            _this.isRendering = false;
        });
        this.canvas = $("#treeCanvas")[0];
        this.canvas.width = 900;
        this.canvas.height = 530;
        this.maxDepth = 10;
        this.randVarienceStrength = 1 + Math.random();
        this.tree = this.getBranch(0);
        this.lastTime = (new Date()).getTime();
        webkitRequestAnimationFrame(function () {
            _this.randVarienceStrength = 1 + Math.random();
            _this.maxDepth = 10;
            _this.renderTree();
        });
    }
    HeroController.prototype.getBranch = function (ang, parent) {
        if (typeof parent === "undefined") { parent = null; }
        if(parent && parent.depth > this.maxDepth) {
            return null;
        }
        var b = new Branch();
        b.parent = parent;
        b.angle = ang;
        b.age = 0;
        b.depth = parent ? parent.depth + 1 : 0;
        b.branches = [];
        var distFromRootRatio = b.depth / this.maxDepth;
        var numChildren = Math.floor(1 + (b.depth / (2 + Math.random())));
        numChildren = 2;
        var a = Math.abs(ang) + (0.1) * ((1.0 - distFromRootRatio) * 0.99);
        a += Math.random() / 60.0;
        a *= (Math.random() > 0.5 ? -1.0 : 1.0);
        if(b.depth == 0) {
            b.branches.push(this.getBranch(ang, b));
        } else {
            b.branches.push(this.getBranch(a, b));
            if(Math.random() < 0.3) {
                a *= -1.5;
            } else {
                a *= -1;
            }
            if(Math.random() < 0.9) {
                b.branches.push(this.getBranch(a, b));
            }
        }
        b.rand1 = Math.random() * b.depth;
        b.rand2 = Math.random() * (1 - distFromRootRatio);
        return b;
    };
    HeroController.prototype.renderTree = function () {
        var _this = this;
        if(!this.isRendering) {
            return;
        }
        var now = (new Date()).getTime();
        var delta = now - this.lastTime;
        this.lastTime = now;
        var ctx = this.canvas.getContext('2d');
        ctx.save();
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.translate(200 + this.canvas.width / 2, this.canvas.height - 20);
        var renderBranch = function (b) {
            if(!b) {
                return;
            }
            b.age += delta;
            var maxAge = b.depth * 150;
            var ageRatio = Math.min(maxAge, b.age) / maxAge;
            ageRatio = ageRatio * ageRatio;
            var branchLength = ageRatio * (((_this.maxDepth + (b.rand2 * 4) - b.depth + 1) * 6.8) + 10);
            b.angle += Math.sin((now * b.rand1) / 1000) * 0.0006;
            ctx.save();
            ctx.rotate(b.angle);
            ctx.beginPath();
            ctx.lineCap = "round";
            ctx.strokeStyle = "rgba(1,1,1,0.09)";
            ctx.lineWidth = Math.max(30 - b.depth * 4, 1) * ageRatio;
            ctx.moveTo(0, 0);
            ctx.translate(0, -branchLength);
            ctx.lineTo(0, 0);
            ctx.stroke();
            b.branches.forEach(function (bb) {
                return renderBranch(bb);
            });
            ctx.restore();
        };
        renderBranch(this.tree);
        ctx.restore();
        webkitRequestAnimationFrame(function () {
            return _this.renderTree();
        });
    };
    return HeroController;
})();
//@ sourceMappingURL=HeroController.js.map
