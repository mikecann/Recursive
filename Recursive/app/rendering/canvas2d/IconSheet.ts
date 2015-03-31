class Icon {
    index: number;
    img: HTMLImageElement;
    x: number;
    y: number;
    tx: number;
    ty: number;
    w: number;
    h: number;
}

class IconGroup {
    red: Icon;
    orange: Icon;
    none: Icon;
    green: Icon;
}

class Iconsheet {

    iconWidth: number = 16;
    iconHeight: number = 16;
    sheetWidth: number = 2048;
    sheetHeight: number = 2048;
    context: CanvasRenderingContext2D;
    tileIndex: number;
    tiles: any = {};

    constructor () {
        var s = <HTMLCanvasElement>document.createElement("canvas");
        s.width = this.sheetWidth;
        s.height = this.sheetHeight;
        this.context = s.getContext("2d");
        this.tileIndex = 0;
    }

    getIcon(iconSrc: string, style:string): IconGroup {
       
        if (this.tiles.hasOwnProperty(iconSrc)) return this.tiles[iconSrc];
        
        var tg = new IconGroup();
        this.tiles[iconSrc] = tg;

        var i = new Image();
        i.src = iconSrc;
        i.onload = (e) => this.addIcon(tg,i, style);

        console.log("Loading icon: "+i.src);

        return tg;
    }

    getFavIcon(iconSrc:string) : IconGroup 
    {
        var host = Helpers.parseUri(iconSrc).host;  
        if (this.tiles.hasOwnProperty(host)) return this.tiles[host];
        
        var tg = new IconGroup();
        this.tiles[host] = tg;

        var i = new Image();
        i.src = "http://g.etfv.co/http://" + encodeURI(host);
        i.onload = (e) => this.addIcon(tg,i);

        //console.log("Loading host icon: "+i.src);

        return tg;
    }    

    private addIcon(tg:IconGroup,icon: HTMLImageElement, style?:string="circle") {        
        tg.none = this.addTile("", icon, style);
        tg.orange = this.addTile("orange", icon, style);
        tg.red = this.addTile("#ff0000", icon, style);
        tg.green = this.addTile("#00ff00", icon, style);   
    }

    private addTile(color:string, icon: HTMLImageElement, style?:string="circle"): Icon {

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

        if (style == "none") {
            this.context.drawImage(icon, t.x, t.y, this.iconWidth, this.iconHeight);
        }
        else if (style == "circle") {
            this.context.save();            
            this.context.beginPath();
            this.context.arc(t.x + this.iconWidth / 2, t.y + this.iconHeight / 2, 7, 0, Math.PI * 2, false);
            this.context.clip();
            this.context.drawImage(icon, t.x, t.y, this.iconWidth, this.iconHeight);
            this.context.restore();

            this.context.save();
            this.context.beginPath();
            this.context.globalAlpha = color==""?0:1;
            this.context.strokeStyle = color;
            this.context.arc(t.x + this.iconWidth / 2, t.y + this.iconHeight / 2, 7, 0, Math.PI * 2, false);
            this.context.stroke();
            this.context.restore();
        }
        else if (style == "shade") {
            this.context.save();
            this.context.drawImage(icon, t.x, t.y, this.iconWidth, this.iconHeight);
            this.context.globalAlpha = color==""?0:0.5;
            this.context.fillStyle = color;
            this.context.globalCompositeOperation = 'source-atop'; 
            this.context.fillRect(t.x,t.y,t.w,t.h);            
            this.context.restore();
        }

        return t;
    }

}