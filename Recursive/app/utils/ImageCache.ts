
class ImageCache {

    circleRad: number = 8;

    unknown: HTMLImageElement;

    private cache: any = {};
    private files: any = {};

    constructor () {    
        
        this.files["psd"] = "images/blue-document-photoshop-image.png";
        this.files["png"] = "images/image.png";
        this.files["gif"] = "images/image.png";
        this.files["tga"] = "images/image.png";        
        this.files["jpg"] = "images/image-sunset.png";
        this.files["jpeg"] = "images/image-sunset.png";
        this.files["ico"] = "images/image-sunset.png";
        this.files["php"] = "images/document-php.png";
        this.files["zip"] = "images/document-zipper.png";
        this.files["rar"] = "images/document-zipper.png";
        this.files["7z"] = "images/document-zipper.png";
        this.files["gz"] = "images/document-zipper.png";
        this.files["tar"] = "images/document-zipper.png";
        this.files["json"] = "images/json.png";
        this.files["js"] = "images/script-text.png";
        this.files["css"] = "images/css.png";
        this.files["xml"] = "images/blue-document-node.png";
        this.files["txt"] = "images/document-text.png";
        this.files["dll"] = "images/box-document.png";
        this.files["swf"] = "images/document-flash.png";
        this.files["xls"] = "images/document-excel.png";
        this.files["pdf"] = "images/document-pdf.png";

        this.files[CrawlerFileTypes.IMAGE] = "images/image.png";
        this.files[CrawlerFileTypes.OTHER] = "images/document-text.png";
        this.files[CrawlerFileTypes.VIDEO] = "images/film.png";
        this.files[CrawlerFileTypes.BINARY] = "images/box-document.png";
        this.files[CrawlerFileTypes.SOUND] = "images/music.png";

        this.unknown = this.getImage("images/help.png",false);   
        this.getImage("images/image.png", false);
        this.getImage("images/document-text.png", false);
        this.getImage("images/film.png", false);
        this.getImage("images/box-document.png", false);
        this.getImage("images/music.png", false);
    }
    
    getImageForFileType(file: CrawlerFile) : HTMLImageElement {
        var i = this.files[file.extension];
        if (i) return this.getImage(i,false);
        i = this.files[file.type];
        if (i) return this.getImage(i,false);        
        return this.unknown;
    }

    getImage(src:string, circleIt:boolean=true): HTMLImageElement {
        var id = src+(circleIt?"_circle":"");
        var i = this.cache[id];
        if (!i) {
            i = new Image();
            i.src = src;
            if (circleIt) i.onload = (e) => {
                this.circleIt(i);
                i.onload = null;
            }
            this.cache[id] = i;
        }
        return i;
    }

    private circleIt(i: HTMLImageElement) {
        var r = this.circleRad;
        var c = (<HTMLCanvasElement>document.createElement("canvas")).getContext("2d");
        c.canvas.width = r*2;
        c.canvas.height = r*2;
        c.beginPath();
        c.arc(r, r, r, 0, Math.PI * 2, false);
        c.clip();
        c.drawImage(i, 0, 0, r*2, r*2);
        i.src = c.canvas.toDataURL();
    }

    private shadeIt(i:HTMLImageElement, shade: string, strength:number=0.5) : HTMLImageElement {
        var c = (<HTMLCanvasElement>document.createElement("canvas")).getContext("2d");
        c.canvas.width = i.width;
        c.canvas.height = i.height;
        c.drawImage(i, 0, 0, i.width, i.height);
        c.globalAlpha = strength;
        c.fillStyle = shade;
        c.globalCompositeOperation = 'source-atop'; 
        c.fillRect(0,0,i.width,i.height);

        var newImg = <HTMLImageElement>document.createElement("img");
        newImg.src = c.canvas.toDataURL();    
        return newImg;
    }

}