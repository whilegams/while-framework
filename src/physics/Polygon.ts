import { IPhysicObjectOption, PhysicObject } from "./PhysicObject";

export class Polygon extends PhysicObject {
    constructor(vertices: Box2D.Common.Math.b2Vec2[], options: IPhysicObjectOption = {}) {
        super(options);

        const fixtureDef = this.getFixtureDefs()[0];
        const shape = new Box2D.Collision.Shapes.b2PolygonShape();
        shape.SetAsArray(vertices);

        fixtureDef.shape = shape;
    }
}
