declare namespace GlobalMixins {
    interface DisplayObjectEvents extends FederatedEventEmitterTypes {
        [x: string | number | symbol]: any;
    }

    interface DisplayObject extends Omit<FederatedEventTarget, keyof IFederatedDisplayObject>, IFederatedDisplayObject {
        [x: string | number | symbol]: any;
    }
}
