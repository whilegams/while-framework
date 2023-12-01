import { IPhysicObjectOption, PhysicObject } from "./PhysicObject";
import { PixiToBox2d } from "./Utils";
import { Container } from "pixi.js";
import * as b2 from "box2d";

export class Rectangle extends PhysicObject {
    constructor(width: number, height: number, options: IPhysicObjectOption = {}) {
        super(options);

        width *= PixiToBox2d;
        height *= PixiToBox2d;

        const fixtureDef = this.getFixtureDefs()[0];
        const shape = new b2.PolygonShape();
        shape.Set([new b2.Vec2(0, 0), new b2.Vec2(width, 0), new b2.Vec2(width, height), new b2.Vec2(0, height)]);

        fixtureDef.shape = shape;
    }

    static from(pixi: Container, options: IPhysicObjectOption = {}): Rectangle {
        const b2d = new Rectangle(pixi.width, pixi.height, options);

        const c = b2d.addChild(new Container());
        c.addChild(pixi);

        const b = b2d.getLocalBounds();
        c.x = -b.x;
        c.y = -b.y;

        return b2d;
    }
}
