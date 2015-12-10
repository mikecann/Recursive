var Renderer = (function () {
    function Renderer(canvasId, graph) {
        var _this = this;
        this.isRendering = true;
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
        this.camera = new Camera("#" + canvasId);
        //this.camera.pos.x = window.innerWidth / 2;
        //this.camera.pos.y = window.innerHeight / 2;
        this.graph = graph;
        this.graph.crawlerAdded.add(function (c) { return _this.onCrawlerAdded(c); });
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.physics = new Physics(this.context);
        $(this.canvas).mousemove(function (e) { return _this.onMouseMoved(e); });
        $(this.canvas).disableSelection();
        $(this.canvas).mousedown(function (e) { return e.preventDefault(); });
        $(this.canvas).mouseup(function (e) { return _this.onMouseUp(e); });
        //$(this.canvas).bind("contextmenu", function (e) { e.preventDefault(); return false; });
        window.addEventListener('resize', function () {
            _this.canvas.width = window.innerWidth;
            _this.canvas.height = window.innerHeight;
        }, false);
        requestAnimationFrame(function () { return _this.draw(); });
        this.reset();
    }
    Renderer.prototype.reset = function () {
        this.nodes = [];
        //this.camera.pos.x = window.innerWidth / 2;
        //this.camera.pos.y = window.innerHeight / 2;
    };
    Renderer.prototype.onCrawlerAdded = function (c) {
        var n = null;
        // Is this the very first node?
        if (!c.parent) {
            n = new HostNode(c, null, this);
            n.updatePosition(window.innerWidth / 2, window.innerHeight / 2);
        }
        else {
            var hn = this.findHostNode(c.parsedUrl.host);
            if (hn) {
                hn.addPage(c);
                return;
            }
            else {
                var parentHN = this.findHostNode(c.parent.parsedUrl.host);
                var v = parentHN.pos.copy();
                // Get a vector that positions the new node away from the centre
                v = parentHN.pos.copy().subtract(this.nodes[0].pos).normalize().scale(parentHN.radius).add(parentHN.pos);
                // Could happen
                if (v.x == this.nodes[0].pos.x || v.y == this.nodes[0].pos.y) {
                    v.x += -1 + Math.random() * 2;
                    v.y += -1 + Math.random() * 2;
                }
                n = new HostNode(c, parentHN, this);
                n.updatePosition(v.x, v.y);
                parentHN.addChildHostNode(n);
            }
        }
        this.nodes.push(n);
    };
    Renderer.prototype.findHostNode = function (withHost) {
        for (var i = 0; i < this.nodes.length; i++) {
            var hn = this.nodes[i];
            if (hn.crawler.parsedUrl.host == withHost)
                return hn;
        }
        return null;
    };
    Renderer.prototype.onMouseUp = function (e) {
        // left
        if (this.mouseOverNode && this.camera.distanceMouseMovedSinceButtonWentDown < 2) {
            if (e.which == 1) {
                var crawlersForThisHost = graph.getAllCrawlersForHost(this.mouseOverNode.crawler.parsedUrl.host);
                crawlersForThisHost.forEach(function (c) {
                    if (c.state == CrawlerSate.INITTED)
                        c.crawl();
                });
                if (crawlersForThisHost.length > 0)
                    graph.state = CrawlGraphState.RUNNING;
            }
            else if (e.which == 3) {
                contextMenu.showContext(this.mouseOverNode.crawler, e.pageX, e.pageY);
                e.preventDefault();
                return false;
            }
        }
        /*
        var parent = this.mouseOverNode?this.mouseOverNode.crawler:null;
        if(!parent && this.nodes.length != 0) parent = this.nodes[0].crawler;
        var c = CrawlerMocks.getRandomCompleteCrawler(parent);
        this.onCrawlerAdded(c);
    
        var from = Math.round(Math.random() * 0);
        var to = from + Math.round(Math.random() * 0);
    
        for (var i = from; i < to; i++) {
            var p = CrawlerMocks.getRandomCompleteCrawler(parent, c.url + "/" + Helpers.randomString(5));
            this.onCrawlerAdded(p);
        }
        */
        return true;
    };
    Renderer.prototype.onMouseMoved = function (e) {
        var _this = this;
        var mpos = new TSM.vec2([e.pageX, e.pageY]);
        this.mouseOverNode = null;
        this.nodes.forEach(function (n) {
            var d = mpos.copy().subtract(n.pos.copy().add(_this.camera.pos).scale(_this.camera.scale));
            n.isMouseOver = false;
            if (d.length() < n.radius * _this.camera.scale) {
                n.isMouseOver = true;
                _this.mouseOverNode = n;
            }
        });
    };
    Renderer.prototype.draw = function () {
        var _this = this;
        stats.begin();
        var now = (new Date).getTime();
        var delta = now - this.lastFrameTime;
        this.lastFrameTime = now;
        this.camera.tick();
        if (this.isRendering) {
            var c = this.context;
            c.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.physics.update();
            if (this.nodes.length > 0) {
                var root = this.nodes[0];
                root.update(delta);
                // Render the lines between the circles
                c.beginPath();
                c.strokeStyle = "black";
                c.lineWidth = 1;
                root.renderLines(c);
                c.closePath();
                c.stroke();
                // Finally let each node do its thing
                root.render(c);
            }
        }
        requestAnimationFrame(function () { return _this.draw(); });
        stats.end();
    };
    return Renderer;
})();
