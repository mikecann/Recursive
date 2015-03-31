var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var HostGroupNode = (function (_super) {
    __extends(HostGroupNode, _super);
    function HostGroupNode(renderer, primaryNode) {
        _super.call(this, renderer);
        this.icon = null;
        this.primaryNode = primaryNode;
    }
    return HostGroupNode;
})(PhysicsRenderNode);
//@ sourceMappingURL=HostGroupNode.js.map
