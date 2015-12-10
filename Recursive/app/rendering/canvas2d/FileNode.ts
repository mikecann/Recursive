
class FileNode extends RenderNode {

    page: Crawler;
    file: CrawlerFile;

    constructor (page: Crawler, renderer:Renderer, file:CrawlerFile) {
        super(renderer);
        this.page = page;
        this.icon = images.getImageForFileType(file);
        this.inCameraSpace = false;
    }

    render(c:CanvasRenderingContext2D) {        
        if(!this.icon) return;
        c.drawImage(this.icon, this.pos.x - this.icon.width/2, this.pos.y - this.icon.height/2);
    }

}