var Icon = (function () {
    function Icon() { }
    return Icon;
})();
var IconGroup = (function () {
    function IconGroup() { }
    return IconGroup;
})();
var Iconsheet = (function () {
    function Iconsheet() {
        this.iconWidth = 16;
        this.iconHeight = 16;
        this.sheetWidth = 2048;
        this.sheetHeight = 2048;
        this.tiles = {
        };
        var s = document.createElement("canvas");
        s.width = this.sheetWidth;
        s.height = this.sheetHeight;
        this.context = s.getContext("2d");
        this.tileIndex = 0;
    }
    Iconsheet.prototype.getIcon = function (iconSrc, style) {
        var _this = this;
        if(this.tiles.hasOwnProperty(iconSrc)) {
            return this.tiles[iconSrc];
        }
        var tg = new IconGroup();
        this.tiles[iconSrc] = tg;
        var i = new Image();
        i.src = iconSrc;
        i.onload = function (e) {
            return _this.addIcon(tg, i, style);
        };
        console.log("Loading icon: " + i.src);
        return tg;
    };
    Iconsheet.prototype.getFavIcon = function (iconSrc) {
        var _this = this;
        var host = Helpers.parseUri(iconSrc).host;
        if(this.tiles.hasOwnProperty(host)) {
            return this.tiles[host];
        }
        var tg = new IconGroup();
        this.tiles[host] = tg;
        var i = new Image();
        i.src = "http://g.etfv.co/http://" + encodeURI(host);
        i.onload = function (e) {
            return _this.addIcon(tg, i);
        };
        return tg;
    };
    Iconsheet.prototype.addIcon = function (tg, icon, style) {
        if (typeof style === "undefined") { style = "circle"; }
        tg.none = this.addTile("", icon, style);
        tg.orange = this.addTile("orange", icon, style);
        tg.red = this.addTile("#ff0000", icon, style);
        tg.green = this.addTile("#00ff00", icon, style);
    };
    Iconsheet.prototype.addTile = function (color, icon, style) {
        if (typeof style === "undefined") { style = "circle"; }
        var ty = Math.floor(this.tileIndex / (this.sheetWidth / this.iconWidth));
        var tx = this.tileIndex - (ty * (this.sheetWidth / this.iconWidth));
        var t = new Icon();
        t.index = this.tileIndex++;
        t.tx = tx;
        t.ty = ty;
        t.x = tx * this.iconWidth;
        t.y = ty * this.iconHeight;
        t.w = this.iconWidth;
        t.h = this.iconHeight;
        t.img = icon;
        if(style == "none") {
            this.context.drawImage(icon, t.x, t.y, this.iconWidth, this.iconHeight);
        } else {
            if(style == "circle") {
                this.context.save();
                this.context.beginPath();
                this.context.arc(t.x + this.iconWidth / 2, t.y + this.iconHeight / 2, 7, 0, Math.PI * 2, false);
                this.context.clip();
                this.context.drawImage(icon, t.x, t.y, this.iconWidth, this.iconHeight);
                this.context.restore();
                this.context.save();
                this.context.beginPath();
                this.context.globalAlpha = color == "" ? 0 : 1;
                this.context.strokeStyle = color;
                this.context.arc(t.x + this.iconWidth / 2, t.y + this.iconHeight / 2, 7, 0, Math.PI * 2, false);
                this.context.stroke();
                this.context.restore();
            } else {
                if(style == "shade") {
                    this.context.save();
                    this.context.drawImage(icon, t.x, t.y, this.iconWidth, this.iconHeight);
                    this.context.globalAlpha = color == "" ? 0 : 0.5;
                    this.context.fillStyle = color;
                    this.context.globalCompositeOperation = 'source-atop';
                    this.context.fillRect(t.x, t.y, t.w, t.h);
                    this.context.restore();
                }
            }
        }
        return t;
    };
    return Iconsheet;
})();
//@ sourceMappingURL=IconSheet.js.map
