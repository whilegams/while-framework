import { Container } from "pixi.js";
import { PixiToBox2d } from "./Utils";
import { IPhysicObjectOption, PhysicObject } from "./PhysicObject";

export class Circle extends PhysicObject {
    constructor(radius: number, options: IPhysicObjectOption = {}) {
        super(options);

        const fixtureDef = this.getFixtureDefs()[0];
        fixtureDef.shape = new Box2D.Collision.Shapes.b2CircleShape(radius * PixiToBox2d);
    }

    static from(pixi: Container, options: IPhysicObjectOption = {}): Circle {
        const b2d = new Circle(Math.max(pixi.width / 2, pixi.height / 2), options);

        const c = b2d.addChild(new Container());
        c.addChild(pixi);

        const b = b2d.getLocalBounds();
        c.x = -b.x - pixi.width / 2;
        c.y = -b.y - pixi.height / 2;

        return b2d;
    }
}
