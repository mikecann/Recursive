
class Anim
{
    frameTime: number = 1000 / 15;
    currentFrame: number;
    img: HTMLImageElement;
    frameW: number;
    frameH: number;
    timeSinceLastFrame: number;

    constructor (img:HTMLImageElement, frameW:number, frameH:number) {
        this.currentFrame = 0;
        this.img = img;
        this.frameW = frameW;
        this.frameH = frameH;
        this.timeSinceLastFrame = 0;
    }

    update(delta: number) {
        this.timeSinceLastFrame += delta;
        if (this.timeSinceLastFrame > this.frameTime) {
            this.timeSinceLastFrame = 0;
            this.currentFrame++;
            var offx = this.currentFrame * this.frameW;
            if (offx >= this.img.width) {
                this.currentFrame = 0;
            }
        }
    }
    
    render(c: CanvasRenderingContext2D, x:number, y:number, w:number, h:number) {        
        var offx = this.currentFrame * this.frameW;
        c.drawImage(this.img, offx, 0, this.frameW, this.frameH, x, y, w, h);
    }
}