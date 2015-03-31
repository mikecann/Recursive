/// <reference path="../../app.ts">

class Branch {
    parent: Branch;
    depth: number;
    branches: Branch[];
    angle: number;
    rand1: number;
    rand2: number;
    age: number;
}

class HeroController {

    view: JQuery;
    isRendering: bool = true;
    canvas: HTMLCanvasElement;
    lastTime: number;
    tree: Branch;
    randVarienceStrength: number;
    maxDepth: number;

    constructor (heroId: string) {

        // Grab the url and slam it in as the search 
        var q = (<any>Helpers.parseUri(window.location.href)).queryKey.url;
        if (q) $('#heroRecurseSearchBox').attr('value', q);

        this.view = $("#" + heroId);
        this.view.click(() => this.tree = this.getBranch(0));
        this.view.find("#heroRecurseButton").click(e=>{
            $('#urlInput').attr('value', $("#heroRecurseSearchBox").attr('value'));
            $("#goBtn").trigger('click');
            this.view.hide();
            $("#topBar").show();
            e.preventDefault();
            this.isRendering = false;
        });


        this.canvas = <HTMLCanvasElement>$("#treeCanvas")[0];
        this.canvas.width = 900;
        this.canvas.height = 530;

        this.maxDepth = 10;
        this.randVarienceStrength = 1 + Math.random();
        this.tree = this.getBranch(0);
    
        this.lastTime = (new Date()).getTime();
        webkitRequestAnimationFrame(() => {
            this.randVarienceStrength = 1 + Math.random();
            this.maxDepth =10;
            this.renderTree();   
        });
    }

    private getBranch(ang:number, parent:Branch=null): Branch {
        if (parent && parent.depth > this.maxDepth) return null;
        var b = new Branch();
        b.parent = parent;
        b.angle = ang;       
        b.age = 0;
        b.depth = parent ? parent.depth + 1 : 0;
        b.branches = [];

        var distFromRootRatio = b.depth / this.maxDepth;
        var numChildren = Math.floor(1 + (b.depth / (2+Math.random())));
        numChildren = 2;
        

        //numChildren += (Math.random() > 0.5 ? 1.0 : 0);
        //if (b.depth == this.maxDepth) numChildren = 3;

       // numChildren = Math.min(numChildren, 2);

        //for (var i = 0; i < 2; i++) {
        var a = Math.abs(ang) + (0.1)*((1.0-distFromRootRatio)*0.99);
            a += Math.random() / 60.0;

            

            //a += Math.random() * 0.1 * (distFromRootRatio/3);
            //a += 0.01 * b.depth;
            a *= (Math.random() > 0.5 ? -1.0 : 1.0);
            //a *= Math.random();
            //var a = ang + (0.13 + Math.random() * (0.008*b.depth * this.randVarienceStrength))*(Math.random()>0.5?-1:1);

            if (b.depth == 0) {
                b.branches.push(this.getBranch(ang, b));
            }
            else {
                 b.branches.push(this.getBranch(a, b));
        
                if (Math.random() < 0.3) a *= -1.5;
                else a *= -1;

                if (Math.random() < 0.9)
                    b.branches.push(this.getBranch(a, b));
            }

           
        //}


        b.rand1 = Math.random() * b.depth;
        b.rand2 = Math.random() * (1-distFromRootRatio);
        return b;
    }

    private renderTree() {

        if(!this.isRendering) return;

        var now = (new Date()).getTime();
        var delta = now - this.lastTime;
        this.lastTime = now;

        var ctx = this.canvas.getContext('2d');

        ctx.save();
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.translate(200 + this.canvas.width / 2, this.canvas.height-20);
       
        var renderBranch = b => {

            if(!b) return;

            b.age += delta;

            var maxAge = b.depth * 150;
            var ageRatio = Math.min(maxAge, b.age) / maxAge;
            ageRatio = ageRatio * ageRatio;

            var branchLength = ageRatio * (((this.maxDepth + (b.rand2*4) - b.depth + 1) * 6.8)+10);


            b.angle += Math.sin((now*b.rand1)/1000)*0.0006;

            ctx.save();

            ctx.rotate(b.angle);
            //ctx.scale(1.2,1.2);

            ctx.beginPath();
            ctx.lineCap = "round";
            ctx.strokeStyle = "rgba(1,1,1,0.09)";
            ctx.lineWidth = Math.max(30 - b.depth * 4, 1)*ageRatio;
            ctx.moveTo(0, 0);
            ctx.translate(0, -branchLength);
            ctx.lineTo(0, 0);
            ctx.stroke();

            b.branches.forEach(bb => renderBranch(bb));

            ctx.restore();
        }

        renderBranch(this.tree);

        ctx.restore();

        webkitRequestAnimationFrame(()=> this.renderTree());
    }

}