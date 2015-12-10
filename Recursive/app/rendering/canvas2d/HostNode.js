var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HostNode = (function (_super) {
    __extends(HostNode, _super);
    function HostNode(crawler, parentNode, renderer) {
        _super.call(this, renderer, crawler.depth, crawler.parent == null);
        this.children = [];
        this.childHostNodes = [];
        this.childHostIndex = 0;
        this.pagesAndFilesIsDirty = false;
        this.isLoading = false;
        this.someChildrenAreLoading = false;
        this.crawler = crawler;
        this.host = crawler.parsedUrl.host;
        this.parentNode = parentNode;
        this.icon = images.getImage("http://www.google.com/s2/favicons?domain=" + encodeURI(this.host));
        this.pagesAndFilesCanvas = document.createElement("canvas");
        this.loadingAnim = new Anim(images.getImage("images/loader4.png", false), 128, 128);
        if (parentNode) {
            this.jointToParent = this.renderer.physics.createJoint(this.body, parentNode.body);
            this.updatePagesAndFiles(0);
            this.updatePhysics();
        }
    }
    HostNode.prototype.addChildHostNode = function (hn) {
        this.childHostNodes.push(hn);
        hn.childHostIndex = this.childHostNodes.length;
        this.pagesAndFilesIsDirty = true;
    };
    HostNode.prototype.addPage = function (c) {
        var _this = this;
        var pn = new PageNode(c, this.renderer);
        pn.requiresRefresh.add(function () { return _this.updatePagesAndFiles(0); });
        this.children.push(pn);
        c.files.forEach(function (cf) { return _this.addFile(pn, cf); });
        c.fileAdded.add(function (cf) { return _this.addFile(pn, cf); });
        this.pagesAndFilesIsDirty = true;
    };
    HostNode.prototype.addFile = function (pn, cf) {
        var indx = this.children.indexOf(pn);
        var fn = new FileNode(pn.crawler, this.renderer, cf);
        this.children.splice(indx, 0, fn);
        this.pagesAndFilesIsDirty = true;
    };
    HostNode.prototype.updatePhysics = function () {
        this.totalRadius = this.radius;
        if (this.childHostNodes.length > 0) {
            // Sort them by size
            var sortedKids = this.childHostNodes.slice(0, this.childHostNodes.length);
            sortedKids.sort(function (a, b) {
                if (a.totalRadius == b.totalRadius)
                    return a.childHostIndex - b.childHostIndex;
                else
                    return a.totalRadius - b.totalRadius;
            });
            var islandDist = 10;
            var ang = 0;
            var layerSepp = islandDist;
            var last = sortedKids[0];
            for (var i = 0; i < sortedKids.length; i++) {
                var child = sortedKids[i];
                var len = child.totalRadius + this.radius + layerSepp;
                var theta = Math.asin((child.totalRadius + islandDist) / len) * 2;
                ang += theta;
                if (ang >= Math.PI * 2) {
                    ang = 0;
                    layerSepp += islandDist + (last.totalRadius * 2);
                }
                len = child.totalRadius + this.radius + layerSepp;
                child.jointToParent.SetLength(len / Physics.SCALE);
                last = child;
                this.totalRadius = Math.max(this.totalRadius, len + child.totalRadius);
            }
        }
        // Update the phyics body
        this.body.GetFixtureList().m_shape.m_radius = this.totalRadius / Physics.SCALE;
        this.body.ResetMassData();
    };
    HostNode.prototype.update = function (delta) {
        _super.prototype.update.call(this, delta);
        this.isLoading = false;
        if (this.crawler.state == CrawlerSate.CRAWLING || this.someChildrenAreLoading)
            this.isLoading = true;
        if (this.isLoading)
            this.loadingAnim.update(delta);
        if (this.pagesAndFilesIsDirty)
            this.updatePagesAndFiles(delta);
        // this should be done only on change really!
        //for (var i = 0; i < this.children.length; i++) this.children[i].update();
        // If there are any child host nodes then update those now too
        for (var i = 0; i < this.childHostNodes.length; i++)
            this.childHostNodes[i].update(delta);
        this.updatePhysics();
    };
    HostNode.prototype.updatePagesAndFiles = function (delta) {
        var r = this.children.length == 0 ? 16 : 24;
        var k = 0;
        var sep = 8;
        this.someChildrenAreLoading = false;
        for (var i = 0; i < this.children.length; i++) {
            var p = this.children[i];
            p.update(delta);
            var circ = 2 * Math.PI * r;
            var d = ((360 * sep) / circ);
            var j = d * k;
            p.pos.x = Math.cos(j * (Math.PI / 180)) * r;
            p.pos.y = Math.sin(j * (Math.PI / 180)) * r;
            k++;
            if ((d * k) > 360) {
                r += 16;
                k = 0;
            }
            if (p instanceof PageNode) {
                var page = p;
                if (page.crawler.state == CrawlerSate.CRAWLING || page.crawler.handled)
                    this.someChildrenAreLoading = true;
            }
        }
        this.radius = r + (this.children.length == 0 ? 0 : 16);
        this.body.SetAwake(true);
        this.childHostNodes.forEach(function (c) { return c.body.SetAwake(true); });
        this.pagesAndFilesCanvas.width = this.radius * 2;
        this.pagesAndFilesCanvas.height = this.radius * 2;
        var c = this.pagesAndFilesCanvas.getContext("2d");
        c.clearRect(0, 0, this.pagesAndFilesCanvas.width, this.pagesAndFilesCanvas.height);
        var screenP = this.pos.copy().add(this.cam.pos).scale(this.cam.scale);
        c.beginPath();
        c.lineWidth = 1;
        c.fillStyle = "rgba(255,255,255,0.2)";
        c.arc(this.radius, this.radius, this.radius - 1, 0, 2 * Math.PI);
        c.stroke();
        c.fill();
        c.closePath();
        for (var i = 0; i < this.children.length; i++) {
            var p = this.children[i];
            p.pos.x += this.radius;
            p.pos.y += this.radius;
            p.render(c);
        }
        this.pagesAndFilesIsDirty = false;
    };
    HostNode.prototype.renderLines = function (c) {
        for (var i = 0; i < this.childHostNodes.length; i++)
            this.childHostNodes[i].renderLines(c);
        var screenP = this.pos.copy(Helpers.p1).add(this.cam.pos).scale(this.cam.scale);
        for (var i = 0; i < this.childHostNodes.length; i++) {
            var child = this.childHostNodes[i];
            var childScreenP = child.pos.copy(Helpers.p2).add(this.cam.pos).scale(this.cam.scale);
            var diff = childScreenP.copy(Helpers.p3).subtract(screenP);
            var norm = diff.normalize();
            var v = norm.copy(Helpers.p4).scale(this.radius * this.cam.scale);
            c.moveTo(screenP.x + v.x, screenP.y + v.y);
            v = norm.copy(Helpers.p5).scale(child.radius * this.cam.scale);
            c.lineTo(childScreenP.x - v.x, childScreenP.y - v.y);
        }
    };
    HostNode.prototype.render = function (c) {
        for (var i = 0; i < this.childHostNodes.length; i++)
            this.childHostNodes[i].render(c);
        var screenP = this.pos.copy(Helpers.p1).add(this.cam.pos).scale(this.cam.scale);
        if (screenP.x < -this.radius * this.cam.scale || screenP.y < -this.radius * this.cam.scale ||
            screenP.x > c.canvas.width + this.radius * this.cam.scale || screenP.y > c.canvas.height + this.radius * this.cam.scale)
            return;
        _super.prototype.render.call(this, c);
        c.drawImage(this.pagesAndFilesCanvas, (this.cam.pos.x + this.pos.x - this.radius) * this.cam.scale, (this.cam.pos.y + this.pos.y - this.radius) * this.cam.scale, this.pagesAndFilesCanvas.width * this.cam.scale, this.pagesAndFilesCanvas.height * this.cam.scale);
        //c.drawImage(icons, i.x, i.y, i.w, i.h, 
        //(this.cam.pos.x + this.pos.x)*this.cam.scale - size/2, (this.cam.pos.y + this.pos.y)*this.cam.scale - size/2, size, size);
        // Render a green circle around us
        if (settings.showDebugCircles) {
            c.fillStyle = "rgba(255,255,255,0.2)";
            c.beginPath();
            c.arc(screenP.x, screenP.y, this.totalRadius * this.cam.scale, 0, 2 * Math.PI);
            c.fill();
            c.stroke();
            c.closePath();
        }
        if (this.isLoading)
            this.loadingAnim.render(c, screenP.x - 14 * this.cam.scale, screenP.y - 14 * this.cam.scale, 28 * this.cam.scale, 28 * this.cam.scale);
        if (this.isMouseOver) {
            var pp = this.pos.copy(Helpers.p2).add(this.cam.pos).scale(this.cam.scale);
            pp.x -= this.host.length * 2;
            pp.y += 2 * this.cam.scale;
            c.fillStyle = "black";
            c.fillText(this.host, pp.x + 1, pp.y);
            c.fillText(this.host, pp.x - 1, pp.y);
            c.fillText(this.host, pp.x, pp.y + 1);
            c.fillText(this.host, pp.x, pp.y - 1);
            c.fillStyle = "white";
            c.fillText(this.host, pp.x, pp.y);
            // Render a green circle around us
            //c.fillStyle = "rgba(255,255,255,0.2)";
            //c.beginPath();
            //c.arc(screenP.x, screenP.y, this.totalRadius * this.cam.scale, 0, 2 * Math.PI);
            //c.fill();
            //c.stroke();  
            // Render a circle around us            
            c.beginPath();
            c.strokeStyle = "white";
            c.lineWidth = 1;
            c.fillStyle = "rgba(255,255,255,0.3)";
            c.arc(screenP.x, screenP.y, this.radius * this.cam.scale, 0, 2 * Math.PI);
            c.stroke();
            c.fill();
            c.closePath();
        }
    };
    return HostNode;
})(PhysicsRenderNode);
