var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PhysicsRenderNode = (function (_super) {
    __extends(PhysicsRenderNode, _super);
    function PhysicsRenderNode(r, physicsGroup, isstatic) {
        _super.call(this, r);
        this.body = r.physics.createCircularBody(0, 0, this.radius, physicsGroup, isstatic);
        this.updatePosition(this.pos.x, this.pos.y);
        this.body.SetUserData(this);
    }
    PhysicsRenderNode.prototype.updatePosition = function (x, y) {
        _super.prototype.updatePosition.call(this, x, y);
        var p = new b2Vec2(this.pos.x / Physics.SCALE, this.pos.y / Physics.SCALE);
        this.body.SetPosition(p);
    };
    PhysicsRenderNode.prototype.update = function (delta) {
        this.pos.x = this.body.GetWorldCenter().x * Physics.SCALE;
        this.pos.y = this.body.GetWorldCenter().y * Physics.SCALE;
    };
    return PhysicsRenderNode;
})(RenderNode);
//@ sourceMappingURL=PhysicsRenderNode.js.map
