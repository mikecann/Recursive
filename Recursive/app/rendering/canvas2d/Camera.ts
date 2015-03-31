/// <reference path="../../../app.ts" />

class Camera {

    scale: number = 1;
    targetScale: number = 1;
    pos = new TSM.vec2();
    vel = new TSM.vec2();
    scalePoint = new TSM.vec2();
    distanceMouseMovedSinceButtonWentDown: number;

    private canvas : JQuery;    

    constructor (mouseTargetSelector: string) {
        
        this.canvas = $(mouseTargetSelector);

        var isMouseDown = false;
        var startDownPoint : TSM.vec2 = new TSM.vec2();
        var containerStartPos: TSM.vec2 = new TSM.vec2();
        var lastDelta = new TSM.vec2();
        var lastPos = new TSM.vec2();

        this.canvas.mousedown((e) => { 
            isMouseDown = true; 
            startDownPoint = new TSM.vec2([e.pageX,e.pageY]);           
            containerStartPos = this.pos.copy();
            lastPos = startDownPoint.copy();
            this.distanceMouseMovedSinceButtonWentDown = 0;
            this.vel.reset();
        });
        $(window).mouseup((e) => { 
            isMouseDown = false; 
            startDownPoint.x = containerStartPos.x = 0;
            startDownPoint.y = containerStartPos.y = 0;
            this.vel = lastDelta.copy().scale(2);            
        });
        this.canvas.mousemove((e) => {  
            if (isMouseDown) {
                var dx = e.pageX - startDownPoint.x;
                var dy = e.pageY - startDownPoint.y;                          
                lastDelta.x = e.pageX-lastPos.x;
                lastDelta.y = e.pageY-lastPos.y;       
                lastPos.x = e.pageX;
                lastPos.y = e.pageY;        
                this.distanceMouseMovedSinceButtonWentDown += lastDelta.length();
                this.pos.x = containerStartPos.x + dx*(1/this.scale);
                this.pos.y = containerStartPos.y + dy*(1/this.scale);
            }
        });
        this.canvas.bind('mousewheel', (event) =>
        {
            event.originalEvent.preventDefault();

            //var mx = event.originalEvent.pageX;
            //var my = event.originalEvent.pageY;
            var delta = (event.originalEvent.wheelDelta / 1000)*(this.scale);

            this.scalePoint.x = event.originalEvent.pageX;
            this.scalePoint.y = event.originalEvent.pageY;
            
            //var beforeMX = (mx / this.targetScale)+this.pos.x;
            //var beforeMY = (my / this.targetScale)+this.pos.y;

            this.targetScale += delta;
            if (this.targetScale < 0.01) this.targetScale = 0.01;
            if (this.targetScale > 2) this.targetScale = 2;

            //var afterMX = (mx / this.targetScale) + this.pos.x;
            //var afterMY = (my / this.targetScale) + this.pos.y;

			//this.targetOffset.x = (afterMX - beforeMX);
            //this.targetOffset.y = (afterMY - beforeMY);

        });

    } 

    tick() {

        var d = (this.scale - this.targetScale) * 0.2;

        var before = this.scalePoint.copy().scale(1 / this.scale).add(this.pos);

        this.scale -= d;

        var after = this.scalePoint.copy().scale(1 / this.scale).add(this.pos);

        this.pos.add(after.subtract(before));

      

       // this.pos.add(this.vel);
        //this.vel.scale(0.8);

    }
}