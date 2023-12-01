import { PixiToBox2d } from "./Utils";
import { IPhysicObjectOption, PhysicObject } from "./PhysicObject";
import * as b2 from "box2d";

export class Edge extends PhysicObject {
    constructor(to: b2.Vec2, options: IPhysicObjectOption = {}) {
        super(options);

        const fixtureDef = this.getFixtureDefs()[0];
        const shape = new b2.PolygonShape();
        shape.Set([new b2.Vec2(0, 0), new b2.Vec2(to.x * PixiToBox2d, to.y * PixiToBox2d)]);

        fixtureDef.shape = shape;
    }
}
