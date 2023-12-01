import { IPhysicObjectOption, PhysicObject } from "./PhysicObject";
import * as b2 from "box2d";

export class Polygon extends PhysicObject {
    constructor(vertices: b2.Vec2[], options: IPhysicObjectOption = {}) {
        super(options);

        const fixtureDef = this.getFixtureDefs()[0];
        const shape = new b2.PolygonShape();
        shape.Set(vertices);

        fixtureDef.shape = shape;
    }
}
