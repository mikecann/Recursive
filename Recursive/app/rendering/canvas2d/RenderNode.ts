class RenderNode {

    renderer: Renderer;
    cam: Camera;
    pos = new TSM.vec2();
    icon: HTMLImageElement;
    scale: number=1;    
    inCameraSpace: boolean = true;
    isMouseOver: boolean = false;
    radius: number = 16;    
    
    constructor (r:Renderer){
        this.renderer = r;
        this.cam = r.camera;
        this.icon = images.unknown;        
    }   

    update(deta:number) 
    {
    }
    

    updatePosition(x:number, y:number) {
        this.pos.x = x;
        this.pos.y = y;
    }

    render(c:CanvasRenderingContext2D) {      
        if(!this.icon) return;
        
        if (this.inCameraSpace) {           
            c.drawImage(this.icon,
                (this.pos.x + this.cam.pos.x - this.icon.width / 2) * this.cam.scale,
                (this.pos.y + this.cam.pos.y - this.icon.height / 2) * this.cam.scale,
                this.cam.scale*this.icon.width, this.cam.scale*this.icon.height);
        }
        else {
            c.drawImage(this.icon, this.pos.x - this.icon.width/2, this.pos.y - this.icon.height/2);
        }
    }
}