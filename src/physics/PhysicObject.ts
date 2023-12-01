import { Container } from "pixi.js";
import { PixiToBox2d } from "./Utils";
import * as b2 from "box2d";

export interface IPhysicObjectOption {
    density?: number;
    friction?: number;
    restitution?: number;
    isStatic?: boolean;
    categoryBits?: number;
    maskBits?: number;
    isSensor?: boolean;
}

type TPhysicObjectBody = b2.Body | null;

export interface IPhysicObjectData {
    id: number;
    body: TPhysicObjectBody;
    bodyDef: b2.BodyDef;
    fixtureDefs: b2.FixtureDef[];
    maskBits: number;
}

function createBodyDef(isDynamic = false) {
    const bodyDef = new b2.BodyDef();
    isDynamic ? (bodyDef.type = b2.dynamicBody) : b2.staticBody;
    return bodyDef;
}

const dynamicBodyDef: b2.BodyDef = createBodyDef(true);
const staticBodyDef: b2.BodyDef = createBodyDef(false);

function createFixtureDef(options: IPhysicObjectOption = {}, pixi: Container) {
    const fixtureDef = new b2.FixtureDef();

    fixtureDef.density = typeof options.density === "number" ? options.density : fixtureDef.density;
    fixtureDef.friction = typeof options.friction === "number" ? options.friction : fixtureDef.friction;
    fixtureDef.restitution = typeof options.restitution === "number" ? options.restitution : fixtureDef.restitution;
    fixtureDef.filter.categoryBits =
        typeof options.categoryBits === "number" ? options.categoryBits : fixtureDef.filter.categoryBits;
    fixtureDef.filter.maskBits = typeof options.maskBits === "number" ? options.maskBits : fixtureDef.filter.maskBits;
    fixtureDef.isSensor = !!options.isSensor;
    fixtureDef.userData = pixi;

    return fixtureDef;
}

export class PhysicObject extends Container {
    protected _physicData: IPhysicObjectData;
    private static _id = 0;

    BeginContact?(opponent: PhysicObject): void {} // eslint-disable-line @typescript-eslint/no-empty-function
    EndContact?(opponent: PhysicObject): void {} // eslint-disable-line @typescript-eslint/no-empty-function
    PreSolve?(opponent: PhysicObject): void {} // eslint-disable-line @typescript-eslint/no-empty-function
    PostSolve?(opponent: PhysicObject): void {} // eslint-disable-line @typescript-eslint/no-empty-function

    constructor(options: IPhysicObjectOption = {}) {
        super();

        const fixtureDef = createFixtureDef(options, this);

        this._physicData = {
            id: PhysicObject._id++,
            body: null,
            bodyDef: options.isStatic ? staticBodyDef : dynamicBodyDef,
            fixtureDefs: [fixtureDef],
            maskBits: fixtureDef.filter.maskBits,
        };
    }

    public getBodyDef(): b2.BodyDef {
        return this._physicData.bodyDef;
    }

    public getFixtureDefs(): b2.FixtureDef[] {
        return this._physicData.fixtureDefs;
    }

    public get physicID(): number {
        return this._physicData.id;
    }

    public get body(): TPhysicObjectBody {
        return this._physicData.body;
    }

    public set body(body: TPhysicObjectBody) {
        this._physicData.body = body;
    }

    public setX(x: number): void {
        this.x = x;

        const body = this._physicData.body;
        if (!body) {
            return;
        }

        const p = body.GetPosition();
        body.SetPositionXY(x * PixiToBox2d, p.y);
    }

    public setY(y: number): void {
        this.y = y;

        const body = this._physicData.body;
        if (!body) {
            return;
        }

        const p = body.GetPosition();
        body.SetPositionXY(p.x, y * PixiToBox2d);
    }

    public setRotation(rotation: number): void {
        this.rotation = rotation;

        const body = this._physicData.body;
        if (!body) {
            return;
        }

        body.SetAngle(rotation);
    }

    public reflect(): void {
        this.setX(this.x);
        this.setY(this.y);
        this.setRotation(this.rotation);
        this.addMask(this._physicData.maskBits);
    }

    public addMask(bits: number): void {
        this._physicData.maskBits |= bits;

        if (!this._physicData.body) {
            return;
        }

        let list = this._physicData.body.GetFixtureList();

        while (list) {
            const data = list.GetFilterData();
            list.SetFilterData({
                ...data,
                maskBits: this._physicData.maskBits,
            });

            list = list.GetNext();
        }
    }

    public addAllMask(): void {
        this._physicData.maskBits = 65535;

        if (!this._physicData.body) {
            return;
        }

        let list = this._physicData.body.GetFixtureList();

        while (list) {
            const data = list.GetFilterData();
            list.SetFilterData({
                ...data,
                maskBits: 65535,
            });

            list = list.GetNext();
        }
    }

    public removeMask(bits: number): void {
        this._physicData.maskBits ^= this._physicData.maskBits & bits;

        if (!this._physicData.body) {
            return;
        }

        let list = this._physicData.body.GetFixtureList();

        while (list) {
            const data = list.GetFilterData();
            list.SetFilterData({
                ...data,
                maskBits: this._physicData.maskBits,
            });

            list = list.GetNext();
        }
    }

    public removeAllMask(): void {
        this._physicData.maskBits = 0;

        if (!this._physicData.body) {
            return;
        }

        let list = this._physicData.body.GetFixtureList();

        while (list) {
            const data = list.GetFilterData();
            list.SetFilterData({
                ...data,
                maskBits: 0,
            });

            list = list.GetNext();
        }
    }

    public toDynamic(): void {
        if (!this._physicData.body) {
            return;
        }

        this._physicData.body.SetType(b2.dynamicBody);
    }

    public toStatic(): void {
        if (!this._physicData.body) {
            return;
        }

        this._physicData.body.SetType(b2.staticBody);
    }
}

delete PhysicObject.prototype.BeginContact;
delete PhysicObject.prototype.EndContact;
delete PhysicObject.prototype.PreSolve;
delete PhysicObject.prototype.PostSolve;
