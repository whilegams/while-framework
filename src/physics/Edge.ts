import { PixiToBox2d } from "./Utils";
import { IPhysicObjectOption, PhysicObject } from "./PhysicObject";

export class Edge extends PhysicObject {
    constructor(to: Box2D.Common.Math.b2Vec2, options: IPhysicObjectOption = {}) {
        super(options);

        const fixtureDef = this.getFixtureDefs()[0];
        const shape = new Box2D.Collision.Shapes.b2PolygonShape();
        shape.SetAsEdge(
            new Box2D.Common.Math.b2Vec2(0, 0),
            new Box2D.Common.Math.b2Vec2(to.x * PixiToBox2d, to.y * PixiToBox2d),
        );

        fixtureDef.shape = shape;
    }
}
