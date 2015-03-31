/// <reference path="app.ts" />

/*
interface Point {
    x: number;
    y: number;
}

class Dragger {

    private canvas : JQuery;
    private container: JQuery;
    private scale: number = 1;

    constructor (mouseTargetSelector: string, dragTargetSelector:string) {
        this.canvas = $(mouseTargetSelector);
        this.container = $(dragTargetSelector);
    }

    startDragging() {
        var isMouseDown = false;
        var startDownPoint : Point;
        var containerStartPos: Point;
        this.canvas.mousedown((e) => { 
            isMouseDown = true; 
            var o: any = this.container.offset();
            startDownPoint = { x: e.pageX, y: e.pageY };            
            containerStartPos = { x: o.left, y: o.top };
        });
        this.canvas.mouseup((e) => { 
            isMouseDown = false; 
            startDownPoint.x = containerStartPos.x = 0;
            startDownPoint.y = containerStartPos.y = 0;
        });
        this.canvas.mousemove((e) => {  
            if (isMouseDown) {
                var dx = e.pageX - startDownPoint.x;
                var dy = e.pageY - startDownPoint.y;
                this.container.css({ left: containerStartPos.x + dx, top: containerStartPos.y + dy });
            }
        });
        this.canvas.bind('mousewheel', (event) =>
        {
            event.originalEvent.preventDefault();
            this.scale += event.originalEvent.wheelDelta / 10000;
            if (this.scale < 0) this.scale = 0.0001;
            if (this.scale > 2) this.scale = 2;
            $('#nodesContainer').css('-webkit-transform', 'scale(' + this.scale + ')');
        });
    }



}

*/