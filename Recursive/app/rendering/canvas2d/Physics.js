var b2internal = Box2D.Common.b2internal;
var b2Settings = Box2D.Common.b2Settings;
var b2Mat22 = Box2D.Common.Math.b2Mat22;
var b2Mat33 = Box2D.Common.Math.b2Mat33;
var b2Math = Box2D.Common.Math.b2Math;
var b2Sweep = Box2D.Common.Math.b2Sweep;
var b2Transform = Box2D.Common.Math.b2Transform;
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2Vec3 = Box2D.Common.Math.b2Vec3;
var b2DistanceJoint = Box2D.Dynamics.Joints.b2DistanceJoint;
var b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef;
var b2FrictionJoint = Box2D.Dynamics.Joints.b2FrictionJoint;
var b2FrictionJointDef = Box2D.Dynamics.Joints.b2FrictionJointDef;
var b2GearJoint = Box2D.Dynamics.Joints.b2GearJoint;
var b2GearJointDef = Box2D.Dynamics.Joints.b2GearJointDef;
var b2Jacobian = Box2D.Dynamics.Joints.b2Jacobian;
var b2Joint = Box2D.Dynamics.Joints.b2Joint;
var b2JointDef = Box2D.Dynamics.Joints.b2JointDef;
var b2JointEdge = Box2D.Dynamics.Joints.b2JointEdge;
var b2LineJoint = Box2D.Dynamics.Joints.b2LineJoint;
var b2LineJointDef = Box2D.Dynamics.Joints.b2LineJointDef;
var b2MouseJoint = Box2D.Dynamics.Joints.b2MouseJoint;
var b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;
var b2PrismaticJoint = Box2D.Dynamics.Joints.b2PrismaticJoint;
var b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef;
var b2PulleyJoint = Box2D.Dynamics.Joints.b2PulleyJoint;
var b2PulleyJointDef = Box2D.Dynamics.Joints.b2PulleyJointDef;
var b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint;
var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
var b2WeldJoint = Box2D.Dynamics.Joints.b2WeldJoint;
var b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2ContactFilter = Box2D.Dynamics.b2ContactFilter;
var b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse;
var b2ContactListener = Box2D.Dynamics.b2ContactListener;
var b2ContactManager = Box2D.Dynamics.b2ContactManager;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2DestructionListener = Box2D.Dynamics.b2DestructionListener;
var b2FilterData = Box2D.Dynamics.b2FilterData;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Island = Box2D.Dynamics.b2Island;
var b2TimeStep = Box2D.Dynamics.b2TimeStep;
var b2World = Box2D.Dynamics.b2World;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
// I dont like how this shit works so i re-jiggleypuffed it
b2ContactFilter.prototype.ShouldCollide = function (fixtureA, fixtureB) {
    if (!fixtureA.m_body || !fixtureA.m_body.m_userData || !fixtureB.m_body || !fixtureB.m_body.m_userData)
        return false;
    /*
    var nodeA : HostNode = fixtureA.m_body.m_userData;
    var nodeB : HostNode = fixtureB.m_body.m_userData;
    if (nodeA.childHostNodes.length != 0 && nodeB.childHostNodes.length != 0) return true;
    return nodeA.parentNode == nodeB.parentNode;
    */
    var nodeA = fixtureA.m_body.m_userData;
    var nodeB = fixtureB.m_body.m_userData;
    return nodeA.parentNode == nodeB.parentNode;
};
var Physics = (function () {
    function Physics(c) {
        this.bodies = [];
        this.world = new b2World(new b2Vec2(0, 0), true);
        this.lastTimestamp = Date.now();
        this.fixedTimestepAccumulator = 0;
        var debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(c);
        debugDraw.SetDrawScale(Physics.SCALE);
        debugDraw.SetFillAlpha(0.7);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        this.world.SetDebugDraw(debugDraw);
    }
    Physics.prototype.createCircularBody = function (x, y, radius, physicsGroup, isStatic) {
        if (isStatic === void 0) { isStatic = false; }
        var fix = new b2FixtureDef;
        fix.density = 1;
        fix.restitution = 0.5;
        fix.shape = new b2CircleShape(radius / Physics.SCALE);
        fix.filter.groupIndex = physicsGroup;
        var def = new b2BodyDef;
        def.linearDamping = 4;
        if (!isStatic)
            def.type = b2Body.b2_dynamicBody;
        def.position.x = x;
        def.position.y = y;
        def.fixedRotation = true;
        var body = this.world.CreateBody(def);
        body.CreateFixture(fix);
        this.bodies.push(body);
        return body;
    };
    Physics.prototype.createJoint = function (bodyA, bodyB) {
        var jointDef = new b2DistanceJointDef();
        jointDef.Initialize(bodyA, bodyB, bodyA.GetWorldCenter(), bodyB.GetWorldCenter());
        jointDef.collideConnected = false;
        jointDef.dampingRatio = 0.01;
        jointDef.frequencyHz = 10;
        jointDef.length = 5;
        return this.world.CreateJoint(jointDef);
    };
    Physics.prototype.update = function () {
        //var now = Date.now();
        //var dt = now - this.lastTimestamp;
        //this.fixedTimestepAccumulator += dt;
        //this.lastTimestamp = now;
        this.world.Step(1 / 60, 1, 1);
        //this.world.Step(this.TIMESTEP, 10, 10);
        //this.world.m_debugDraw.m_sprite.graphics.clear();
        //this.world.DrawDebugData();
        //while (this.fixedTimestepAccumulator >= Physics.STEP) {
        // this.world.Step(Physics.TIMESTEP, 10, 10);            
        //this.fixedTimestepAccumulator -= Physics.STEP;
        // }
    };
    Physics.SCALE = 30;
    Physics.STEP = 20;
    Physics.TIMESTEP = 1 / 20;
    return Physics;
})();
