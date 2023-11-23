import { IPhysicObjectOption, PhysicObject } from "./PhysicObject";
import { PixiToBox2d } from "./Utils";
import { Container } from "pixi.js";

export class Rectangle extends PhysicObject {
    constructor(width: number, height: number, options: IPhysicObjectOption = {}) {
        super(options);

        width *= PixiToBox2d;
        height *= PixiToBox2d;

        const fixtureDef = this.getFixtureDefs()[0];
        const shape = new Box2D.Collision.Shapes.b2PolygonShape();
        shape.SetAsArray([
            new Box2D.Common.Math.b2Vec2(0, 0),
            new Box2D.Common.Math.b2Vec2(width, 0),
            new Box2D.Common.Math.b2Vec2(width, height),
            new Box2D.Common.Math.b2Vec2(0, height),
        ]);

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
