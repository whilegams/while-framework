import { Container, Sprite, Ticker } from "pixi.js";
import { Box2dToPixi, PixiToBox2d } from "./Utils";
import { PhysicObject } from "./PhysicObject";
import * as b2 from "box2d";

export interface IWorldData {
    world: b2.World;
    listener: b2.ContactListener;
    enabled: boolean;
    speed: number;
    targets: { [id: number]: PhysicObject };
    deletes: { [id: number]: PhysicObject };
    displayOffsetX: number;
    displayOffsetY: number;
    displayAngle: number;
    perspectiveRatio: number;
    isDisplayNegative: boolean;
}

export interface IWorldOption {
    ticker: Ticker;
    gravityX?: number;
    gravityY?: number;
    allowSleep?: boolean;
    listenBeginContact?: boolean;
    listenEndContact?: boolean;
    listenPreSolve?: boolean;
    listenPostSolve?: boolean;
    displayOffsetX?: number;
    displayOffsetY?: number;
    displayAngle?: number;
    perspectiveRatio?: number;
    isDisplayNegative?: boolean;
}

function beginContactHandler(contact: b2.Contact) {
    const dataA = contact.GetFixtureA().GetUserData();
    const dataB = contact.GetFixtureB().GetUserData();

    dataA && dataA.emit && dataA.emit("BeginContact", dataB);
    dataB && dataB.emit && dataB.emit("BeginContact", dataA);
}

function endContactHandler(contact: b2.Contact) {
    const dataA = contact.GetFixtureA().GetUserData();
    const dataB = contact.GetFixtureB().GetUserData();

    dataA && dataA.emit && dataA.emit("EndContact", dataB);
    dataB && dataB.emit && dataB.emit("EndContact", dataA);
}

function preSolveHandler(contact: b2.Contact) {
    const dataA = contact.GetFixtureA().GetUserData();
    const dataB = contact.GetFixtureB().GetUserData();

    dataA && dataA.emit && dataA.emit("PreSolve", dataB);
    dataB && dataB.emit && dataB.emit("PreSolve", dataA);
}

function postSolveHandler(contact: b2.Contact) {
    const dataA = contact.GetFixtureA().GetUserData();
    const dataB = contact.GetFixtureB().GetUserData();

    dataA && dataA.emit && dataA.emit("PostSolve", dataB);
    dataB && dataB.emit && dataB.emit("PostSolve", dataA);
}

export class World extends Container {
    private _physicData: IWorldData;
    declare children: PhysicObject[];

    constructor(options: IWorldOption) {
        super();

        const gravityX = typeof options.gravityX === "number" ? options.gravityX : 0;
        const gravityY = typeof options.gravityY === "number" ? options.gravityY : 9.8;
        const allowSleep = !!options.allowSleep;

        const world = new b2.World(new b2.Vec2(gravityX, gravityY));

        world.SetAllowSleeping(allowSleep);

        this._physicData = {
            world,
            listener: new b2.ContactListener(),
            enabled: true,
            speed: 1,
            targets: {},
            deletes: {},
            displayOffsetX: options.displayOffsetX || 0,
            displayOffsetY: options.displayOffsetY || 0,
            displayAngle: options.displayAngle || 0,
            perspectiveRatio: options.perspectiveRatio || 1000,
            isDisplayNegative: options.isDisplayNegative || false,
        };

        this.on("added", () => {
            console.log("added");
            options.ticker.add(this._handleTick, this);
        });

        this.on("removed", () => {
            console.log("removed");
            options.ticker.remove(this._handleTick, this);
        });

        const listener = this._physicData.listener;
        if (options.listenBeginContact) {
            listener.BeginContact = beginContactHandler;
        }

        if (options.listenEndContact) {
            listener.EndContact = endContactHandler;
        }

        if (options.listenPreSolve) {
            listener.PreSolve = preSolveHandler;
        }

        if (options.listenPostSolve) {
            listener.PostSolve = postSolveHandler;
        }

        world.SetContactListener(listener);

        this.box2dEnabled = true;
    }

    public addDebugDraw(pixiCanvas: HTMLCanvasElement): HTMLCanvasElement {
        const canvas = document.createElement("canvas");

        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return canvas;
        }

        canvas.width = pixiCanvas.width;
        canvas.height = pixiCanvas.height;
        canvas.style.width = pixiCanvas.style.width;
        canvas.style.height = pixiCanvas.style.height;
        canvas.style.top = pixiCanvas.style.top || "0";
        canvas.style.left = pixiCanvas.style.left || "0";
        canvas.style.position = "absolute";
        canvas.style.pointerEvents = "none";
        canvas.style.zIndex = "100";

        /*
        const debugDraw = new b2.DebugDraw();
        debugDraw.SetSprite(ctx);
        debugDraw.SetDrawScale(Box2dToPixi);
        debugDraw.SetFillAlpha(0.5);
        debugDraw.SetLineThickness(1);
        debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit);

        this.world.SetDebugDraw(debugDraw);
         */

        return canvas;
    }

    private _handleTick(delta: number) {
        if (!this._physicData.enabled) {
            return;
        }

        const world = this._physicData.world;

        world.Step((delta * this._physicData.speed) / 30, 10, 10);
        world.ClearForces();
        world.DebugDraw();

        const targets = this._physicData.targets;

        for (const i in this._physicData.deletes) {
            const b2d = this._physicData.deletes[i];
            delete targets[i];
            if (b2d.body) {
                world.DestroyBody(b2d.body);
                b2d.body = null;
            }
        }
        this._physicData.deletes = [];
        this.reflect();
    }

    public reflect(): void {
        const targets = this._physicData.targets;

        const displayOffsetX = this._physicData.displayOffsetX;
        const displayOffsetY = this._physicData.displayOffsetY;
        const displayAngle = this._physicData.displayAngle;

        if (displayAngle === 0) {
            for (const i in targets) {
                const b2d = targets[i];

                if (!b2d.body) {
                    continue;
                }

                const position = b2d.body.GetPosition();

                b2d.y = position.y * Box2dToPixi - displayOffsetY;
                b2d.x = position.x * Box2dToPixi - displayOffsetX;
                b2d.rotation = b2d.body.GetAngle();
            }
        } else {
            const isDisplayNegative = this._physicData.isDisplayNegative;
            const ratio = this._physicData.perspectiveRatio * displayAngle;

            for (const i in targets) {
                const b2d = targets[i];

                if (!b2d.body) {
                    continue;
                }

                const position = b2d.body.GetPosition();

                b2d.y = position.y * Box2dToPixi - displayOffsetY;
                const s = 1 + b2d.y * displayAngle;

                if (!isDisplayNegative && s < 0) {
                    b2d.renderable = false;
                    continue;
                } else {
                    b2d.visible = true;
                }

                b2d.scale.set(s);
                b2d.x = (position.x * Box2dToPixi - displayOffsetX) * s;
                b2d.y *= s / ratio;
                b2d.rotation = b2d.body.GetAngle();
            }

            const children = this.removeChildren();
            const n = children.sort((a, b) => {
                if (a.y === b.y) {
                    return Math.abs(a.x) - Math.abs(b.x);
                }

                return a.y - b.y;
            });

            this.addChild(...n);
        }
    }

    public get speed(): number {
        return this._physicData.speed;
    }

    public set speed(speed: number) {
        this._physicData.speed = speed;
    }

    public get box2dEnabled(): boolean {
        return this._physicData.enabled;
    }

    public set box2dEnabled(flag: boolean) {
        this._physicData.enabled = flag;
    }

    public get world(): b2.World {
        return this._physicData.world;
    }

    public addBox2d(b2d: PhysicObject): PhysicObject {
        if (!b2d.body) {
            const body = this._physicData.world.CreateBody(b2d.getBodyDef());
            const fixtureDefs = b2d.getFixtureDefs();

            for (let i = 0; i < fixtureDefs.length; i++) {
                body.CreateFixture(fixtureDefs[i]);
            }

            b2d.body = body;

            body.SetPosition(new b2.Vec2(b2d.x * PixiToBox2d, b2d.y * PixiToBox2d));
            body.SetAngle(b2d.rotation);
        }

        b2d.reflect();
        this.addChild(b2d);
        this._physicData.targets[b2d.physicID] = b2d;
        delete this._physicData.deletes[b2d.physicID];

        return b2d;
    }

    public removeBox2d(b2d: PhysicObject): PhysicObject {
        this.removeChild(b2d);
        this._physicData.deletes[b2d.physicID] = b2d;

        return b2d;
    }

    public get displayOffsetX(): number {
        return this._physicData.displayOffsetX;
    }

    public set displayOffsetX(displayOffsetX: number) {
        this._physicData.displayOffsetX = displayOffsetX;
    }

    public get displayOffsetY(): number {
        return this._physicData.displayOffsetY;
    }

    public set displayOffsetY(displayOffsetY: number) {
        this._physicData.displayOffsetY = displayOffsetY;
    }

    public get displayAngle(): number {
        return this._physicData.displayAngle;
    }

    public set displayAngle(displayAngle: number) {
        this._physicData.displayAngle = displayAngle;
    }
}
