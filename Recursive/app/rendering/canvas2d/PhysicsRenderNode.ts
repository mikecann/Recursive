/// <reference path="../../../app.ts" />

class PhysicsRenderNode extends RenderNode {

	body: any;

	constructor (r:Renderer, physicsGroup:number, isstatic:bool) {
		super(r);
		this.body = r.physics.createCircularBody(0,0,this.radius,physicsGroup,isstatic);
		this.updatePosition(this.pos.x, this.pos.y);
		this.body.SetUserData(this);       
	}
	
	updatePosition(x:number, y:number) {
		super.updatePosition(x, y);
		var p = new b2Vec2(this.pos.x / Physics.SCALE, this.pos.y / Physics.SCALE);
		this.body.SetPosition(p);
	}

	update(delta:number) 
	{
		this.pos.x = this.body.GetWorldCenter().x * Physics.SCALE;
		this.pos.y = this.body.GetWorldCenter().y * Physics.SCALE;
	}

}
